package com.example.back.controller.response;

import com.example.back.entity.User;
import lombok.Builder;
import lombok.Data;

public class UserResponse {
    @Data
    @Builder
    public static class Detail {
        private long pk;
        private String id;
        private String email;
        private String name;
        private String phone;
        private String birth;
        private String img_url;
        private Long postSum;
        private Long followSum;
        private String address;
        private double x_coordinate;
        private double y_coordinate;

        public static Detail of(User user,Long postSum,Long followSum){
            return Detail.builder()
                    .pk(user.getPk())
                    .name(user.getName())
                    .phone(user.getPhone())
                    .birth(user.getBirth())
                    .id(user.getId())
                    .email(user.getEmail())
                    .img_url(user.getImg_url())
                    .postSum(postSum)
                    .followSum(followSum)
                    .x_coordinate(user.getX_coordinate())
                    .y_coordinate(user.getY_coordinate())
                    .address(user.getAddress())
                    .build();
        }
        public static Detail of(User user){
            return Detail.builder()
                    .pk(user.getPk())
                    .name(user.getName())
                    .phone(user.getPhone())
                    .birth(user.getBirth())
                    .id(user.getId())
                    .email(user.getEmail())
                    .img_url(user.getImg_url())
                    .x_coordinate(user.getX_coordinate())
                    .y_coordinate(user.getY_coordinate())
                    .address(user.getAddress())
                    .build();
        }
    }
    @Data
    @Builder
    public static class Simple {
        private long pk;
        private String name;
        private String img_url;
        private Long postSum;
        private Long followSum;
        private boolean follow;

        public static Simple of(User user){
            return Simple.builder()
                    .pk(user.getPk())
                    .name(user.getName())
                    .img_url(user.getImg_url())
                    .build();
        }
        public static Simple of(User user, Long postSum,Long followSum){
            return Simple.builder()
                    .pk(user.getPk())
                    .name(user.getName())
                    .img_url(user.getImg_url())
                    .postSum(postSum)
                    .followSum(followSum)
                    .build();
        }
        public static Simple of(User user, Long postSum,Long followSum, boolean follow){
            return Simple.builder()
                    .pk(user.getPk())
                    .name(user.getName())
                    .img_url(user.getImg_url())
                    .postSum(postSum)
                    .followSum(followSum)
                    .follow(follow)
                    .build();
        }
    }

}
