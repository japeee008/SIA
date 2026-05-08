package com.appdevg5.powerpuff.citucare.features.nlp;

public class NlpResultDto {

    private Long id;
    private String title;
    private double score;

    public NlpResultDto(Long id, String title, double score) {
        this.id = id;
        this.title = title;
        this.score = score;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public double getScore() {
        return score;
    }
}
