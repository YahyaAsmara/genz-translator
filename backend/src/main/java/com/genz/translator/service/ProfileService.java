package com.genz.translator.service;

import com.genz.translator.dto.profile.ProfileResponse;
import com.genz.translator.dto.profile.ProfileUpdateRequest;
import com.genz.translator.model.UserAccount;
import com.genz.translator.repository.UserAccountRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class ProfileService {

    private final UserAccountRepository userAccountRepository;

    public ProfileService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public UserAccount getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }

        String email = authentication.getName();
        return userAccountRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalStateException("Unable to resolve current user"));
    }

    public ProfileResponse toResponse(UserAccount user) {
        return new ProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getHandle(),
                user.getPersonaTag(),
                user.getAccentColor(),
                user.getBio(),
                user.getStreakCount(),
                user.getRoles(),
                user.getCreatedAt()
        );
    }

    public ProfileResponse currentProfile() {
        return toResponse(getCurrentUser());
    }

    public ProfileResponse update(ProfileUpdateRequest request) {
        UserAccount user = getCurrentUser();
        if (StringUtils.hasText(request.getBio())) {
            user.setBio(request.getBio().trim());
        }
        if (StringUtils.hasText(request.getPersonaTag())) {
            user.setPersonaTag(request.getPersonaTag().trim());
        }
        if (StringUtils.hasText(request.getAccentColor())) {
            user.setAccentColor(request.getAccentColor().trim());
        }
        UserAccount saved = userAccountRepository.save(user);
        return toResponse(saved);
    }
}
