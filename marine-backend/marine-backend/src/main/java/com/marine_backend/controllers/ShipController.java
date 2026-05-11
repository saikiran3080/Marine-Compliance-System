package com.marine_backend.controllers;

import com.marine_backend.dtos.ApiResponse;
import com.marine_backend.dtos.ShipDtos;
import com.marine_backend.services.ShipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/ships")
@RequiredArgsConstructor
public class ShipController {
    private final ShipService shipService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','CREW')")
    public ApiResponse<Page<ShipDtos.ShipResponse>> all(Pageable pageable) {
        return ApiResponse.ok("Ships fetched", shipService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','CREW')")
    public ApiResponse<ShipDtos.ShipResponse> one(@PathVariable UUID id) {
        return ApiResponse.ok("Ship fetched", shipService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ShipDtos.ShipResponse> create(@Valid @RequestBody ShipDtos.ShipRequest request) {
        return ApiResponse.ok("Ship created", shipService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ShipDtos.ShipResponse> update(@PathVariable UUID id, @Valid @RequestBody ShipDtos.ShipRequest request) {
        return ApiResponse.ok("Ship updated", shipService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        shipService.delete(id);
        return ApiResponse.ok("Ship deleted", null);
    }
}
