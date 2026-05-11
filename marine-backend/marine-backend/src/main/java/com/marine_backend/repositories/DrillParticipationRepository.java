package com.marine_backend.repositories;

import com.marine_backend.entities.DrillParticipation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DrillParticipationRepository extends JpaRepository<DrillParticipation, UUID> {
    List<DrillParticipation> findByDrillId(UUID drillId);

    List<DrillParticipation> findByCrewId(UUID crewId);

    org.springframework.data.domain.Page<DrillParticipation> findByCrewId(UUID crewId, org.springframework.data.domain.Pageable pageable);

    Optional<DrillParticipation> findByDrillIdAndCrewId(UUID drillId, UUID crewId);

    long countByAttendedTrue();

    long countByCompletedTrue();

    long countByDrillShipIdAndAttendedTrue(UUID shipId);

    long countByDrillShipIdAndCompletedTrue(UUID shipId);

    long countByDrillShipId(UUID shipId);

    long countByCrewId(UUID crewId);

    long countByCrewIdAndAttendedTrue(UUID crewId);

    long countByCrewIdAndDrillScheduledDateAfter(UUID crewId, java.time.LocalDateTime now);
}
