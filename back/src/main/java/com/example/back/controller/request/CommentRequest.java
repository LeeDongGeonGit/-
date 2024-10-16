package com.example.back.controller.request;

import lombok.Data;

public class CommentRequest {
    @Data
    public static class Create{
        private String content;
        private Long post_pk;
    }
}
