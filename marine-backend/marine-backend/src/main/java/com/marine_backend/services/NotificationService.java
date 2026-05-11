package com.marine_backend.services;

import com.marine_backend.dtos.NotificationDto;
import com.marine_backend.entities.Crew;
import com.marine_backend.enums.MaintenanceStatus;
import com.marine_backend.repositories.DrillParticipationRepository;
import com.marine_backend.repositories.MaintenanceTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final MaintenanceTaskRepository taskRepository;
    private final DrillParticipationRepository participationRepository;
    private final AuthorizationService authorizationService;

    public List<NotificationDto> currentUserNotifications() {
        if (authorizationService.isAdmin()) {
            return adminNotifications();
        }
        return crewNotifications(authorizationService.currentCrew());
    }

    public List<NotificationDto> crewNotifications(Crew crew) {
        LocalDateTime now = LocalDateTime.now();
        var overdueTasks = taskRepository.findAll((root, query, cb) -> cb.and(
                        cb.equal(root.get("assignedCrew").get("id"), crew.getId()),
                        cb.lessThan(root.get("dueDate"), now),
                        cb.notEqual(root.get("status"), MaintenanceStatus.COMPLETED)
                )).stream()
                .map(task -> new NotificationDto("OVERDUE_TASK", "Maintenance task is overdue: " + task.getTitle(), task.getId(), task.getDueDate()));
        var upcomingDrills = participationRepository.findByCrewId(crew.getId()).stream()
                .filter(participation -> participation.getDrill() != null
                        && participation.getDrill().getScheduledDate() != null
                        && participation.getDrill().getScheduledDate().isAfter(now)
                        && !Boolean.TRUE.equals(participation.getCompleted()))
                .map(participation -> new NotificationDto(
                        "UPCOMING_DRILL",
                        "Upcoming drill: " + participation.getDrill().getTitle(),
                        participation.getDrill().getId(),
                        participation.getDrill().getScheduledDate()
                ));
        return Stream.concat(overdueTasks, upcomingDrills)
                .sorted(Comparator.comparing(NotificationDto::dueAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(10)
                .toList();
    }

    private List<NotificationDto> adminNotifications() {
        LocalDateTime now = LocalDateTime.now();
        return taskRepository.findAll((root, query, cb) -> cb.and(
                        cb.lessThan(root.get("dueDate"), now),
                        cb.notEqual(root.get("status"), MaintenanceStatus.COMPLETED)
                )).stream()
                .map(task -> new NotificationDto("OVERDUE_TASK", "Overdue maintenance: " + task.getTitle(), task.getId(), task.getDueDate()))
                .sorted(Comparator.comparing(NotificationDto::dueAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(10)
                .toList();
    }
}
