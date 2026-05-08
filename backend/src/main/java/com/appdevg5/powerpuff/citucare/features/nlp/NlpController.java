package com.appdevg5.powerpuff.citucare.features.nlp;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/nlp")
public class NlpController {

    private final NlpService nlpService;

    public NlpController(NlpService nlpService) {
        this.nlpService = nlpService;
    }

    @GetMapping("/search")
    public List<NlpResultDto> search(@RequestParam("q") String q,
                                     @RequestParam(value = "k", defaultValue = "5") int k) {

        return nlpService.search(q, k).stream()
                .map(r -> new NlpResultDto(r.getId(), r.getTitle(), r.getScore()))
                .collect(Collectors.toList());
    }
}
