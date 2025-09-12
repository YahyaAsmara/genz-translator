package com.genz.translator.dto;

import jakarta.validation.constraints.NotBlank;

public class TranslationRequest {
    @NotBlank(message = "Text to translate cannot be empty")
    private String text;

    public TranslationRequest() {}

    public TranslationRequest(String text) {
        this.text = text;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}