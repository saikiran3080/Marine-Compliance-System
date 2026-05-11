package com.marine_backend.controllers;

import com.marine_backend.dtos.ApiResponse;
import com.marine_backend.dtos.AuthResponseDto;
import com.marine_backend.dtos.LoginRequestDto;
import com.marine_backend.dtos.RegisterRequestDto;
import com.marine_backend.dtos.UserDto;
import com.marine_backend.mappers.EntityMapper;
import com.marine_backend.services.AuthService;
import com.marine_backend.services.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final CurrentUserService currentUserService;
    private final EntityMapper mapper;

    @PostMapping("/register")
    public ApiResponse<AuthResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        return ApiResponse.ok("Registered successfully", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return ApiResponse.ok("Logged in successfully", authService.login(request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN','CREW')")
    public ApiResponse<UserDto> me() {
        return ApiResponse.ok("Current user fetched", mapper.toUserDto(currentUserService.getCurrentUser()));
    }
}
