package com.appdevg5.powerpuff.citucare.service;

import com.appdevg5.powerpuff.citucare.dto.AdminLoginRequestDto;
import com.appdevg5.powerpuff.citucare.dto.AdminLoginResponseDto;
import com.appdevg5.powerpuff.citucare.dto.RegisterRequestDto;
import com.appdevg5.powerpuff.citucare.entity.Department;
import com.appdevg5.powerpuff.citucare.entity.User;
import com.appdevg5.powerpuff.citucare.enums.Role;
import com.appdevg5.powerpuff.citucare.repository.UserRepository;

import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // Force reset superadmin password (optional safety)
    @PostConstruct
    public void forceResetSuperAdminPassword() {
        userRepository.findByEmailIgnoreCase("superadmin@cit.edu")
            .ifPresent(user -> {
                user.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(user);
                System.out.println("✅ SuperAdmin password forcibly reset");
            });
    }


    // Migrate plain passwords to BCrypt
    @PostConstruct
    public void migratePlainPasswordsToBCrypt() {

        userRepository.findAll().forEach(user -> {

            if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
            }

        });

        System.out.println("✅ Existing user passwords migrated to BCrypt");
    }


    public AdminLoginResponseDto loginAdmin(AdminLoginRequestDto request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email and password are required"
            );
        }

        User user = userRepository
                .findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"
                        ));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        System.out.println(
                "DEBUG LOGIN => email=" + user.getEmail()
                        + ", role=" + user.getRole()
        );

        // RBAC Authorization
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.SUPER_ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "User is not authorized as Admin"
            );
        }

        AdminLoginResponseDto dto = new AdminLoginResponseDto();
        dto.setUserId(user.getUserId());
        dto.setFname(user.getFname());
        dto.setLname(user.getLname());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());

        Department dept = user.getDepartment();

        if (dept != null) {
            dto.setDepartmentId(dept.getDepartmentId());
            dto.setDepartmentName(dept.getDeptName());
        }

        return dto;
    }


    public String register(RegisterRequestDto request) {

        String email = request.getEmail();

        if (email == null || !email.endsWith("@cit.edu")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only institutional emails are allowed"
            );
        }

        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email already exists"
            );
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Passwords do not match"
            );
        }

        User user = new User();

        user.setFname(request.getFname());
        user.setLname(request.getLname());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Normal registered users
        user.setRole(Role.USER);

        // Users do not need department
        user.setDepartment(null);

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return "User registered successfully";
    }
}