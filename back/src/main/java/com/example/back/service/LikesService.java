package com.example.back.service;

import com.example.back.controller.request.LikesRequest;
import com.example.back.controller.response.LikesResponse;
import com.example.back.entity.Likes;
import com.example.back.entity.Post;
import com.example.back.entity.User;
import com.example.back.repository.LikesRepository;
import com.example.back.repository.PostRepository;
import com.example.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class LikesService {
    private final LikesRepository likesRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    public LikesResponse.Reverse like(LikesRequest.Change change){
        Optional<Post> postOptional = postRepository.findById(change.getPostPk());
        if(postOptional.isPresent()){
            Post post = postOptional.get();
        if(change.getLikesPk() != null){
            likesRepository.deleteById(change.getLikesPk());
            long count = post.getCountHeart() -1;
            post.setCountHeart(count);
            postRepository.save(post);
            return LikesResponse.Reverse.of(-1L, count);
        }
        else {
            String id = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findById(id).get();
            Likes newLikes = Likes.builder()
                    .post(post)
                    .user(user)
                    .build();
            long count = post.getCountHeart() +1;
            post.setCountHeart(count);
            postRepository.save(post);
            long hearPk = likesRepository.save(newLikes).getPk();
            return  LikesResponse.Reverse.of(hearPk,count);

        }}
        else {
            return null;
        }

    }
}
