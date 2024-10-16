package com.example.back.repository;

import com.example.back.entity.Likes;
import com.example.back.entity.Post;
import com.example.back.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikesRepository  extends JpaRepository<Likes, Long> {
    boolean existsByUserAndPost(User user, Post post);
    Optional<Likes> findByUserAndPost(User user, Post post);
}
