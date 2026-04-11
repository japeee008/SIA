package com.appdevg5.powerpuff.citucare.features.chat;

public class ChatResponseDto {

    private Long sessionId;
    private String userMessage;
    private String botReply;

    public ChatResponseDto() {
        super();
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserMessage() {
        return userMessage;
    }

    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }

    public String getBotReply() {
        return botReply;
    }

    public void setBotReply(String botReply) {
        this.botReply = botReply;
    }
}
