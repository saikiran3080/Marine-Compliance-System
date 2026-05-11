package com.marine_backend.services;

import com.marine_backend.dtos.ComplianceDtos;
import com.marine_backend.entities.Ship;
import com.marine_backend.enums.MaintenanceStatus;
import com.marine_backend.repositories.DrillParticipationRepository;
import com.marine_backend.repositories.DrillRepository;
import com.marine_backend.repositories.MaintenanceTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComplianceService {
    private final MaintenanceTaskRepository taskRepository;
    private final DrillRepository drillRepository;
    private final DrillParticipationRepository participationRepository;
    private final ShipService shipService;

    public ComplianceDtos.ComplianceDashboardResponse dashboard() {
        long totalMaintenance = taskRepository.count();
        long completedMaintenance = taskRepository.countByStatus(MaintenanceStatus.COMPLETED);
        long pendingMaintenance = taskRepository.countByStatus(MaintenanceStatus.PENDING)
                + taskRepository.countByStatus(MaintenanceStatus.IN_PROGRESS);
        long overdueMaintenance = taskRepository.countByDueDateBeforeAndStatusNot(LocalDateTime.now(), MaintenanceStatus.COMPLETED);
        long totalParticipations = participationRepository.count();
        long attendedParticipations = participationRepository.countByAttendedTrue();
        long completedDrillParticipations = participationRepository.countByCompletedTrue();
        long pastDrills = drillRepository.countByScheduledDateBefore(LocalDateTime.now());
        long missedDrills = Math.max(0, pastDrills - completedDrillParticipations);
        double maintenanceRate = percentage(completedMaintenance, totalMaintenance);
        double drillRate = percentage(attendedParticipations, totalParticipations);
        return new ComplianceDtos.ComplianceDashboardResponse(
                pendingMaintenance,
                overdueMaintenance,
                maintenanceRate,
                drillRate,
                missedDrills,
                overall(maintenanceRate, drillRate)
        );
    }

    public ComplianceDtos.ShipComplianceResponse shipCompliance(UUID shipId) {
        Ship ship = shipService.getShip(shipId);
        long totalMaintenance = taskRepository.countByShipId(shipId);
        long completedMaintenance = taskRepository.countByShipIdAndStatus(shipId, MaintenanceStatus.COMPLETED);
        long overdueMaintenance = taskRepository.countByShipIdAndDueDateBeforeAndStatusNot(
                shipId,
                LocalDateTime.now(),
                MaintenanceStatus.COMPLETED
        );
        long totalParticipations = participationRepository.countByDrillShipId(shipId);
        long attendedParticipations = participationRepository.countByDrillShipIdAndAttendedTrue(shipId);
        long completedDrillParticipations = participationRepository.countByDrillShipIdAndCompletedTrue(shipId);
        long pastDrills = drillRepository.countByShipIdAndScheduledDateBefore(shipId, LocalDateTime.now());
        long missedDrills = Math.max(0, pastDrills - completedDrillParticipations);
        double maintenanceRate = percentage(completedMaintenance, totalMaintenance);
        double drillRate = percentage(attendedParticipations, totalParticipations);
        return new ComplianceDtos.ShipComplianceResponse(
                ship.getId(),
                ship.getName(),
                totalMaintenance,
                completedMaintenance,
                overdueMaintenance,
                maintenanceRate,
                drillRate,
                missedDrills,
                overall(maintenanceRate, drillRate)
        );
    }

    private double percentage(long numerator, long denominator) {
        if (denominator == 0) {
            return 100.0;
        }
        return Math.round((numerator * 10000.0 / denominator)) / 100.0;
    }

    private double overall(double maintenanceCompletionRate, double drillParticipationRate) {
        return Math.round(((maintenanceCompletionRate * 0.6) + (drillParticipationRate * 0.4)) * 100.0) / 100.0;
    }
}
