package com.example.back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long pk;
    @ManyToOne
    @JoinColumn(name = "from_user")
    private User fromUser;
    @ManyToOne
    @JoinColumn(name = "to_user")
    private User toUser;
    @Column(nullable = false,updatable = false ,name ="created_at")
    private LocalDateTime createdAt;
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }


}
