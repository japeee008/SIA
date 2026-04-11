package com.appdevg5.powerpuff.citucare.features.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody UserLoginRequestDto request) {
        User user = authService.loginUser(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AdminLoginResponseDto> loginAdmin(@RequestBody AdminLoginRequestDto request) {
        AdminLoginResponseDto response = authService.loginAdmin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {
        String response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String,String> body) {

        String email = body.get("email");

        String token = authService.forgotPassword(email);

        return ResponseEntity.ok(Map.of(
                "message","Reset token generated",
                "resetToken",token
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String,String> body) {

        String token = body.get("token");
        String password = body.get("password");

        String response = authService.resetPassword(token,password);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {

        Long userId = Long.parseLong(body.get("userId"));
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        String response = authService.changePassword(userId, currentPassword, newPassword);

        return ResponseEntity.ok(response);
    }
}