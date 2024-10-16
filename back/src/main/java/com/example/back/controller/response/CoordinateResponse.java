package com.example.back.controller.response;

import lombok.Data;

@Data
public class CoordinateResponse {
    private Long id;
    private Double lat;
    private Double lng;

    public CoordinateResponse(Long id, Double lat, Double lng) {
        this.id = id;
        this.lat = lat;
        this.lng = lng;
    }
}
