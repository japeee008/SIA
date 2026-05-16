package com.appdevg5.powerpuff.citucare.features.auth;

public class UserLoginResponseDto {

    private Long userId;
    private String institutionalId;
    private String fname;
    private String lname;
    private String email;
    private String role;

    public UserLoginResponseDto(User user) {
        this.userId = user.getUserId();
        this.institutionalId = user.getInstitutionalId();
        this.fname = user.getFname();
        this.lname = user.getLname();
        this.email = user.getEmail();
        this.role = user.getRole().name();
    }

    public Long getUserId() {
        return userId;
    }

    public String getInstitutionalId() {
        return institutionalId;
    }

    public String getFname() {
        return fname;
    }

    public String getLname() {
        return lname;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}