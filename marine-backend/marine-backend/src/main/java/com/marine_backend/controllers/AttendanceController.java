package com.marine_backend.controllers;

import com.marine_backend.dtos.ApiResponse;
import com.marine_backend.dtos.DrillDtos;
import com.marine_backend.services.DrillService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final DrillService drillService;

    @GetMapping("/my")
    @PreAuthorize("hasRole('CREW')")
    public ApiResponse<Page<DrillDtos.AttendanceHistoryResponse>> myAttendance(Pageable pageable) {
        return ApiResponse.ok("Attendance history fetched", drillService.myAttendance(pageable));
    }
}
