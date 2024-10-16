package com.example.back.controller.request;

import lombok.Data;

public class UserRequest {
    @Data
    public static class Create{
        private String name;
        private String phone;
        private String birth;
        private String id;
        private String password;
        private String email;
        private String address;
        private double x_coordinate;
        private double y_coordinate;
    }
    @Data
    public static class Update{
        private String name;
        private String phone;
        private String birth;
        private String password;
        private String img_url;
        private String address;
        private double x_coordinate;
        private double y_coordinate;
    }
    @Data
    public static class Login{
        private String password;
        private String id;
    }

}
