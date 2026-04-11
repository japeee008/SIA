package com.appdevg5.powerpuff.citucare.features.kb;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.appdevg5.powerpuff.citucare.features.nlp.NlpService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KnowledgeBaseService {

    @Autowired
    private KnowledgeBaseRepository kbRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private NlpService nlpService;

    public KnowledgeBase save(KnowledgeBase kb) {
        LocalDateTime now = LocalDateTime.now();
        if (kb.getCreatedAt() == null) {
            kb.setCreatedAt(now);
        }
        kb.setUpdatedAt(now);

        KnowledgeBase saved = kbRepository.save(kb);

        try {
            nlpService.rebuildIndex();
        } catch (Exception ignored) {}

        return saved;
    }

    public List<KnowledgeBase> findAll() {
        return kbRepository.findAll();
    }

    public KnowledgeBase findById(Long id) {
        return kbRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        kbRepository.deleteById(id);

        try {
            nlpService.rebuildIndex();
        } catch (Exception ignored) {}
    }

    public List<KnowledgeBaseDto> getAllKnowledgeBaseDtos() {
        return kbRepository.findAll().stream()
                .map(kb -> modelMapper.map(kb, KnowledgeBaseDto.class))
                .collect(Collectors.toList());
    }

    public KnowledgeBaseDto getKnowledgeBaseDtoById(Long id) {
        KnowledgeBase kb = kbRepository.findById(id).orElse(null);
        return (kb == null) ? null : modelMapper.map(kb, KnowledgeBaseDto.class);
    }

    // ============ NLP MATCHING ============

    public KnowledgeBase findMatchingKnowledgeBase(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return null;
        }

        // get top 3 just in case, we only use the best for now
        List<NlpService.SearchResult> results = nlpService.search(userMessage, 3);

        if (results.isEmpty()) {
            return null;
        }

        NlpService.SearchResult best = results.get(0);

        //if similarity is too low, treat as "no answer"
        double MIN_SCORE = 0.15; // try 0.10–0.25 and adjust
        if (best.getScore() < MIN_SCORE) {
            return null;
        }

        return kbRepository.findById(best.getId()).orElse(null);
    }

}
