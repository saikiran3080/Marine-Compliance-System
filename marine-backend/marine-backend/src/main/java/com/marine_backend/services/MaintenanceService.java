package com.marine_backend.services;

import com.marine_backend.dtos.MaintenanceDtos;
import com.marine_backend.entities.Crew;
import com.marine_backend.entities.MaintenanceNote;
import com.marine_backend.entities.MaintenanceTask;
import com.marine_backend.enums.MaintenanceStatus;
import com.marine_backend.enums.Priority;
import com.marine_backend.exception.ResourceNotFoundException;
import com.marine_backend.mappers.EntityMapper;
import com.marine_backend.repositories.CrewRepository;
import com.marine_backend.repositories.MaintenanceNoteRepository;
import com.marine_backend.repositories.MaintenanceTaskRepository;
import com.marine_backend.repositories.specifications.MaintenanceTaskSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaintenanceService {
    private final MaintenanceTaskRepository taskRepository;
    private final MaintenanceNoteRepository noteRepository;
    private final CrewRepository crewRepository;
    private final ShipService shipService;
    private final CurrentUserService currentUserService;
    private final AuthorizationService authorizationService;
    private final EntityMapper mapper;

    @Transactional(readOnly = true)
    public Page<MaintenanceDtos.MaintenanceTaskResponse> findTasks(
            UUID shipId,
            MaintenanceStatus status,
            UUID assignedCrewId,
            Boolean overdue,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable
    ) {
        return taskRepository.findAll(
                MaintenanceTaskSpecifications.filters(shipId, status, assignedCrewId, overdue, fromDate, toDate),
                pageable
        ).map(mapper::toTaskResponse);
    }

    @Transactional(readOnly = true)
    public Page<MaintenanceDtos.MaintenanceTaskResponse> myTasks(Pageable pageable) {
        return taskRepository.findByAssignedCrewId(authorizationService.currentCrew().getId(), pageable)
                .map(mapper::toTaskResponse);
    }

    @Transactional(readOnly = true)
    public Page<MaintenanceDtos.MaintenanceTaskResponse> overdue(Pageable pageable) {
        return taskRepository.findOverdue(LocalDateTime.now(), pageable).map(mapper::toTaskResponse);
    }

    @Transactional
    public MaintenanceDtos.MaintenanceTaskResponse create(MaintenanceDtos.MaintenanceTaskRequest request) {
        Crew assignedCrew = request.assignedCrewId() == null ? null : crewRepository.findById(request.assignedCrewId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned crew not found"));
        MaintenanceTask task = MaintenanceTask.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority() == null ? Priority.MEDIUM : request.priority())
                .status(request.status() == null ? MaintenanceStatus.PENDING : request.status())
                .dueDate(request.dueDate())
                .ship(shipService.getShip(request.shipId()))
                .assignedCrew(assignedCrew)
                .createdBy(currentUserService.getCurrentUser())
                .build();
        MaintenanceTask saved = taskRepository.save(task);
        saved.setNotes(List.of());
        return mapper.toTaskResponse(saved);
    }

    @Transactional
    public MaintenanceDtos.MaintenanceTaskResponse updateStatus(UUID id, MaintenanceDtos.StatusUpdateRequest request) {
        MaintenanceTask task = getTask(id);
        requireTaskOwnerIfCrew(task);
        task.setStatus(request.status());
        task.setCompletedAt(request.status() == MaintenanceStatus.COMPLETED ? LocalDateTime.now() : null);
        return mapper.toTaskResponse(task);
    }

    @Transactional
    public MaintenanceDtos.MaintenanceTaskResponse assign(UUID taskId, UUID crewId) {
        MaintenanceTask task = getTask(taskId);
        Crew crew = crewRepository.findById(crewId).orElseThrow(() -> new ResourceNotFoundException("Crew not found"));
        task.setAssignedCrew(crew);
        return mapper.toTaskResponse(task);
    }

    @Transactional
    public MaintenanceDtos.NoteResponse addNote(UUID taskId, MaintenanceDtos.NoteRequest request) {
        MaintenanceTask task = getTask(taskId);
        if (!authorizationService.isAdmin()) {
            requireTaskOwnerIfCrew(task);
        }
        Crew crew = authorizationService.isAdmin() ? resolveCrew(request.crewId()) : authorizationService.currentCrew();
        MaintenanceNote note = MaintenanceNote.builder()
                .task(task)
                .crew(crew)
                .note(request.note())
                .build();
        return mapper.toNoteResponse(noteRepository.save(note));
    }

    @Transactional(readOnly = true)
    public MaintenanceTask getTask(UUID id) {
        return taskRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Maintenance task not found"));
    }

    private Crew resolveCrew(UUID crewId) {
        if (crewId != null) {
            return crewRepository.findById(crewId).orElseThrow(() -> new ResourceNotFoundException("Crew not found"));
        }
        return crewRepository.findByUserId(currentUserService.getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Crew profile not found for current user"));
    }

    private void requireTaskOwnerIfCrew(MaintenanceTask task) {
        if (authorizationService.isAdmin()) {
            return;
        }
        if (task.getAssignedCrew() == null) {
            throw new AccessDeniedException("Task is not assigned to your crew profile");
        }
        authorizationService.requireAdminOrCrew(task.getAssignedCrew().getId());
    }
}
