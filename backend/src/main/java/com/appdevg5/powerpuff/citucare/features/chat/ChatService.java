package com.appdevg5.powerpuff.citucare.features.chat;

import com.appdevg5.powerpuff.citucare.features.category.Category;
import com.appdevg5.powerpuff.citucare.features.kb.KnowledgeBase;
import com.appdevg5.powerpuff.citucare.features.kb.KnowledgeBaseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private KnowledgeBaseRepository knowledgeBaseRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private MessageRepository messageRepository;

    /**
     * Main method: handles a user message, saves it, and returns a bot reply.
     */
    public ChatResponseDto handleMessage(ChatRequestDto requestDto) {

        // 1) Find or create session
        Session session = getOrCreateSession(requestDto.getSessionId());

        // 2) Find best matching KB entry (if any)
        KnowledgeBase matchedKb = findMatchingKnowledgeBase(requestDto.getMessage());

        String reply;
        Category category = null;

        if (matchedKb != null) {
            reply = matchedKb.getAnswer();
            category = matchedKb.getCategory();
        } else {
            reply = "I'm sorry, I don't have an answer for that yet. " +
                    "Please try rephrasing your question or contact the appropriate department.";
        }

        // 3) Save message record
        Message message = new Message();
        message.setSession(session);
        message.setMessageText(requestDto.getMessage());
        message.setBotReply(reply);
        message.setTimestamp(LocalDateTime.now());
        message.setCategory(category); // may be null for unmatched
        messageRepository.save(message);

        // 4) Update session last activity
        session.setLastActivityAt(LocalDateTime.now());
        sessionRepository.save(session);

        // 5) Build response DTO
        ChatResponseDto response = new ChatResponseDto();
        response.setSessionId(session.getSessionId());
        response.setUserMessage(requestDto.getMessage());
        response.setBotReply(reply);

        return response;
    }

    /**
     * Returns chat history for a given session.
     * Useful if your frontend wants to reload previous messages.
     */
    public List<Message> getHistory(Long sessionId) {
        return messageRepository.findBySession_SessionId(sessionId);
    }

    // ---------- helpers ----------

    private Session getOrCreateSession(Long sessionId) {
        if (sessionId != null) {
            return sessionRepository.findById(sessionId)
                    .orElseGet(this::createNewSession);
        }
        return createNewSession();
    }

    private Session createNewSession() {
        LocalDateTime now = LocalDateTime.now();
        Session session = new Session();
        session.setCreatedAt(now);
        session.setLastActivityAt(now);
        return sessionRepository.save(session);
    }

    /**
     * Very simple keyword-based matching:
     * - takes user message
     * - compares against questionPattern of each published KB
     * - questionPattern is split by comma/semicolon into keywords
     * - if user message contains any keyword (case-insensitive) => match
     */
    private KnowledgeBase findMatchingKnowledgeBase(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return null;
        }

        String normalized = userMessage.toLowerCase();
        List<KnowledgeBase> kbList = knowledgeBaseRepository.findByIsPublished(true);

        for (KnowledgeBase kb : kbList) {
            String patterns = kb.getQuestionPattern();
            if (patterns == null || patterns.isBlank()) continue;

            // Split patterns by comma or semicolon
            String[] tokens = patterns.toLowerCase().split("[,;]");

            for (String token : tokens) {
                String keyword = token.trim();
                if (keyword.isEmpty()) continue;

                if (normalized.contains(keyword)) {
                    return kb; // first match wins
                }
            }
        }

        return null;
    }
}
