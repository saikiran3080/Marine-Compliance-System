package com.marine_backend.repositories;

import com.marine_backend.entities.MaintenanceTask;
import com.marine_backend.enums.MaintenanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.UUID;

public interface MaintenanceTaskRepository extends JpaRepository<MaintenanceTask, UUID>, JpaSpecificationExecutor<MaintenanceTask> {
    Page<MaintenanceTask> findByShipId(UUID shipId, Pageable pageable);

    Page<MaintenanceTask> findByAssignedCrewId(UUID crewId, Pageable pageable);

    Page<MaintenanceTask> findByStatus(MaintenanceStatus status, Pageable pageable);

    @Query("""
            select t from MaintenanceTask t
            where t.dueDate < :now and t.status <> com.marine_backend.enums.MaintenanceStatus.COMPLETED
            """)
    Page<MaintenanceTask> findOverdue(LocalDateTime now, Pageable pageable);

    long countByStatus(MaintenanceStatus status);

    long countByShipId(UUID shipId);

    long countByShipIdAndStatus(UUID shipId, MaintenanceStatus status);

    long countByShipIdAndDueDateBeforeAndStatusNot(UUID shipId, LocalDateTime now, MaintenanceStatus status);

    long countByDueDateBeforeAndStatusNot(LocalDateTime now, MaintenanceStatus status);

    long countByAssignedCrewId(UUID crewId);

    long countByAssignedCrewIdAndStatus(UUID crewId, MaintenanceStatus status);

    long countByAssignedCrewIdAndDueDateBeforeAndStatusNot(UUID crewId, LocalDateTime now, MaintenanceStatus status);
}
