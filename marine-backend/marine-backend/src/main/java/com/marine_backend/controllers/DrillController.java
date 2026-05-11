package com.marine_backend.controllers;

import com.marine_backend.dtos.ApiResponse;
import com.marine_backend.dtos.DrillDtos;
import com.marine_backend.enums.DrillType;
import com.marine_backend.services.DrillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/drills")
@RequiredArgsConstructor
public class DrillController {
    private final DrillService drillService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<DrillDtos.DrillResponse>> all(
            @RequestParam(required = false) UUID shipId,
            @RequestParam(required = false) DrillType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Boolean completed,
            Pageable pageable
    ) {
        return ApiResponse.ok("Drills fetched", drillService.findAll(shipId, type, date, completed, pageable));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CREW')")
    public ApiResponse<Page<DrillDtos.DrillResponse>> my(Pageable pageable) {
        return ApiResponse.ok("Assigned drills fetched", drillService.myDrills(pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DrillDtos.DrillResponse> create(@Valid @RequestBody DrillDtos.DrillRequest request) {
        return ApiResponse.ok("Drill scheduled", drillService.create(request));
    }

    @PutMapping("/{id}/attendance")
    @PreAuthorize("hasAnyRole('ADMIN','CREW')")
    public ApiResponse<DrillDtos.ParticipationResponse> attendance(
            @PathVariable UUID id,
            @Valid @RequestBody DrillDtos.AttendanceRequest request
    ) {
        return ApiResponse.ok("Drill attendance updated", drillService.updateAttendance(id, request));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<DrillDtos.DrillResponse> complete(@PathVariable UUID id) {
        return ApiResponse.ok("Drill completed", drillService.completeDrill(id));
    }

    @PutMapping("/{id}/completion")
    @PreAuthorize("hasRole('CREW')")
    public ApiResponse<DrillDtos.ParticipationResponse> completion(
            @PathVariable UUID id,
            @RequestBody(required = false) DrillDtos.CompletionRequest request
    ) {
        String remarks = request == null ? null : request.remarks();
        return ApiResponse.ok("Drill completion submitted", drillService.submitMyCompletion(id, remarks));
    }
}
