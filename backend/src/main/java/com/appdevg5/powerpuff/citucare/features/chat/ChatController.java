package com.appdevg5.powerpuff.citucare.features.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.appdevg5.powerpuff.citucare.features.category.Category;
import com.appdevg5.powerpuff.citucare.features.kb.KnowledgeBase;
import com.appdevg5.powerpuff.citucare.features.kb.KnowledgeBaseService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private KnowledgeBaseService knowledgeBaseService;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> payload) {
        String messageText = (String) payload.get("message");

        if (messageText == null || messageText.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
        }

        if (payload.get("userId") == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User ID is required"));
        }

        Long userId = ((Number) payload.get("userId")).longValue();

        Long sessionId = payload.get("sessionId") == null
                ? null
                : ((Number) payload.get("sessionId")).longValue();

        Session session;

        if (sessionId == null) {
            session = sessionService.createSession(userId);
        } else {
            session = sessionService.touchSession(sessionId, userId);
            if (session == null) {
                session = sessionService.createSession(userId);
            }
        }

        Message userMsg = new Message(session, messageText, null, LocalDateTime.now(), null);
        messageService.save(userMsg);

        KnowledgeBase matchedKb = knowledgeBaseService.findMatchingKnowledgeBase(messageText);

        String botReply;
        Category category = null;

        if (matchedKb != null) {
            botReply = matchedKb.getAnswer();
            category = matchedKb.getCategory();
        } else {
            botReply = "I'm sorry, I don't have an answer for that yet. " +
                    "Please try rephrasing your question or contact the appropriate department.";
        }

        Message botMsg = new Message(session, null, botReply, LocalDateTime.now(), category);
        messageService.save(botMsg);

        Map<String, Object> resp = new HashMap<>();
        resp.put("sessionId", session.getSessionId());
        resp.put("reply", botReply);

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/sessions")
    public List<SessionDto> sessions(@RequestParam Long userId) {
        return sessionService.getSessionsByUserId(userId);
    }

    @GetMapping("/history")
    public List<MessageDto> history(
            @RequestParam Long userId,
            @RequestParam(required = false) Long sessionId
    ) {
        List<Message> messages;

        if (sessionId != null) {
            messages = messageService.findBySessionIdAndUserId(sessionId, userId);
        } else {
            messages = messageService.findByUserId(userId);
        }

        return messages.stream()
                .map(MessageDto::new)
                .toList();
    }
}