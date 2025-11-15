package com.genz.translator.dto.profile;

import java.time.LocalDateTime;
import java.util.Set;

public class ProfileResponse {
    private Long id;
    private String email;
    private String handle;
    private String personaTag;
    private String accentColor;
    private String bio;
    private Integer streakCount;
    private Set<String> roles;
    private LocalDateTime createdAt;

    public ProfileResponse(Long id, String email, String handle, String personaTag, String accentColor,
                           String bio, Integer streakCount, Set<String> roles, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.handle = handle;
        this.personaTag = personaTag;
        this.accentColor = accentColor;
        this.bio = bio;
        this.streakCount = streakCount;
        this.roles = roles;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getHandle() { return handle; }
    public String getPersonaTag() { return personaTag; }
    public String getAccentColor() { return accentColor; }
    public String getBio() { return bio; }
    public Integer getStreakCount() { return streakCount; }
    public Set<String> getRoles() { return roles; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
