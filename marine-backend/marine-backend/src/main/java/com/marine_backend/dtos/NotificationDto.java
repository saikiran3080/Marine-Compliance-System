package com.marine_backend.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationDto(
        String type,
        String message,
        UUID referenceId,
        LocalDateTime dueAt
) {
}
