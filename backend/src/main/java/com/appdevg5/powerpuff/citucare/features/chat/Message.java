package com.appdevg5.powerpuff.citucare.features.chat;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.appdevg5.powerpuff.citucare.features.category.Category;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(columnDefinition = "TEXT")
    private String messageText; 

    @Column(columnDefinition = "TEXT")
    private String botReply;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    public Message() {
    }

    public Message(Session session, String messageText, String botReply, LocalDateTime timestamp, Category category) {
        this.session = session;
        this.messageText = messageText;
        this.botReply = botReply;
        this.timestamp = timestamp;
        this.category = category;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public String getBotReply() {
        return botReply;
    }

    public void setBotReply(String botReply) {
        this.botReply = botReply;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
