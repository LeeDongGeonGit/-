package com.example.back.repository;

import com.example.back.entity.Comment;
import com.example.back.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    Page<Comment> findByPost(Post post, Pageable pageable);
    Boolean existsByPost(Post post);
    Long countAllByPost(Post post);
}
