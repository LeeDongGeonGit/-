package com.example.back.repository;

import com.example.back.entity.Post;
import com.example.back.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByIsPublicTrue(Pageable pageable);
    Page<Post> findByIsPublicTrueAndUser(User user,Pageable pageable);
    Page<Post> findByIsPublicTrueAndTagsContainingOrTitleContainingOrContentContaining(String tags,String title,String content,Pageable pageable);
    Page<Post> findByUser(User user, Pageable pageable);
    List<Post> findByUser(User user);
    Long countByUserId(String id);
    Page<Post> findByIsPublicTrueAndAddressContaining(String address,Pageable pageable);
}
