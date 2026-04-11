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

    public List<Message> findBySessionId(Long sessionId) {
        return messageRepository.findBySession_SessionId(sessionId);
    }

    public List<Message> findAll() {
        return messageRepository.findAll();
    }
}
