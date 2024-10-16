package com.example.back.controller.response;

import com.example.back.entity.Follow;
import com.example.back.entity.User;
import lombok.Builder;
import lombok.Data;

public class LikesResponse {
    @Data
    @Builder
    public static class Reverse {
        private long heartPK;
        private long countHeart;

        public static LikesResponse.Reverse of(long heartPK, long countHeart){
            return Reverse.builder()
                    .heartPK(heartPK)
                    .countHeart(countHeart)
                    .build();
        }
    }
}
