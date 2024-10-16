package com.example.back.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Coordinate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double lat;
    private Double lng;

    // Getter for id
    public Long getId() {
        return id;
    }

    // Setter for id
    public void setId(Long id) {
        this.id = id;
    }

    // Getter for lat
    public Double getLat() {
        return lat;
    }

    // Setter for lat
    public void setLat(Double lat) {
        this.lat = lat;
    }

    // Getter for lng
    public Double getLng() {
        return lng;
    }

    // Setter for lng
    public void setLng(Double lng) {
        this.lng = lng;
    }
}
