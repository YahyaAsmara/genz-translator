package com.genz.translator.model.community;

import com.genz.translator.model.UserAccount;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vibe_pulses",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"vibe_id", "user_id", "pulse_type"})})
public class VibePulse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vibe_id", nullable = false)
    private VibePost vibePost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @Enumerated(EnumType.STRING)
    @Column(name = "pulse_type", nullable = false)
    private PulseType pulseType;

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

    public UserAccount getUser() {
        return user;
    }

    public void setUser(UserAccount user) {
        this.user = user;
    }

    public PulseType getPulseType() {
        return pulseType;
    }

    public void setPulseType(PulseType pulseType) {
        this.pulseType = pulseType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
