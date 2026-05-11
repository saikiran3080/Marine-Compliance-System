package com.marine_backend.repositories;

import com.marine_backend.entities.MaintenanceNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MaintenanceNoteRepository extends JpaRepository<MaintenanceNote, UUID> {
    List<MaintenanceNote> findByTaskIdOrderByIdAsc(UUID taskId);
}
