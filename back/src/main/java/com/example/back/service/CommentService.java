package com.example.back.service;

import com.example.back.controller.request.CommentRequest;
import com.example.back.controller.response.CommentResponse;
import com.example.back.entity.Comment;
import com.example.back.entity.Post;
import com.example.back.entity.User;
import com.example.back.repository.CommentRepository;
import com.example.back.repository.PostRepository;
import com.example.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Boolean addComment(CommentRequest.Create requested){
        try{
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            User userEntity = userRepository.findById(userId).get();
            Post postEntity = postRepository.findById(requested.getPost_pk()).get();
            Comment newComment = Comment.builder()
                    .user(userEntity)
                    .post(postEntity)
                    .content(requested.getContent())
                    .build();
            commentRepository.save(newComment);
            return true;
        } catch (Exception e){

            return  false;
        }
    }
    public Boolean deleteComment(Long commentPk){
        try{
            commentRepository.deleteById(commentPk);
            return true;
        } catch (Exception e){
            return  false;
        }
    }
    public CommentResponse.CommentList getComment(Long post_pk, int page){
        try {
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            Post postEntity = postRepository.findById(post_pk).get();
            PageRequest commentPageRequest = PageRequest.of(page-1, 10,  Sort.by("createdAt").descending()) ;
            Page<Comment> commentPage = commentRepository.findByPost(postEntity,commentPageRequest);
            return CommentResponse.CommentList.of(commentPage,userId);
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

}
