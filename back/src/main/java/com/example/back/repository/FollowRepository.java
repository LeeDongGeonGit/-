package com.example.back.repository;

import com.example.back.entity.Follow;
import com.example.back.entity.Likes;
import com.example.back.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Page<Follow> findByFromUser(User fromUser, Pageable pageable);
    Optional<Follow> findByFromUserAndToUser(User fromUser, User toUser);
    Boolean existsByFromUserAndToUser(User fromUser, User toUser);
    Long countByToUserId(String id);
    Long countByFromUserId(String id);
}
