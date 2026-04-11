package com.appdevg5.powerpuff.citucare.features.auth;

public class AdminLoginRequestDto {

    private String email;
    private String password;

    public AdminLoginRequestDto() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
