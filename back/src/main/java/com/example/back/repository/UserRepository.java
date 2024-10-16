package com.example.back.repository;

import com.example.back.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface UserRepository  extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    Optional<User> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
    Page<User> findByNameContainingAndPkNotInAndIsLeaveFalse(String name, Collection<Long> pks, Pageable pageable);
}
