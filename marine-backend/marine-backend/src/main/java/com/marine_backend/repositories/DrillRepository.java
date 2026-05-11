package com.marine_backend.repositories;

import com.marine_backend.entities.Drill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.UUID;

public interface DrillRepository extends JpaRepository<Drill, UUID>, JpaSpecificationExecutor<Drill> {
    Page<Drill> findByShipId(UUID shipId, Pageable pageable);

    long countByShipId(UUID shipId);

    long countByScheduledDateBefore(LocalDateTime now);

    long countByShipIdAndScheduledDateBefore(UUID shipId, LocalDateTime now);

    long countByScheduledDateAfter(LocalDateTime now);
}
