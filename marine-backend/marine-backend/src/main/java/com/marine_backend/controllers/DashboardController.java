package com.marine_backend.controllers;

import com.marine_backend.dtos.ApiResponse;
import com.marine_backend.dtos.DashboardDtos;
import com.marine_backend.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DashboardDtos.AdminDashboardResponse> admin() {
        return ApiResponse.ok("Admin dashboard fetched", dashboardService.admin());
    }

    @GetMapping("/crew")
    @PreAuthorize("hasRole('CREW')")
    public ApiResponse<DashboardDtos.CrewDashboardResponse> crew() {
        return ApiResponse.ok("Crew dashboard fetched", dashboardService.crew());
    }
}
