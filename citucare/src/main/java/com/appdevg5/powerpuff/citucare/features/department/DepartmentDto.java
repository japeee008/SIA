package com.appdevg5.powerpuff.citucare.features.department;

public class DepartmentDto {

    private Long departmentId;
    private String deptName;
    private String email;

    public DepartmentDto() {
        super();
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
