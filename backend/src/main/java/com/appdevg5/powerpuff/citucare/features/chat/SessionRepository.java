package com.appdevg5.powerpuff.citucare.features.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findBySessionIdAndUser_UserId(Long sessionId, Long userId);
}