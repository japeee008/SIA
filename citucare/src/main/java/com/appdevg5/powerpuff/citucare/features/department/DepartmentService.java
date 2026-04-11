package com.appdevg5.powerpuff.citucare.features.department;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public Department save(Department d) {
        LocalDateTime now = LocalDateTime.now();
        if (d.getCreatedAt() == null) d.setCreatedAt(now);
        d.setUpdatedAt(now);
        return departmentRepository.save(d);
    }

    public List<Department> findAll() { return departmentRepository.findAll(); }

    public Department findById(Long id) { return departmentRepository.findById(id).orElse(null); }

    public void deleteById(Long id) { departmentRepository.deleteById(id); }
}
