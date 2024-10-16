package com.example.back.controller.request;

import lombok.Data;

public class LikesRequest {
    @Data
    public static class Change{
        private Long likesPk;
        private Long postPk;
    }
}
