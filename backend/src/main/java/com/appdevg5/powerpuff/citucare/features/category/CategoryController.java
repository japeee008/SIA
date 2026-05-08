package com.appdevg5.powerpuff.citucare.features.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category category) {
        Category existing = categoryService.getCategoryById(id);
        if (existing == null) return null;
        existing.setCategoryName(category.getCategoryName());
        existing.setDescription(category.getDescription());
        existing.setUpdatedAt(java.time.LocalDateTime.now());
        return categoryService.saveCategory(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteById(id);
    }
}
