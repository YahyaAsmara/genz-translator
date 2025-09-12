package com.genz.translator.dto;

import java.util.List;

public class TranslationResponse {
    private String originalText;
    private String translatedText;
    private List<String> termsFound;
    private boolean success;

    public TranslationResponse() {}

    public TranslationResponse(String originalText, String translatedText, List<String> termsFound) {
        this.originalText = originalText;
        this.translatedText = translatedText;
        this.termsFound = termsFound;
        this.success = true;
    }

    // Getters and Setters
    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }

    public String getTranslatedText() { return translatedText; }
    public void setTranslatedText(String translatedText) { this.translatedText = translatedText; }

    public List<String> getTermsFound() { return termsFound; }
    public void setTermsFound(List<String> termsFound) { this.termsFound = termsFound; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}