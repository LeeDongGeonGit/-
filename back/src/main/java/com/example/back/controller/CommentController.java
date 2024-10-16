package com.example.back.controller;

import com.example.back.controller.request.CommentRequest;
import com.example.back.controller.response.CommentResponse;
import com.example.back.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comment")
public class CommentController {
    private final CommentService commentService;
    @PostMapping
    public ResponseEntity<Boolean> addComment(@RequestBody CommentRequest.Create requested){
        return ResponseEntity.ok(commentService.addComment(requested));
    }
    @DeleteMapping("/{comment_pk}")
    public ResponseEntity<Boolean> deleteComment(@PathVariable Long comment_pk){
        return ResponseEntity.ok(commentService.deleteComment(comment_pk));
    }
    @GetMapping("/{post_pk}/{page}")
    public ResponseEntity<CommentResponse.CommentList> getComment(@PathVariable Long post_pk,@PathVariable int page){
        return ResponseEntity.ok(commentService.getComment(post_pk,page));
    }

}
