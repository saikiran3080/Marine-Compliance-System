package com.marine_backend.dtos;

import java.util.List;

public final class DashboardDtos {
    private DashboardDtos() {
    }

    public record AdminDashboardResponse(
            long totalShips,
            long totalCrew,
            long pendingMaintenanceCount,
            long overdueMaintenanceCount,
            long upcomingDrills,
            long missedDrills,
            double compliancePercentage,
            List<ShipRiskSummary> highRiskShips
    ) {
    }

    public record ShipRiskSummary(
            java.util.UUID shipId,
            String shipName,
            long overdueMaintenance,
            long missedDrills,
            double compliancePercentage
    ) {
    }

    public record CrewDashboardResponse(
            long assignedTasks,
            long pendingTasks,
            long upcomingDrills,
            double attendancePercentage,
            List<NotificationDto> notifications
    ) {
    }
}
