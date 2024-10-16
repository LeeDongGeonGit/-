package com.example.back.service;

import com.example.back.entity.Coordinate;
import com.example.back.repository.CoordinateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoordinateService {

    @Autowired
    private CoordinateRepository coordinateRepository;

    // 모든 좌표 데이터를 가져오는 메서드
    public List<Coordinate> getAllCoordinates() {
        return coordinateRepository.findAll();
    }

    // 새로운 좌표 데이터를 생성하고 저장하는 메서드
    public Coordinate createCoordinate(Coordinate coordinate) {
        return coordinateRepository.save(coordinate);
    }
}
