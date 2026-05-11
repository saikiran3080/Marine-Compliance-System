package com.marine_backend.dtos;

import java.util.UUID;

public final class ComplianceDtos {
    private ComplianceDtos() {
    }

    public record ComplianceDashboardResponse(
            long pendingMaintenance,
            long overdueMaintenance,
            double maintenanceCompletionRate,
            double drillParticipationRate,
            long missedDrills,
            double overallCompliance
    ) {
    }

    public record ShipComplianceResponse(
            UUID shipId,
            String shipName,
            long totalMaintenance,
            long completedMaintenance,
            long overdueMaintenance,
            double maintenanceCompletionRate,
            double drillParticipationRate,
            long missedDrills,
            double overallCompliance
    ) {
    }
}
