package com.marine_backend.dtos;

import com.marine_backend.enums.ShipStatus;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public final class ShipDtos {
    private ShipDtos() {
    }

    public record ShipRequest(
            @NotBlank String name,
            String imoNumber,
            String type,
            ShipStatus status
    ) {
    }

    public record ShipResponse(
            UUID id,
            String name,
            String imoNumber,
            String type,
            ShipStatus status
    ) {
    }
}
