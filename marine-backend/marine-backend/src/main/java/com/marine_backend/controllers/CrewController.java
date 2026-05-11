package com.marine_backend.controllers;

import com.marine_backend.dtos.ApiResponse;
import com.marine_backend.dtos.CrewDtos;
import com.marine_backend.services.CrewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/crew")
@RequiredArgsConstructor
public class CrewController {
    private final CrewService crewService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<CrewDtos.CrewResponse>> all(Pageable pageable) {
        return ApiResponse.ok("Crew fetched", crewService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CrewDtos.CrewResponse> one(@PathVariable UUID id) {
        return ApiResponse.ok("Crew fetched", crewService.findById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CREW')")
    public ApiResponse<CrewDtos.CrewResponse> me() {
        return ApiResponse.ok("Crew profile fetched", crewService.me());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CrewDtos.CrewResponse> create(@Valid @RequestBody CrewDtos.CrewRequest request) {
        return ApiResponse.ok("Crew created", crewService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CrewDtos.CrewResponse> update(@PathVariable UUID id, @Valid @RequestBody CrewDtos.CrewRequest request) {
        return ApiResponse.ok("Crew updated", crewService.update(id, request));
    }
}
