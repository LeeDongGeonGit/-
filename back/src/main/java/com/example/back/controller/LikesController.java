package com.example.back.controller;

import com.example.back.controller.request.LikesRequest;
import com.example.back.controller.request.PostRequest;
import com.example.back.controller.response.LikesResponse;
import com.example.back.entity.Likes;
import com.example.back.service.LikesService;
import com.example.back.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/likes")
public class LikesController {
    private final LikesService likesService;

    @PostMapping
    public ResponseEntity<LikesResponse.Reverse> likeChange(@RequestBody LikesRequest.Change requestedLikes){
        return ResponseEntity.ok(likesService.like(requestedLikes));
    }
}
