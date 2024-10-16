package com.example.back.controller.request;

import com.example.back.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

public class PostRequest {

    @Data
    public static class Create{
        private String title;
        private String content;
        private String isPublic;
        private double x_coordinate;
        private double y_coordinate;
        private String[] img_url;
        private String tags;
        private String address;
    }
    @Data
    public static class Create1{
        private String user;
        private String title;
        private String content;
        private String isPublic;
        private double x_coordinate;
        private double y_coordinate;
        private String[] img_url;
        private String tags;
        private String address;
    }
}
