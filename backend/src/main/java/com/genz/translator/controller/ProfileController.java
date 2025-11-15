package com.genz.translator.controller;

import com.genz.translator.dto.profile.ProfileResponse;
import com.genz.translator.dto.profile.ProfileUpdateRequest;
import com.genz.translator.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> me() {
        return ResponseEntity.ok(profileService.currentProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> update(@Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.update(request));
    }
}
