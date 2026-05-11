package com.marine_backend.services;

import com.marine_backend.dtos.CrewDtos;
import com.marine_backend.entities.Crew;
import com.marine_backend.entities.Ship;
import com.marine_backend.entities.User;
import com.marine_backend.exception.ResourceNotFoundException;
import com.marine_backend.mappers.EntityMapper;
import com.marine_backend.repositories.CrewRepository;
import com.marine_backend.repositories.ShipRepository;
import com.marine_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CrewService {
    private final CrewRepository crewRepository;
    private final UserRepository userRepository;
    private final ShipRepository shipRepository;
    private final CurrentUserService currentUserService;
    private final EntityMapper mapper;

    public Page<CrewDtos.CrewResponse> findAll(Pageable pageable) {
        return crewRepository.findAll(pageable).map(mapper::toCrewResponse);
    }

    public CrewDtos.CrewResponse findById(UUID id) {
        return mapper.toCrewResponse(getCrew(id));
    }

    public CrewDtos.CrewResponse me() {
        return crewRepository.findByUserId(currentUserService.getCurrentUser().getId())
                .map(mapper::toCrewResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Crew profile not found for current user"));
    }

    @Transactional
    public CrewDtos.CrewResponse create(CrewDtos.CrewRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Ship ship = request.shipId() == null ? null : shipRepository.findById(request.shipId())
                .orElseThrow(() -> new ResourceNotFoundException("Ship not found"));
        Crew crew = Crew.builder()
                .user(user)
                .ship(ship)
                .rank(request.rank())
                .joiningDate(request.joiningDate())
                .build();
        return mapper.toCrewResponse(crewRepository.save(crew));
    }

    @Transactional
    public CrewDtos.CrewResponse update(UUID id, CrewDtos.CrewRequest request) {
        Crew crew = getCrew(id);
        Ship ship = request.shipId() == null ? null : shipRepository.findById(request.shipId())
                .orElseThrow(() -> new ResourceNotFoundException("Ship not found"));
        crew.setShip(ship);
        crew.setRank(request.rank());
        crew.setJoiningDate(request.joiningDate());
        return mapper.toCrewResponse(crew);
    }

    public Crew getCrew(UUID id) {
        return crewRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Crew not found"));
    }
}
