package com.example.back.controller.response;

import com.example.back.entity.Comment;
import com.example.back.entity.Follow;
import com.example.back.entity.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.time.format.DateTimeFormatter;
import java.util.List;

public class CommentResponse {
    @Data
    @Builder
    public static class ListDetail {
        private Long pk;
        private UserResponse.Simple user;
        private String content;
        private String created_at;
        private boolean me;

        public static CommentResponse.ListDetail of(Comment comment, boolean me){
            return ListDetail.builder()
                    .pk(comment.getPk())
                    .user(UserResponse.Simple.of(comment.getUser()))
                    .content(comment.getContent())
                    .me(me)
                    .created_at(comment.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                    .build();
        }

    }
    @Data
    @Builder
    public static class CommentList {
        private List<CommentResponse.ListDetail> comments;
        private boolean last;

        public static CommentResponse.CommentList of(Page<Comment> commentsPage, String userId){
            return CommentResponse.CommentList.builder()
                    .comments(commentsPage.getContent().stream().map(comment -> CommentResponse.ListDetail.of(comment,comment.getUser().getId().equals(userId))).toList())
                    .last(commentsPage.isLast())
                    .build();
        }
    }
}
