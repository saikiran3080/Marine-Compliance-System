package com.marine_backend.dtos;

import com.marine_backend.enums.Role;

import java.util.UUID;

public record UserDto(UUID id, String name, String email, Role role) {
}
