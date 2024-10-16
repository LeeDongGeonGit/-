package com.example.back.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long pk;

    private String title;

    @Column( length = 10000)
    private String content;

    @Column(name = "is_public")
    private boolean isPublic;

    private double x_coordinate;

    private double y_coordinate;
    @Column( length = 500)
    private String img_url;

    private String tags;


    @Column(nullable = false,updatable = false ,name ="created_at")
    private LocalDateTime createdAt;

    private String address;

    private Long countHeart;

    @ManyToOne
    @JoinColumn(name = "user_pk")
    @JsonManagedReference
    private User user;
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        countHeart = 0L;
    }
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "post")
    @JsonManagedReference
    private List<Likes> likes = new ArrayList<>();

}