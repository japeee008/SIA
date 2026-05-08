package com.appdevg5.powerpuff.citucare.features.category;

public class CategoryDto {

    private Long id;
    private String categoryName;

    public CategoryDto() {
        super();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
