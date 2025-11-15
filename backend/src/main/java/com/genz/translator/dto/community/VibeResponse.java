package com.genz.translator.dto.community;

import com.genz.translator.model.community.VibeVisibility;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class VibeResponse {
    private Long id;
    private String handle;
    private String personaTag;
    private String accentColor;
    private String originalText;
    private String translatedText;
    private String insight;
    private List<String> tags;
    private VibeVisibility visibility;
    private LocalDateTime createdAt;
    private Integer remixCount;
    private Map<String, Long> pulses;

    public VibeResponse(Long id, String handle, String personaTag, String accentColor, String originalText,
                        String translatedText, String insight, List<String> tags, VibeVisibility visibility,
                        LocalDateTime createdAt, Integer remixCount, Map<String, Long> pulses) {
        this.id = id;
        this.handle = handle;
        this.personaTag = personaTag;
        this.accentColor = accentColor;
        this.originalText = originalText;
        this.translatedText = translatedText;
        this.insight = insight;
        this.tags = tags;
        this.visibility = visibility;
        this.createdAt = createdAt;
        this.remixCount = remixCount;
        this.pulses = pulses;
    }

    public Long getId() { return id; }
    public String getHandle() { return handle; }
    public String getPersonaTag() { return personaTag; }
    public String getAccentColor() { return accentColor; }
    public String getOriginalText() { return originalText; }
    public String getTranslatedText() { return translatedText; }
    public String getInsight() { return insight; }
    public List<String> getTags() { return tags; }
    public VibeVisibility getVisibility() { return visibility; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Integer getRemixCount() { return remixCount; }
    public Map<String, Long> getPulses() { return pulses; }
}
