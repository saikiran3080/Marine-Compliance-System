package com.marine_backend.services;

import com.marine_backend.entities.Crew;
import com.marine_backend.entities.User;
import com.marine_backend.enums.Role;
import com.marine_backend.exception.ResourceNotFoundException;
import com.marine_backend.repositories.CrewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthorizationService {
    private final CurrentUserService currentUserService;
    private final CrewRepository crewRepository;

    public User currentUser() {
        return currentUserService.getCurrentUser();
    }

    public boolean isAdmin() {
        return currentUser().getRole() == Role.ADMIN;
    }

    public Crew currentCrew() {
        return crewRepository.findByUserId(currentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Crew profile not found for current user"));
    }

    public void requireAdminOrCrew(UUID ownerCrewId) {
        if (isAdmin()) {
            return;
        }
        UUID currentCrewId = currentCrew().getId();
        if (!currentCrewId.equals(ownerCrewId)) {
            throw new AccessDeniedException("You can only access your own crew assignments");
        }
    }
}
