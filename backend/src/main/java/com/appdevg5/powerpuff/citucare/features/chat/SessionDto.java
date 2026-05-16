package com.appdevg5.powerpuff.citucare.features.chat;

import java.time.LocalDateTime;

public class SessionDto {
    private Long sessionId;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime lastActivityAt;

    public SessionDto(Session session, String title) {
        this.sessionId = session.getSessionId();
        this.title = title;
        this.createdAt = session.getCreatedAt();
        this.lastActivityAt = session.getLastActivityAt();
    }

    public Long getSessionId() {
        return sessionId;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastActivityAt() {
        return lastActivityAt;
    }
}