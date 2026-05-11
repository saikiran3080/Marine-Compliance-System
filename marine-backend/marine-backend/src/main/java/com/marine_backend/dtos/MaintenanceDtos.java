package com.marine_backend.dtos;

import com.marine_backend.enums.MaintenanceStatus;
import com.marine_backend.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public final class MaintenanceDtos {
    private MaintenanceDtos() {
    }

    public record MaintenanceTaskRequest(
            @NotBlank String title,
            String description,
            Priority priority,
            MaintenanceStatus status,
            @NotNull LocalDateTime dueDate,
            @NotNull UUID shipId,
            UUID assignedCrewId
    ) {
    }

    public record StatusUpdateRequest(@NotNull MaintenanceStatus status) {
    }

    public record NoteRequest(@NotBlank String note, UUID crewId) {
    }

    public record NoteResponse(UUID id, UUID crewId, String crewName, String note) {
    }

    public record MaintenanceTaskResponse(
            UUID id,
            String title,
            String description,
            Priority priority,
            MaintenanceStatus status,
            LocalDateTime dueDate,
            LocalDateTime completedAt,
            UUID shipId,
            String shipName,
            UUID assignedCrewId,
            String assignedCrewName,
            UUID createdById,
            boolean overdue,
            boolean complianceImpacted,
            List<NoteResponse> notes
    ) {
    }
}
