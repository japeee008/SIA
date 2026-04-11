package com.appdevg5.powerpuff.citucare.features.kb;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeBaseRepository extends JpaRepository<KnowledgeBase, Long> {
    List<KnowledgeBase> findByCategory_Id(Long categoryId);
    List<KnowledgeBase> findByDepartment_DepartmentId(Long departmentId);
    List<KnowledgeBase> findByIsPublished(Boolean isPublished);
}
