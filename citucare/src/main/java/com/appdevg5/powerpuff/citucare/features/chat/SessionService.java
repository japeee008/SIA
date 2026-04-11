package com.appdevg5.powerpuff.citucare.features.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    public Session createSession() {
        Session s = new Session();
        s.setCreatedAt(LocalDateTime.now());
        s.setLastActivityAt(LocalDateTime.now());
        return sessionRepository.save(s);
    }

    public Session touchSession(Long id) {
        return sessionRepository.findById(id).map(s -> {
            s.setLastActivityAt(LocalDateTime.now());
            return sessionRepository.save(s);
        }).orElse(null);
    }
}
