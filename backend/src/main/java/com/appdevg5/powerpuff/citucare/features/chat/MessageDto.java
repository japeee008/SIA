package com.appdevg5.powerpuff.citucare.features.chat;

import java.time.LocalDateTime;

public class MessageDto {
    private Long messageId;
    private Long sessionId;
    private String messageText;
    private String botReply;
    private LocalDateTime timestamp;
    private String categoryName;

    public MessageDto(Message message) {
        this.messageId = message.getMessageId();
        this.sessionId = message.getSession().getSessionId();
        this.messageText = message.getMessageText();
        this.botReply = message.getBotReply();
        this.timestamp = message.getTimestamp();
        this.categoryName = message.getCategory() != null
        ? message.getCategory().getCategoryName()
        : null;
    }

    public Long getMessageId() { return messageId; }
    public Long getSessionId() { return sessionId; }
    public String getMessageText() { return messageText; }
    public String getBotReply() { return botReply; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getCategoryName() { return categoryName; }
}