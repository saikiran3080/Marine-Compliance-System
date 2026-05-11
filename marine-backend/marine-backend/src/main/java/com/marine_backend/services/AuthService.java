package com.marine_backend.services;

import com.marine_backend.dtos.AuthResponseDto;
import com.marine_backend.dtos.LoginRequestDto;
import com.marine_backend.dtos.RegisterRequestDto;
import com.marine_backend.dtos.UserDto;
import com.marine_backend.entities.User;
import com.marine_backend.enums.Role;
import com.marine_backend.exception.BadRequestException;
import com.marine_backend.repositories.UserRepository;
import com.marine_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Transactional
    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        Role role = request.getRole() == null ? Role.CREW : request.getRole();
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        User saved = userRepository.save(user);
        String token = jwtService.generateToken(userDetailsService.loadUserByUsername(saved.getEmail()));
        return new AuthResponseDto(token, saved.getId(), saved.getName(), saved.getEmail(), saved.getRole());
    }

    public AuthResponseDto login(LoginRequestDto request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email()).orElseThrow();
        String token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getEmail()));
        return new AuthResponseDto(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public UserDto me(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
