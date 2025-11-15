package com.genz.translator.controller;

import com.genz.translator.dto.community.*;
import com.genz.translator.model.community.VibeVisibility;
import com.genz.translator.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/vibes")
    public ResponseEntity<List<VibeResponse>> feed(@RequestParam(required = false) String persona,
                                                    @RequestParam(required = false) String tag,
                                                    @RequestParam(required = false) VibeVisibility visibility) {
        return ResponseEntity.ok(communityService.getFeed(persona, tag, visibility));
    }

    @PostMapping("/vibes")
    public ResponseEntity<VibeResponse> share(@Valid @RequestBody VibeRequest request) {
        return ResponseEntity.ok(communityService.createVibe(request));
    }

    @PostMapping("/vibes/{id}/react")
    public ResponseEntity<VibeResponse> react(@PathVariable Long id, @Valid @RequestBody PulseRequest request) {
        return ResponseEntity.ok(communityService.pulse(id, request.getPulseType()));
    }

    @PostMapping("/vibes/{id}/remix")
    public ResponseEntity<VibeResponse> remix(@PathVariable Long id, @Valid @RequestBody RemixRequest request) {
        return ResponseEntity.ok(communityService.remix(id, request));
    }

    @GetMapping("/vibes/{id}/remixes")
    public ResponseEntity<List<RemixResponse>> remixes(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getRemixes(id));
    }
}
