package com.appdevg5.powerpuff.citucare.features.kb;

import com.appdevg5.powerpuff.citucare.features.category.CategoryDto;
import com.appdevg5.powerpuff.citucare.features.department.DepartmentDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class KnowledgeBaseDto {

    private Long kbId;
    private String title;
    private String questionPattern;
    private String answer;
    private Boolean isPublished;
    private String createdBy;
    private String updatedBy;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    private CategoryDto category;
    private DepartmentDto department;

    public KnowledgeBaseDto() {
        super();
    }

    public Long getKbId() {
        return kbId;
    }

    public void setKbId(Long kbId) {
        this.kbId = kbId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getQuestionPattern() {
        return questionPattern;
    }

    public void setQuestionPattern(String questionPattern) {
        this.questionPattern = questionPattern;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    //TIMESTAMP GETTERS/SETTERS

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public CategoryDto getCategory() {
        return category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }

    public DepartmentDto getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentDto department) {
        this.department = department;
    }
}
