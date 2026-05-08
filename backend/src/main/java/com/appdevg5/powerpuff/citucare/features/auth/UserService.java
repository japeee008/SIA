package com.appdevg5.powerpuff.citucare.features.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User save(User u) {
        LocalDateTime now = LocalDateTime.now();
        if (u.getCreatedAt() == null) u.setCreatedAt(now);
        u.setUpdatedAt(now);
        return userRepository.save(u);
    }

    public List<User> findAll() { return userRepository.findAllWithDepartment(); }

    public User findById(Long id) {
    return userRepository.findById(id).orElse(null);
    }


    public void deleteById(Long id) { userRepository.deleteById(id); }
}
