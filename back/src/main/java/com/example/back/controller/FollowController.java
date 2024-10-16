package com.example.back.controller;

import com.example.back.controller.response.FollowResponse;
import com.example.back.controller.response.PostResponse;
import com.example.back.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/follow")
public class FollowController {
    private final FollowService followService;
    @PostMapping("/{userPk}")
    public ResponseEntity<Boolean> addFollow(@PathVariable Long userPk){
        return ResponseEntity.ok(followService.addFollow(userPk));
    }
    @DeleteMapping("/{followPk}")
    public ResponseEntity<Boolean> deleteFollow(@PathVariable Long followPk){
        return ResponseEntity.ok(followService.deleteFollow(followPk));
    }
    @GetMapping("/{page}")
    public ResponseEntity<FollowResponse.FollowList> getList(@PathVariable int page){
        return ResponseEntity.ok(followService.getList(page));
    }
    @PutMapping("/reverse/{toUser}")
    public ResponseEntity<FollowResponse.Reverse> getList(@PathVariable Long toUser){
        return ResponseEntity.ok(followService.reversFollow(toUser));
    }
    @GetMapping("/{page}/{query}")
    public ResponseEntity<FollowResponse.FollowList> getSearchList(@PathVariable int page,@PathVariable String query){
        return ResponseEntity.ok(followService.getSearchList(page,query));
    }
    @GetMapping("/rank")
    public ResponseEntity<FollowResponse.FollowList> getRankList(){
        return ResponseEntity.ok(followService.getRankList());
    }
}
