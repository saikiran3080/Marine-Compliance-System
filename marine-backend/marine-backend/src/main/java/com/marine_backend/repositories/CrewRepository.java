package com.marine_backend.repositories;

import com.marine_backend.entities.Crew;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CrewRepository extends JpaRepository<Crew, UUID> {
    Optional<Crew> findByUserId(UUID userId);

    List<Crew> findByShipId(UUID shipId);
}
