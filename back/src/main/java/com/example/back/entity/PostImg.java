package com.example.back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class PostImg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long pk;
    @ManyToOne
    private Post post;
    @Column(name = "img_url", length = 10000)
    private String imgUrl;
}
