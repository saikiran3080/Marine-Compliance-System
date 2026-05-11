package com.marine_backend.controllers;

import com.marine_backend.dtos.ApiResponse;
import com.marine_backend.dtos.ComplianceDtos;
import com.marine_backend.services.ComplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/compliance")
@RequiredArgsConstructor
public class ComplianceController {
    private final ComplianceService complianceService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ComplianceDtos.ComplianceDashboardResponse> dashboard() {
        return ApiResponse.ok("Compliance dashboard fetched", complianceService.dashboard());
    }

    @GetMapping("/ship/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ComplianceDtos.ShipComplianceResponse> ship(@PathVariable UUID id) {
        return ApiResponse.ok("Ship compliance fetched", complianceService.shipCompliance(id));
    }
}
