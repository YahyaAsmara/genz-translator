package com.genz.translator.model.community;

import com.genz.translator.model.UserAccount;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "remix_threads")
public class RemixThread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vibe_id", nullable = false)
    private VibePost vibePost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private UserAccount author;

    @Column(name = "remix_text", columnDefinition = "TEXT", nullable = false)
    private String remixText;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public VibePost getVibePost() {
        return vibePost;
    }

    public void setVibePost(VibePost vibePost) {
        this.vibePost = vibePost;
    }

    public UserAccount getAuthor() {
        return author;
    }

    public void setAuthor(UserAccount author) {
        this.author = author;
    }

    public String getRemixText() {
        return remixText;
    }

    public void setRemixText(String remixText) {
        this.remixText = remixText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
