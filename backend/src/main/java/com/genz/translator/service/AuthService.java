package com.genz.translator.service;

import com.genz.translator.dto.auth.AuthResponse;
import com.genz.translator.dto.auth.LoginRequest;
import com.genz.translator.dto.auth.RefreshRequest;
import com.genz.translator.dto.auth.RegisterRequest;
import com.genz.translator.dto.profile.ProfileResponse;
import com.genz.translator.model.UserAccount;
import com.genz.translator.repository.UserAccountRepository;
import com.genz.translator.security.UserPrincipal;
import com.genz.translator.security.jwt.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class AuthService {

    private static final List<String> PERSONA_LIBRARY = List.of(
            "Linguistic Alchemist", "Signal Whisperer", "Vibe Cartographer", "Syntax Astronaut", "Culture Tuner"
    );

    private static final List<String> ACCENT_LIBRARY = List.of(
            "#86efac", "#f472b6", "#a5b4fc", "#facc15", "#f97316"
    );

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ProfileService profileService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserAccountRepository userAccountRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       ProfileService profileService) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.profileService = profileService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userAccountRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (userAccountRepository.existsByHandleIgnoreCase(request.getHandle())) {
            throw new IllegalArgumentException("Handle already taken");
        }

        UserAccount user = new UserAccount(
                request.getEmail().trim().toLowerCase(),
                request.getHandle().trim(),
                passwordEncoder.encode(request.getPassword())
        );
        user.getRoles().add("USER");
        user.setPersonaTag(randomElement(PERSONA_LIBRARY));
        user.setAccentColor(randomElement(ACCENT_LIBRARY));
        user.setBio("Freshly onboarded, ready to decode vibes.");
        UserAccount saved = userAccountRepository.save(user);

        ProfileResponse profile = profileService.toResponse(saved);
        return buildAuthPayload(saved, profile);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(email, request.getPassword());
        authenticationManager.authenticate(authToken);
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        user.setLastLoginAt(LocalDateTime.now());
        userAccountRepository.save(user);

        ProfileResponse profile = profileService.toResponse(user);
        return buildAuthPayload(user, profile);
    }

    public AuthResponse refresh(RefreshRequest request) {
        String username = jwtService.extractUsername(request.getRefreshToken());
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        UserPrincipal principal = new UserPrincipal(user);
        if (!jwtService.isTokenValid(request.getRefreshToken(), principal)) {
            throw new IllegalArgumentException("Refresh token expired");
        }
        ProfileResponse profile = profileService.toResponse(user);
        return buildAuthPayload(user, profile, request.getRefreshToken());
    }

    private AuthResponse buildAuthPayload(UserAccount user, ProfileResponse profile) {
        return buildAuthPayload(user, profile, null);
    }

    private AuthResponse buildAuthPayload(UserAccount user, ProfileResponse profile, String refreshTokenOverride) {
        UserPrincipal principal = new UserPrincipal(user);
        String accessToken = jwtService.generateAccessToken(principal, Map.of(
                "handle", user.getHandle(),
                "persona", user.getPersonaTag()
        ));
        String refreshToken = refreshTokenOverride != null
                ? refreshTokenOverride
                : jwtService.generateRefreshToken(principal);
        return new AuthResponse(accessToken, refreshToken, profile);
    }

    private String randomElement(List<String> source) {
        return source.get(secureRandom.nextInt(source.size()));
    }
}
