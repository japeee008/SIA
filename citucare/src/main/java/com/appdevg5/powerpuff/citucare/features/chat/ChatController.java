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
@CrossOrigin(origins = "http://localhost:3000") // add if frontend is React on 3000
public class ChatController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private KnowledgeBaseService knowledgeBaseService; // ✅ NEW

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> payload) {
        String messageText = (String) payload.get("message");
        Long sessionId = payload.get("sessionId") == null
                ? null
                : ((Number) payload.get("sessionId")).longValue();

        // 1) Create or update session
        Session session;
        if (sessionId == null) {
            session = sessionService.createSession();
        } else {
            session = sessionService.touchSession(sessionId);
            if (session == null) {
                session = sessionService.createSession();
            }
        }

        // 2) Save user message
        Message userMsg = new Message(session, messageText, null, LocalDateTime.now(), null);
        messageService.save(userMsg);

        // 3) Find matching KB entry
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

        // 4) Save bot message (with category if found)
        Message botMsg = new Message(session, null, botReply, LocalDateTime.now(), category);
        messageService.save(botMsg);

        // 5) Prepare response
        Map<String, Object> resp = new HashMap<>();
        resp.put("sessionId", session.getSessionId());
        resp.put("reply", botReply);

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/history")
    public List<Message> history(@RequestParam(required = false) Long sessionId) {
        if (sessionId != null) return messageService.findBySessionId(sessionId);
        return messageService.findAll();
    }
}
