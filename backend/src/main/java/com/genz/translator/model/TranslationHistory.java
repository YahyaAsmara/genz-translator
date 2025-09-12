package com.genz.translator.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "translation_history")
public class TranslationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_text", columnDefinition = "TEXT", nullable = false)
    private String originalText;

    @Column(name = "translated_text", columnDefinition = "TEXT", nullable = false)
    private String translatedText;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // Constructors
    public TranslationHistory() {
        this.createdAt = LocalDateTime.now();
    }

    public TranslationHistory(String originalText, String translatedText) {
        this();
        this.originalText = originalText;
        this.translatedText = translatedText;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }

    public String getTranslatedText() { return translatedText; }
    public void setTranslatedText(String translatedText) { this.translatedText = translatedText; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}