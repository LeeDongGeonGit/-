package com.example.back.controller.response;

import com.example.back.entity.PostImg;
import com.example.back.entity.User;
import lombok.Builder;
import lombok.Data;

public class PostImgResponse {
    @Data
    @Builder
    public static class Simple {
        private long pk;
        private String imgUrl;

        public static PostImgResponse.Simple of(PostImg postImg) {
            return PostImgResponse.Simple.builder()
                    .pk(postImg.getPk())
                    .imgUrl(postImg.getImgUrl())
                    .build();
        }
    }
}
