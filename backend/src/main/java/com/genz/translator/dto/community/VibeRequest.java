package com.genz.translator.dto.community;

import com.genz.translator.model.community.VibeVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class VibeRequest {

    @NotBlank
    private String originalText;

    @NotBlank
    private String translatedText;

    @Size(max = 280)
    private String insight;

    private List<String> tags;

    private VibeVisibility visibility = VibeVisibility.PUBLIC;

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public String getTranslatedText() {
        return translatedText;
    }

    public void setTranslatedText(String translatedText) {
        this.translatedText = translatedText;
    }

    public String getInsight() {
        return insight;
    }

    public void setInsight(String insight) {
        this.insight = insight;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public VibeVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(VibeVisibility visibility) {
        this.visibility = visibility;
    }
}
