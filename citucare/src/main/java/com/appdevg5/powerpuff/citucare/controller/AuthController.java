package com.appdevg5.powerpuff.citucare.controller;

import com.appdevg5.powerpuff.citucare.dto.AdminLoginRequestDto;
import com.appdevg5.powerpuff.citucare.dto.AdminLoginResponseDto;
import com.appdevg5.powerpuff.citucare.dto.RegisterRequestDto;
import com.appdevg5.powerpuff.citucare.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/admin/login")
    public ResponseEntity<AdminLoginResponseDto> loginAdmin(
            @RequestBody AdminLoginRequestDto request) {

        AdminLoginResponseDto response = authService.loginAdmin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {

        String response = authService.register(request);

        return ResponseEntity.ok(response);
    }
}
