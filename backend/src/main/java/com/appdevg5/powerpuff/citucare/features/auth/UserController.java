package com.appdevg5.powerpuff.citucare.features.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import com.appdevg5.powerpuff.citucare.enums.Role;
import com.appdevg5.powerpuff.citucare.features.department.Department;
import com.appdevg5.powerpuff.citucare.features.department.DepartmentRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> all() {
        return userService.findAll();
    }

    @PostMapping
    public User create(@RequestBody User u) {

        if (u.getDepartment() != null && u.getDepartment().getDepartmentId() != null) {

            Department dept = departmentRepository
                    .findById(u.getDepartment().getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));

            u.setDepartment(dept);
        }

        // ensure role is ADMIN
        if (u.getRole() == null) {
            u.setRole(Role.ADMIN);
        }

        // hash password
        if (u.getPassword() == null || u.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        u.setPassword(passwordEncoder.encode(u.getPassword()));

        u.setCreatedAt(LocalDateTime.now());
        u.setUpdatedAt(LocalDateTime.now());

        return userService.save(u);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> get(@PathVariable Long id) {

        User user = userService.findById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User u) {

        try {

            User existing = userService.findById(id);

            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            existing.setFname(u.getFname());
            existing.setLname(u.getLname());
            existing.setEmail(u.getEmail());
            existing.setRole(u.getRole());

            // KEEP PASSWORD IF EMPTY
            if (u.getPassword() != null && !u.getPassword().isEmpty()) {
                existing.setPassword(u.getPassword());
            }

            // DEPARTMENT SAFE SET
            if (u.getDepartment() != null && u.getDepartment().getDepartmentId() != null) {

                Department dept = departmentRepository
                        .findById(u.getDepartment().getDepartmentId())
                        .orElse(null);

                if (dept != null) {
                    existing.setDepartment(dept);
                }
            }

            existing.setUpdatedAt(LocalDateTime.now());

            return ResponseEntity.ok(userService.save(existing));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        userService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}