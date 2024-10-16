package com.example.back.controller;

import com.example.back.controller.response.CoordinateResponse;
import com.example.back.entity.Coordinate;
import com.example.back.service.CoordinateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class CoordinateController {

    @Autowired
    private CoordinateService coordinateService;

    // GET 요청: 모든 좌표 데이터를 가져오는 API
    @GetMapping("/markers")
    public List<CoordinateResponse> getAllCoordinates() {
        List<Coordinate> coordinates = coordinateService.getAllCoordinates();
        return coordinates.stream()
                .map(coord -> new CoordinateResponse(coord.getId(), coord.getLat(), coord.getLng()))
                .collect(Collectors.toList());
    }

    // POST 요청: 새로운 좌표 데이터를 생성하는 API
    @PostMapping("/sendCoordinates")
    public CoordinateResponse createCoordinate(@RequestBody Coordinate coordinate) {
        Coordinate newCoordinate = coordinateService.createCoordinate(coordinate);
        return new CoordinateResponse(newCoordinate.getId(), newCoordinate.getLat(), newCoordinate.getLng());
    }
}
