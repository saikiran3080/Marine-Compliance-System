package com.marine_backend.services;

import com.marine_backend.dtos.DrillDtos;
import com.marine_backend.entities.Crew;
import com.marine_backend.entities.Drill;
import com.marine_backend.entities.DrillParticipation;
import com.marine_backend.exception.ResourceNotFoundException;
import com.marine_backend.mappers.EntityMapper;
import com.marine_backend.repositories.CrewRepository;
import com.marine_backend.repositories.DrillParticipationRepository;
import com.marine_backend.repositories.DrillRepository;
import com.marine_backend.repositories.specifications.DrillSpecifications;
import com.marine_backend.enums.DrillType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DrillService {
    private final DrillRepository drillRepository;
    private final DrillParticipationRepository participationRepository;
    private final CrewRepository crewRepository;
    private final ShipService shipService;
    private final CurrentUserService currentUserService;
    private final AuthorizationService authorizationService;
    private final EntityMapper mapper;

    @Transactional(readOnly = true)
    public Page<DrillDtos.DrillResponse> findAll(UUID shipId, DrillType type, LocalDate date, Boolean completed, Pageable pageable) {
        return drillRepository.findAll(DrillSpecifications.filters(shipId, type, date, completed), pageable)
                .map(mapper::toDrillResponse);
    }

    @Transactional(readOnly = true)
    public Page<DrillDtos.DrillResponse> myDrills(Pageable pageable) {
        UUID crewId = authorizationService.currentCrew().getId();
        return participationRepository.findByCrewId(crewId, pageable)
                .map(DrillParticipation::getDrill)
                .map(mapper::toDrillResponse);
    }

    @Transactional(readOnly = true)
    public Page<DrillDtos.AttendanceHistoryResponse> myAttendance(Pageable pageable) {
        return participationRepository.findByCrewId(authorizationService.currentCrew().getId(), pageable)
                .map(mapper::toAttendanceHistoryResponse);
    }

    @Transactional
    public DrillDtos.DrillResponse create(DrillDtos.DrillRequest request) {
        Drill drill = Drill.builder()
                .title(request.title())
                .type(request.type())
                .scheduledDate(request.scheduledDate())
                .ship(shipService.getShip(request.shipId()))
                .createdBy(currentUserService.getCurrentUser())
                .build();
        Drill saved = drillRepository.save(drill);
        List<DrillParticipation> participations = request.crewIds() == null ? List.of() : request.crewIds().stream()
                .map(crewId -> crewRepository.findById(crewId).orElseThrow(() -> new ResourceNotFoundException("Crew not found")))
                .map(crew -> DrillParticipation.builder()
                        .drill(saved)
                        .crew(crew)
                        .attended(false)
                        .completed(false)
                        .build())
                .map(participationRepository::save)
                .toList();
        saved.setParticipations(participations);
        return mapper.toDrillResponse(saved);
    }

    @Transactional
    public DrillDtos.ParticipationResponse updateAttendance(UUID drillId, DrillDtos.AttendanceRequest request) {
        Drill drill = getDrill(drillId);
        UUID crewId = authorizationService.isAdmin() ? request.crewId() : authorizationService.currentCrew().getId();
        if (!authorizationService.isAdmin() && !crewId.equals(request.crewId())) {
            throw new AccessDeniedException("You can only update your own drill attendance");
        }
        Crew crew = crewRepository.findById(crewId).orElseThrow(() -> new ResourceNotFoundException("Crew not found"));
        DrillParticipation participation = participationRepository.findByDrillIdAndCrewId(drillId, crewId)
                .orElseGet(() -> DrillParticipation.builder().drill(drill).crew(crew).build());
        participation.setAttended(Boolean.TRUE.equals(request.attended()));
        participation.setCompleted(Boolean.TRUE.equals(request.completed()));
        participation.setRemarks(request.remarks());
        return mapper.toParticipationResponse(participationRepository.save(participation));
    }

    @Transactional
    public DrillDtos.DrillResponse completeDrill(UUID drillId) {
        Drill drill = getDrill(drillId);
        List<DrillParticipation> participations = participationRepository.findByDrillId(drillId);
        participations.forEach(participation -> {
            if (Boolean.TRUE.equals(participation.getAttended())) {
                participation.setCompleted(true);
            }
        });
        drill.setParticipations(participations);
        return mapper.toDrillResponse(drill);
    }

    @Transactional
    public DrillDtos.ParticipationResponse submitMyCompletion(UUID drillId, String remarks) {
        UUID crewId = authorizationService.currentCrew().getId();
        DrillParticipation participation = participationRepository.findByDrillIdAndCrewId(drillId, crewId)
                .orElseThrow(() -> new AccessDeniedException("Drill is not assigned to your crew profile"));
        participation.setCompleted(true);
        participation.setAttended(true);
        if (remarks != null) {
            participation.setRemarks(remarks);
        }
        return mapper.toParticipationResponse(participation);
    }

    @Transactional(readOnly = true)
    public Drill getDrill(UUID id) {
        return drillRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Drill not found"));
    }
}
