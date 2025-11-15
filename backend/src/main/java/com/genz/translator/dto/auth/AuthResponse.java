package com.genz.translator.dto.auth;

import com.genz.translator.dto.profile.ProfileResponse;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private ProfileResponse profile;

    public AuthResponse(String accessToken, String refreshToken, ProfileResponse profile) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.profile = profile;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public ProfileResponse getProfile() {
        return profile;
    }

    public void setProfile(ProfileResponse profile) {
        this.profile = profile;
    }
}
