package com.marine_backend.dtos;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public final class CrewDtos {
    private CrewDtos() {
    }

    public record CrewRequest(
            @NotNull UUID userId,
            UUID shipId,
            String rank,
            LocalDate joiningDate
    ) {
    }

    public record CrewResponse(
            UUID id,
            UserDto user,
            ShipDtos.ShipResponse ship,
            String rank,
            LocalDate joiningDate
    ) {
    }
}
