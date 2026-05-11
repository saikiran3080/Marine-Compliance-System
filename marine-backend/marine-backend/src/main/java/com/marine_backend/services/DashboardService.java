package com.marine_backend.services;

import com.marine_backend.dtos.DashboardDtos;
import com.marine_backend.enums.MaintenanceStatus;
import com.marine_backend.repositories.CrewRepository;
import com.marine_backend.repositories.DrillParticipationRepository;
import com.marine_backend.repositories.DrillRepository;
import com.marine_backend.repositories.MaintenanceTaskRepository;
import com.marine_backend.repositories.ShipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ShipRepository shipRepository;
    private final CrewRepository crewRepository;
    private final MaintenanceTaskRepository taskRepository;
    private final DrillRepository drillRepository;
    private final DrillParticipationRepository participationRepository;
    private final ComplianceService complianceService;
    private final AuthorizationService authorizationService;
    private final NotificationService notificationService;

    public DashboardDtos.AdminDashboardResponse admin() {
        var compliance = complianceService.dashboard();
        var highRiskShips = shipRepository.findAll().stream()
                .map(ship -> {
                    var shipCompliance = complianceService.shipCompliance(ship.getId());
                    return new DashboardDtos.ShipRiskSummary(
                            ship.getId(),
                            ship.getName(),
                            shipCompliance.overdueMaintenance(),
                            shipCompliance.missedDrills(),
                            shipCompliance.overallCompliance()
                    );
                })
                .filter(ship -> ship.overdueMaintenance() > 0 || ship.missedDrills() > 0 || ship.compliancePercentage() < 80.0)
                .sorted(Comparator.comparing(DashboardDtos.ShipRiskSummary::compliancePercentage))
                .limit(5)
                .toList();
        return new DashboardDtos.AdminDashboardResponse(
                shipRepository.count(),
                crewRepository.count(),
                compliance.pendingMaintenance(),
                compliance.overdueMaintenance(),
                drillRepository.countByScheduledDateAfter(LocalDateTime.now()),
                compliance.missedDrills(),
                compliance.overallCompliance(),
                highRiskShips
        );
    }

    public DashboardDtos.CrewDashboardResponse crew() {
        var crew = authorizationService.currentCrew();
        long assignedTasks = taskRepository.countByAssignedCrewId(crew.getId());
        long pendingTasks = taskRepository.countByAssignedCrewIdAndStatus(crew.getId(), MaintenanceStatus.PENDING)
                + taskRepository.countByAssignedCrewIdAndStatus(crew.getId(), MaintenanceStatus.IN_PROGRESS);
        long upcomingDrills = participationRepository.countByCrewIdAndDrillScheduledDateAfter(crew.getId(), LocalDateTime.now());
        long attendanceTotal = participationRepository.countByCrewId(crew.getId());
        long attended = participationRepository.countByCrewIdAndAttendedTrue(crew.getId());
        double attendancePercentage = attendanceTotal == 0 ? 100.0 : Math.round(attended * 10000.0 / attendanceTotal) / 100.0;
        return new DashboardDtos.CrewDashboardResponse(
                assignedTasks,
                pendingTasks,
                upcomingDrills,
                attendancePercentage,
                notificationService.crewNotifications(crew)
        );
    }
}
