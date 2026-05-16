package com.appdevg5.powerpuff.citucare.features.chat;

import com.appdevg5.powerpuff.citucare.features.auth.User;
import com.appdevg5.powerpuff.citucare.features.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public Session createSession(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Session s = new Session();
        s.setUser(user);
        s.setCreatedAt(LocalDateTime.now());
        s.setLastActivityAt(LocalDateTime.now());

        return sessionRepository.save(s);
    }

    public Session touchSession(Long sessionId, Long userId) {
        return sessionRepository.findBySessionIdAndUser_UserId(sessionId, userId)
                .map(s -> {
                    s.setLastActivityAt(LocalDateTime.now());
                    return sessionRepository.save(s);
                })
                .orElse(null);
    }

    public List<SessionDto> getSessionsByUserId(Long userId) {
        List<Session> sessions = sessionRepository.findByUser_UserIdOrderByLastActivityAtDesc(userId);

        return sessions.stream()
                .map(session -> {
                    String title = messageRepository
                            .findFirstBySession_SessionIdAndMessageTextIsNotNullOrderByTimestampAsc(session.getSessionId())
                            .map(Message::getMessageText)
                            .orElse("New Chat");

                    if (title.length() > 35) {
                        title = title.substring(0, 35) + "...";
                    }

                    return new SessionDto(session, title);
                })
                .toList();
    }
}