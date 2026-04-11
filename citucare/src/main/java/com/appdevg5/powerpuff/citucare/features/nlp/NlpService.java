package com.appdevg5.powerpuff.citucare.features.nlp;

import com.appdevg5.powerpuff.citucare.features.kb.KnowledgeBase;
import com.appdevg5.powerpuff.citucare.features.kb.KnowledgeBaseRepository;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NlpService {

    private final KnowledgeBaseRepository kbRepo;

    private final Set<String> stopwords = new HashSet<>();
    private final List<KnowledgeBase> docs = new ArrayList<>();
    private final List<Map<String, Double>> tfidfVectors = new ArrayList<>();
    private final Map<String, Double> idf = new HashMap<>();

    private final Map<String, String> tokenCorrectionCache = new HashMap<>();
    private final Map<String, List<String>> synonyms = new HashMap<>();

    public NlpService(KnowledgeBaseRepository kbRepo) {
        this.kbRepo = kbRepo;
    }

    @PostConstruct
    public void init() {
        loadStopwords();
        loadSynonyms();
        indexKnowledgeBase();
    }

    // ----------------------------------------------------------
    // STOPWORDS
    // ----------------------------------------------------------
    private void loadStopwords() {
        try (InputStream is = getClass().getResourceAsStream("/stopwords.txt");
             BufferedReader br = new BufferedReader(new InputStreamReader(is))) {

            String line;
            while ((line = br.readLine()) != null) {
                stopwords.add(line.trim().toLowerCase());
            }
        } catch (Exception e) {
            Collections.addAll(stopwords,
                    "the", "is", "at", "which", "on", "and", "a", "an", "to", "in",
                    "of", "for", "with", "that", "this"
            );
        }
    }

    // ----------------------------------------------------------
    // SYNONYMS (expandable)
    // ----------------------------------------------------------
    private void loadSynonyms() {
        synonyms.put("admission", Arrays.asList("enrollment", "apply", "register"));
        synonyms.put("requirements", Arrays.asList("reqs", "needed", "documents"));
        synonyms.put("payment", Arrays.asList("pay", "tuition", "fees"));
        synonyms.put("scholarship", Arrays.asList("grant", "scholarships"));
        synonyms.put("contact", Arrays.asList("reach", "email"));
        synonyms.put("clearance", Arrays.asList("permit", "approval"));
    }

    private List<String> expandWithSynonyms(List<String> words) {
        List<String> expanded = new ArrayList<>(words);
        for (String w : words) {
            if (synonyms.containsKey(w)) {
                expanded.addAll(synonyms.get(w));
            }
        }
        return expanded;
    }

    // ----------------------------------------------------------
    // PREPROCESS
    // ----------------------------------------------------------
    private List<String> preprocess(String text) {
        if (text == null) return Collections.emptyList();
        String cleaned = text.replaceAll("[^a-zA-Z0-9\\s]", " ").toLowerCase();

        List<String> tokens = Arrays.stream(cleaned.split("\\s+"))
                .filter(s -> !s.isBlank() && !stopwords.contains(s))
                .collect(Collectors.toList());

        return expandWithSynonyms(tokens);
    }

    // ----------------------------------------------------------
    // TF-IDF INDEXING
    // ----------------------------------------------------------
    
    private void indexKnowledgeBase() {
        docs.clear();
        tfidfVectors.clear();
        idf.clear();

        // 🔹 Only index PUBLISHED KB entries
        List<KnowledgeBase> publishedDocs = kbRepo.findByIsPublished(true);
        docs.addAll(publishedDocs);

        List<Map<String, Integer>> termFreqs = new ArrayList<>();
        Map<String, Integer> docCounts = new HashMap<>();

        for (KnowledgeBase doc : docs) {
            String text =
                    (doc.getTitle() == null ? "" : doc.getTitle()) + " " +
                    (doc.getQuestionPattern() == null ? "" : doc.getQuestionPattern()) + " " +
                    (doc.getAnswer() == null ? "" : doc.getAnswer());

            List<String> tokens = preprocess(text);
            Map<String, Integer> tf = new HashMap<>();

            for (String t : tokens) {
                tf.put(t, tf.getOrDefault(t, 0) + 1);
            }

            termFreqs.add(tf);

            for (String term : tf.keySet()) {
                docCounts.put(term, docCounts.getOrDefault(term, 0) + 1);
            }
        }

        int N = docs.size();
        for (String term : docCounts.keySet()) {
            int df = docCounts.get(term);
            idf.put(term, Math.log((double) N / df) + 1.0);
        }

        for (Map<String, Integer> tf : termFreqs) {
            Map<String, Double> vec = new HashMap<>();
            double sumSq = 0.0;

            for (Map.Entry<String, Integer> e : tf.entrySet()) {
                double tfidf = e.getValue() * idf.getOrDefault(e.getKey(), 0.0);
                vec.put(e.getKey(), tfidf);
                sumSq += tfidf * tfidf;
            }

            double norm = Math.sqrt(sumSq);

            for (String key : vec.keySet()) {
                vec.put(key, vec.get(key) / (norm == 0 ? 1 : norm));
            }

            tfidfVectors.add(vec);
        }
    }


    // ----------------------------------------------------------
    // TYPO HANDLING (Levenshtein)
    // ----------------------------------------------------------
    private int levenshtein(String a, String b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;

                dp[i][j] = Math.min(
                        Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1),
                        dp[i - 1][j - 1] + cost
                );
            }
        }
        return dp[a.length()][b.length()];
    }

    private String findBestCandidate(String token) {
        if (tokenCorrectionCache.containsKey(token)) {
            return tokenCorrectionCache.get(token);
        }

        String best = token;
        int bestDist = Integer.MAX_VALUE;
        int maxAllow = token.length() <= 4 ? 1 : 2;

        for (String cand : idf.keySet()) {
            if (Math.abs(cand.length() - token.length()) > maxAllow) continue;

            int d = levenshtein(token, cand);
            if (d < bestDist) {
                bestDist = d;
                best = cand;
            }
        }

        tokenCorrectionCache.put(token, bestDist <= maxAllow ? best : token);
        return tokenCorrectionCache.get(token);
    }

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------
    public List<SearchResult> search(String query, int topK) {
        List<String> tokens = preprocess(query);

        if (tokens.isEmpty()) return Collections.emptyList();

        List<String> expandedTokens = new ArrayList<>();
        for (String q : tokens) {
            expandedTokens.add(q);
            expandedTokens.add(findBestCandidate(q));
        }

        Map<String, Integer> qtf = new HashMap<>();
        expandedTokens.forEach(t -> qtf.put(t, qtf.getOrDefault(t, 0) + 1));

        Map<String, Double> qvec = new HashMap<>();
        double sumSq = 0.0;

        for (var e : qtf.entrySet()) {
            double tfidf = e.getValue() * idf.getOrDefault(e.getKey(), 1.0);
            qvec.put(e.getKey(), tfidf);
            sumSq += tfidf * tfidf;
        }

        double qnorm = Math.sqrt(sumSq);
        qvec.replaceAll((k, v) -> v / (qnorm == 0 ? 1 : qnorm));

        PriorityQueue<SearchResult> pq =
                new PriorityQueue<>(Comparator.comparingDouble(r -> r.score));

        for (int i = 0; i < docs.size(); i++) {
            double dot = 0.0;
            for (String q : qvec.keySet()) {
                dot += qvec.get(q) * tfidfVectors.get(i).getOrDefault(q, 0.0);
            }

            if (dot > 0) {
                KnowledgeBase d = docs.get(i);
                pq.add(new SearchResult(d.getKbId(), d.getTitle(), dot));
                if (pq.size() > topK) pq.poll();
            }
        }

        List<SearchResult> results = new ArrayList<>();
        while (!pq.isEmpty()) results.add(pq.poll());
        Collections.reverse(results);

        return results;
    }

    public void rebuildIndex() {
        indexKnowledgeBase();
    }

    // ----------------------------------------------------------
    // RESULT DTO
    // ----------------------------------------------------------
    public static class SearchResult {
        private Long id;
        private String title;
        private double score;

        public SearchResult(Long id, String title, double score) {
            this.id = id;
            this.title = title;
            this.score = score;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public double getScore() { return score; }
    }
}
