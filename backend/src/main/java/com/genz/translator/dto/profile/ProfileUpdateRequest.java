package com.genz.translator.dto.profile;

import jakarta.validation.constraints.Size;

public class ProfileUpdateRequest {

    @Size(max = 280)
    private String bio;

    private String personaTag;

    private String accentColor;

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPersonaTag() {
        return personaTag;
    }

    public void setPersonaTag(String personaTag) {
        this.personaTag = personaTag;
    }

    public String getAccentColor() {
        return accentColor;
    }

    public void setAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }
}
