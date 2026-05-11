package com.marine_backend.repositories;

import com.marine_backend.entities.Ship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ShipRepository extends JpaRepository<Ship, UUID> {
    boolean existsByImoNumber(String imoNumber);

    long countByIdIn(java.util.Collection<UUID> ids);
}
