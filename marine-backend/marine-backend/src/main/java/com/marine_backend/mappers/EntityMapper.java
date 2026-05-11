package com.marine_backend.mappers;

import com.marine_backend.dtos.CrewDtos;
import com.marine_backend.dtos.DrillDtos;
import com.marine_backend.dtos.MaintenanceDtos;
import com.marine_backend.dtos.ShipDtos;
import com.marine_backend.dtos.UserDto;
import com.marine_backend.entities.Crew;
import com.marine_backend.entities.Drill;
import com.marine_backend.entities.DrillParticipation;
import com.marine_backend.entities.MaintenanceNote;
import com.marine_backend.entities.MaintenanceTask;
import com.marine_backend.entities.Ship;
import com.marine_backend.entities.User;
import com.marine_backend.enums.MaintenanceStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
public class EntityMapper {
    public UserDto toUserDto(User user) {
        if (user == null) {
            return null;
        }
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public ShipDtos.ShipResponse toShipResponse(Ship ship) {
        if (ship == null) {
            return null;
        }
        return new ShipDtos.ShipResponse(ship.getId(), ship.getName(), ship.getImoNumber(), ship.getType(), ship.getStatus());
    }

    public CrewDtos.CrewResponse toCrewResponse(Crew crew) {
        if (crew == null) {
            return null;
        }
        return new CrewDtos.CrewResponse(
                crew.getId(),
                toUserDto(crew.getUser()),
                toShipResponse(crew.getShip()),
                crew.getRank(),
                crew.getJoiningDate()
        );
    }

    public MaintenanceDtos.NoteResponse toNoteResponse(MaintenanceNote note) {
        Crew crew = note.getCrew();
        User user = crew == null ? null : crew.getUser();
        return new MaintenanceDtos.NoteResponse(
                note.getId(),
                crew == null ? null : crew.getId(),
                user == null ? null : user.getName(),
                note.getNote()
        );
    }

    public MaintenanceDtos.MaintenanceTaskResponse toTaskResponse(MaintenanceTask task) {
        LocalDateTime now = LocalDateTime.now();
        boolean overdue = task.getDueDate() != null
                && task.getDueDate().isBefore(now)
                && task.getStatus() != MaintenanceStatus.COMPLETED;
        List<MaintenanceDtos.NoteResponse> notes = task.getNotes() == null
                ? List.of()
                : task.getNotes().stream().map(this::toNoteResponse).toList();
        Crew assignedCrew = task.getAssignedCrew();
        User assignedUser = assignedCrew == null ? null : assignedCrew.getUser();
        return new MaintenanceDtos.MaintenanceTaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getDueDate(),
                task.getCompletedAt(),
                task.getShip() == null ? null : task.getShip().getId(),
                task.getShip() == null ? null : task.getShip().getName(),
                assignedCrew == null ? null : assignedCrew.getId(),
                assignedUser == null ? null : assignedUser.getName(),
                task.getCreatedBy() == null ? null : task.getCreatedBy().getId(),
                overdue,
                overdue,
                notes
        );
    }

    public DrillDtos.ParticipationResponse toParticipationResponse(DrillParticipation participation) {
        Crew crew = participation.getCrew();
        User user = crew == null ? null : crew.getUser();
        return new DrillDtos.ParticipationResponse(
                participation.getId(),
                crew == null ? null : crew.getId(),
                user == null ? null : user.getName(),
                participation.getAttended(),
                participation.getCompleted(),
                participation.getRemarks()
        );
    }

    public DrillDtos.AttendanceHistoryResponse toAttendanceHistoryResponse(DrillParticipation participation) {
        Drill drill = participation.getDrill();
        return new DrillDtos.AttendanceHistoryResponse(
                participation.getId(),
                drill == null ? null : drill.getId(),
                drill == null ? null : drill.getTitle(),
                drill == null ? null : drill.getScheduledDate(),
                drill == null || drill.getShip() == null ? null : drill.getShip().getId(),
                drill == null || drill.getShip() == null ? null : drill.getShip().getName(),
                participation.getAttended(),
                participation.getCompleted(),
                participation.getRemarks()
        );
    }

    public DrillDtos.DrillResponse toDrillResponse(Drill drill) {
        List<DrillDtos.ParticipationResponse> participations = drill.getParticipations() == null
                ? List.of()
                : drill.getParticipations().stream().map(this::toParticipationResponse).toList();
        return new DrillDtos.DrillResponse(
                drill.getId(),
                drill.getTitle(),
                drill.getType(),
                drill.getScheduledDate(),
                drill.getShip() == null ? null : drill.getShip().getId(),
                drill.getShip() == null ? null : drill.getShip().getName(),
                drill.getCreatedBy() == null ? null : drill.getCreatedBy().getId(),
                participations
        );
    }

    public static UUID requireId(UUID id, String name) {
        if (id == null) {
            throw new IllegalArgumentException(name + " is required");
        }
        return id;
    }
}
