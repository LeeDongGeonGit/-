package com.example.back.repository;


import com.example.back.entity.Post;
import com.example.back.entity.PostImg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostImgRepository extends JpaRepository<PostImg, Long> {
    List<PostImg> findByPostPk(Long pk);
}
