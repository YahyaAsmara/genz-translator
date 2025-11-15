package com.genz.translator.dto.community;

import java.time.LocalDateTime;

public class RemixResponse {
    private Long id;
    private String handle;
    private String personaTag;
    private String remixText;
    private LocalDateTime createdAt;

    public RemixResponse(Long id, String handle, String personaTag, String remixText, LocalDateTime createdAt) {
        this.id = id;
        this.handle = handle;
        this.personaTag = personaTag;
        this.remixText = remixText;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getHandle() { return handle; }
    public String getPersonaTag() { return personaTag; }
    public String getRemixText() { return remixText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
