package com.marine_backend.dtos;

import com.marine_backend.enums.Role;

import java.util.UUID;

public record AuthResponseDto(
        String token,
        UUID userId,
        String name,
        String email,
        Role role
) {
}
