package com.marine_backend.services;

import com.marine_backend.dtos.ShipDtos;
import com.marine_backend.entities.Ship;
import com.marine_backend.enums.ShipStatus;
import com.marine_backend.exception.BadRequestException;
import com.marine_backend.exception.ResourceNotFoundException;
import com.marine_backend.mappers.EntityMapper;
import com.marine_backend.repositories.ShipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShipService {
    private final ShipRepository shipRepository;
    private final EntityMapper mapper;

    public Page<ShipDtos.ShipResponse> findAll(Pageable pageable) {
        return shipRepository.findAll(pageable).map(mapper::toShipResponse);
    }

    public ShipDtos.ShipResponse findById(UUID id) {
        return mapper.toShipResponse(getShip(id));
    }

    @Transactional
    public ShipDtos.ShipResponse create(ShipDtos.ShipRequest request) {
        if (request.imoNumber() != null && shipRepository.existsByImoNumber(request.imoNumber())) {
            throw new BadRequestException("IMO number already exists");
        }
        Ship ship = Ship.builder()
                .name(request.name())
                .imoNumber(request.imoNumber())
                .type(request.type())
                .status(request.status() == null ? ShipStatus.ACTIVE : request.status())
                .build();
        return mapper.toShipResponse(shipRepository.save(ship));
    }

    @Transactional
    public ShipDtos.ShipResponse update(UUID id, ShipDtos.ShipRequest request) {
        Ship ship = getShip(id);
        ship.setName(request.name());
        ship.setImoNumber(request.imoNumber());
        ship.setType(request.type());
        ship.setStatus(request.status() == null ? ship.getStatus() : request.status());
        return mapper.toShipResponse(ship);
    }

    @Transactional
    public void delete(UUID id) {
        shipRepository.delete(getShip(id));
    }

    public Ship getShip(UUID id) {
        return shipRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ship not found"));
    }
}
