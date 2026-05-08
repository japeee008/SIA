package com.appdevg5.powerpuff.citucare.features.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message save(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> findByUserId(Long userId) {
        return messageRepository.findBySession_User_UserIdOrderByTimestampAsc(userId);
    }

    public List<Message> findBySessionIdAndUserId(Long sessionId, Long userId) {
        return messageRepository.findBySession_SessionIdAndSession_User_UserIdOrderByTimestampAsc(sessionId, userId);
    }
}