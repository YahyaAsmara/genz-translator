package com.genz.translator.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "terms")
public class Term {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Gen Z text cannot be empty")
    @Column(name = "genz_text", nullable = false)
    private String genzText;

    @NotBlank(message = "Translation cannot be empty")
    @Column(name = "translation", nullable = false)
    private String translation;

    @Column(name = "category")
    private String category;

    @Column(name = "popularity_score", columnDefinition = "integer default 0")
    private Integer popularityScore = 0;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // Constructors
    public Term() {
        this.createdAt = LocalDateTime.now();
    }

    public Term(String genzText, String translation, String category) {
        this();
        this.genzText = genzText;
        this.translation = translation;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGenzText() { return genzText; }
    public void setGenzText(String genzText) { this.genzText = genzText; }

    public String getTranslation() { return translation; }
    public void setTranslation(String translation) { this.translation = translation; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getPopularityScore() { return popularityScore; }
    public void setPopularityScore(Integer popularityScore) { this.popularityScore = popularityScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}