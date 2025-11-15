package com.genz.translator.service;

import com.genz.translator.dto.community.*;
import com.genz.translator.model.UserAccount;
import com.genz.translator.model.community.*;
import com.genz.translator.repository.RemixThreadRepository;
import com.genz.translator.repository.VibePostRepository;
import com.genz.translator.repository.VibePulseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommunityService {

    private final VibePostRepository vibePostRepository;
    private final VibePulseRepository vibePulseRepository;
    private final RemixThreadRepository remixThreadRepository;
    private final ProfileService profileService;

    public CommunityService(VibePostRepository vibePostRepository,
                            VibePulseRepository vibePulseRepository,
                            RemixThreadRepository remixThreadRepository,
                            ProfileService profileService) {
        this.vibePostRepository = vibePostRepository;
        this.vibePulseRepository = vibePulseRepository;
        this.remixThreadRepository = remixThreadRepository;
        this.profileService = profileService;
    }

    @Transactional
    public VibeResponse createVibe(VibeRequest request) {
        UserAccount author = profileService.getCurrentUser();
        VibePost vibe = new VibePost();
        vibe.setAuthor(author);
        vibe.setOriginalText(request.getOriginalText());
        vibe.setTranslatedText(request.getTranslatedText());
        vibe.setInsight(request.getInsight());
        vibe.setVisibility(request.getVisibility());
        vibe.setPersonaTag(author.getPersonaTag());
        vibe.setAccentColor(author.getAccentColor());
        if (!CollectionUtils.isEmpty(request.getTags())) {
            vibe.setTags(request.getTags().stream()
                    .filter(StringUtils::hasText)
                    .map(tag -> tag.trim().toLowerCase(Locale.ROOT))
                    .distinct()
                    .limit(6)
                    .collect(Collectors.toList()));
        }
        VibePost saved = vibePostRepository.save(vibe);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VibeResponse> getFeed(String persona, String tag, VibeVisibility visibility) {
        List<VibePost> posts = vibePostRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream()
                .filter(post -> visibility == null || post.getVisibility() == visibility)
                .filter(post -> !StringUtils.hasText(persona) ||
                    (post.getPersonaTag() != null && persona.equalsIgnoreCase(post.getPersonaTag())))
                .filter(post -> !StringUtils.hasText(tag) || post.getTags().stream()
                        .anyMatch(t -> t.equalsIgnoreCase(tag)))
                .limit(50)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VibeResponse pulse(Long vibeId, PulseType pulseType) {
        UserAccount user = profileService.getCurrentUser();
        VibePost post = vibePostRepository.findById(vibeId)
                .orElseThrow(() -> new IllegalArgumentException("Vibe not found"));
        var existing = vibePulseRepository.findByVibePostAndUserAndPulseType(post, user, pulseType);
        if (existing.isPresent()) {
            vibePulseRepository.delete(existing.get());
        } else {
            VibePulse pulse = new VibePulse();
            pulse.setPulseType(pulseType);
            pulse.setUser(user);
            pulse.setVibePost(post);
            vibePulseRepository.save(pulse);
        }
        return toResponse(post);
    }

    @Transactional
    public VibeResponse remix(Long vibeId, RemixRequest request) {
        UserAccount user = profileService.getCurrentUser();
        VibePost post = vibePostRepository.findById(vibeId)
                .orElseThrow(() -> new IllegalArgumentException("Vibe not found"));
        RemixThread remix = new RemixThread();
        remix.setAuthor(user);
        remix.setVibePost(post);
        remix.setRemixText(request.getRemixText());
        remixThreadRepository.save(remix);
        int currentRemix = post.getRemixCount() == null ? 0 : post.getRemixCount();
        post.setRemixCount(currentRemix + 1);
        vibePostRepository.save(post);
        return toResponse(post);
    }

    @Transactional(readOnly = true)
    public List<RemixResponse> getRemixes(Long vibeId) {
        VibePost post = vibePostRepository.findById(vibeId)
                .orElseThrow(() -> new IllegalArgumentException("Vibe not found"));
        return remixThreadRepository.findByVibePostOrderByCreatedAtAsc(post).stream()
                .map(remix -> new RemixResponse(
                        remix.getId(),
                        remix.getAuthor().getHandle(),
                        remix.getAuthor().getPersonaTag(),
                        remix.getRemixText(),
                        remix.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    private VibeResponse toResponse(VibePost post) {
        Map<String, Long> pulses = vibePulseRepository.findByVibePost(post).stream()
                .collect(Collectors.groupingBy(pulse -> pulse.getPulseType().name(), Collectors.counting()));
        return new VibeResponse(
                post.getId(),
                post.getAuthor().getHandle(),
                post.getPersonaTag(),
                post.getAccentColor(),
                post.getOriginalText(),
                post.getTranslatedText(),
                post.getInsight(),
            post.getTags() == null ? List.of() : post.getTags(),
                post.getVisibility(),
                post.getCreatedAt(),
                post.getRemixCount(),
                pulses
        );
    }
}
