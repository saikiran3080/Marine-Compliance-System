package com.marine_backend.dtos;

import com.marine_backend.enums.DrillType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public final class DrillDtos {
    private DrillDtos() {
    }

    public record DrillRequest(
            @NotBlank String title,
            DrillType type,
            @NotNull LocalDateTime scheduledDate,
            @NotNull UUID shipId,
            List<UUID> crewIds
    ) {
    }

    public record AttendanceRequest(
            @NotNull UUID crewId,
            Boolean attended,
            Boolean completed,
            String remarks
    ) {
    }

    public record CompletionRequest(String remarks) {
    }

    public record ParticipationResponse(
            UUID id,
            UUID crewId,
            String crewName,
            Boolean attended,
            Boolean completed,
            String remarks
    ) {
    }

    public record DrillResponse(
            UUID id,
            String title,
            DrillType type,
            LocalDateTime scheduledDate,
            UUID shipId,
            String shipName,
            UUID createdById,
            List<ParticipationResponse> participations
    ) {
    }

    public record AttendanceHistoryResponse(
            UUID participationId,
            UUID drillId,
            String drillTitle,
            LocalDateTime scheduledDate,
            UUID shipId,
            String shipName,
            Boolean attended,
            Boolean completed,
            String remarks
    ) {
    }
}
