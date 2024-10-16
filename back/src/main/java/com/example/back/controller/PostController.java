package com.example.back.controller;

import com.example.back.controller.request.PostRequest;
import com.example.back.controller.response.PostResponse;
import com.example.back.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/post")
public class PostController {
    private final PostService postService;
    @PostMapping
    public ResponseEntity<Boolean> postUp(@RequestBody PostRequest.Create requestedPost){
        return ResponseEntity.ok(postService.postUp(requestedPost));
    }
    @PostMapping("/ro")
    public ResponseEntity<Boolean> postUp1(@RequestBody PostRequest.Create1 requestedPost){
        return ResponseEntity.ok(postService.postUp1(requestedPost));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deletePost(@PathVariable Long id){
        return ResponseEntity.ok(postService.deletePost(id));
    }
    @GetMapping("/userList/{page}")
    public ResponseEntity<PostResponse.PostList> getUserPostList(@PathVariable int page){
        return ResponseEntity.ok(postService.getUserPostList(page));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Boolean> putPost(@RequestBody PostRequest.Create requestedPost, @PathVariable Long id){
        return ResponseEntity.ok(postService.putPost(requestedPost, id));
    }
    @GetMapping("/{page}")
    public ResponseEntity<PostResponse.PostList> getLatestList(@PathVariable int page){
        return ResponseEntity.ok(postService.getPostList(page));
    }
    @GetMapping("/{page}/{query}")
    public ResponseEntity<PostResponse.PostList> getSearchList(@PathVariable int page,@PathVariable String query){
        return ResponseEntity.ok(postService.getPostListSearch(page,query));
    }
    @GetMapping("/userInfo/{id}/{page}")
    public ResponseEntity<PostResponse.PostList> getUserPostList(@PathVariable int page,@PathVariable Long id){
        return ResponseEntity.ok(postService.getOtherUserPostList(page,id));
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<PostResponse.Detail> getLatestList(@PathVariable Long id){
        return ResponseEntity.ok(postService.getPost(id));
    }
    @GetMapping("/map")
    public ResponseEntity<PostResponse.PostList> getMapPostList(){
        return ResponseEntity.ok(postService.getMapPostList());
    }
    @GetMapping("/myMap")
    public ResponseEntity<PostResponse.PostList> getMyMapPostList(){
        return ResponseEntity.ok(postService.getMyMapPostList());
    }
    @GetMapping("/otherMap/{id}")
    public ResponseEntity<PostResponse.PostList> getMyMapPostList(@PathVariable Long id){
        return ResponseEntity.ok(postService.getOtherMapPostList(id));
    }
    @GetMapping("/address/{page}")
    public ResponseEntity<PostResponse.PostList> getMapPostList(@PathVariable int page){
        return ResponseEntity.ok(postService.getPostListMap(page));
    }

}
