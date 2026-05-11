package com.marine_backend.controllers;

import com.marine_backend.dtos.ApiResponse;
import com.marine_backend.dtos.MaintenanceDtos;
import com.marine_backend.enums.MaintenanceStatus;
import com.marine_backend.services.MaintenanceService;
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
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class MaintenanceController {
    private final MaintenanceService maintenanceService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<MaintenanceDtos.MaintenanceTaskResponse>> tasks(
            @RequestParam(required = false) UUID shipId,
            @RequestParam(required = false) MaintenanceStatus status,
            @RequestParam(required = false) UUID assignedCrewId,
            @RequestParam(required = false) Boolean overdue,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable
    ) {
        return ApiResponse.ok("Maintenance tasks fetched", maintenanceService.findTasks(shipId, status, assignedCrewId, overdue, fromDate, toDate, pageable));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CREW')")
    public ApiResponse<Page<MaintenanceDtos.MaintenanceTaskResponse>> myTasks(Pageable pageable) {
        return ApiResponse.ok("Assigned maintenance tasks fetched", maintenanceService.myTasks(pageable));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<MaintenanceDtos.MaintenanceTaskResponse>> overdue(Pageable pageable) {
        return ApiResponse.ok("Overdue maintenance tasks fetched", maintenanceService.overdue(pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MaintenanceDtos.MaintenanceTaskResponse> create(@Valid @RequestBody MaintenanceDtos.MaintenanceTaskRequest request) {
        return ApiResponse.ok("Maintenance task created", maintenanceService.create(request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','CREW')")
    public ApiResponse<MaintenanceDtos.MaintenanceTaskResponse> status(
            @PathVariable UUID id,
            @Valid @RequestBody MaintenanceDtos.StatusUpdateRequest request
    ) {
        return ApiResponse.ok("Maintenance task status updated", maintenanceService.updateStatus(id, request));
    }

    @PutMapping("/{id}/assign/{crewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<MaintenanceDtos.MaintenanceTaskResponse> assign(@PathVariable UUID id, @PathVariable UUID crewId) {
        return ApiResponse.ok("Maintenance task assigned", maintenanceService.assign(id, crewId));
    }

    @PostMapping("/{id}/notes")
    @PreAuthorize("hasAnyRole('ADMIN','CREW')")
    public ApiResponse<MaintenanceDtos.NoteResponse> note(
            @PathVariable UUID id,
            @Valid @RequestBody MaintenanceDtos.NoteRequest request
    ) {
        return ApiResponse.ok("Maintenance note added", maintenanceService.addNote(id, request));
    }
}
