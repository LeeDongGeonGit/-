package com.example.back.controller;

import com.example.back.controller.request.UserRequest;
import com.example.back.controller.response.UserResponse;
import com.example.back.entity.User;
import com.example.back.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    @PostMapping
    public ResponseEntity<Boolean> create(@RequestBody UserRequest.Create requestedUser){
        return ResponseEntity.ok(userService.create(requestedUser));
    }
    @DeleteMapping
    public ResponseEntity delete() {
        return userService.delete();
    }
    @GetMapping("/{id}/checkid")
    public ResponseEntity<Boolean> checkId(@PathVariable String id){
        return ResponseEntity.ok(userService.checkId(id));
    }

    @GetMapping("/{email}/sendemail")
    public ResponseEntity<Boolean> sendEmail(@PathVariable String email) {
        if(userService.existEmail(email)){
            return ResponseEntity.ok(false);
        }else {
            return ResponseEntity.ok(userService.sendEmail(email));
        }
    }
    @GetMapping("/{email}/{num}/authentication")
    public ResponseEntity<Boolean> emailAuthenticationId(@PathVariable String email, @PathVariable String num) {
        return ResponseEntity.ok(userService.emailAuthentication(email,num));
    }
    @GetMapping("/{email}/sendemail-id")
    public ResponseEntity<Boolean> sendEmailId(@PathVariable String email) {
        if(userService.existEmail(email)){
            return ResponseEntity.ok(userService.sendEmail(email));
        }
        else {
            return ResponseEntity.ok(false);
        }
    }


    @GetMapping("/{email}/{num}/id")
    public ResponseEntity<Boolean> getIdByEmail(@PathVariable String email, @PathVariable String num){
        return ResponseEntity.ok(userService.getIdByEmail(email,num));
    }

    @GetMapping("/{email}/{id}/sendemail")
    public ResponseEntity<String> sendEmailPW(@PathVariable String email, @PathVariable String id) {
        return ResponseEntity.ok(userService.sendEmailPW(email, id));
    }
    @GetMapping("/{email}/{num}/authentication-pw")
    public ResponseEntity<Boolean> emailAuthenticationPw(@PathVariable String email, @PathVariable String num) {
        return ResponseEntity.ok(userService.getPwByEmail(email,num));
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserRequest.Login user){
        return ResponseEntity.ok(userService.login(user));

    }
    @GetMapping("/mypage")
    public ResponseEntity<UserResponse.Detail> getMyInfo(){
        return ResponseEntity.ok(userService.getMyInfo());
    }
    @PutMapping("/mypage/change/myInfo")
    public ResponseEntity<UserResponse.Detail> changeName(@RequestBody UserRequest.Update user){
        return ResponseEntity.ok(userService.changeMyInfo(user));
    }
    @PutMapping("/mypage/change/pw")
    public ResponseEntity<Boolean> putMyPW(@RequestBody UserRequest.Update user){
        return ResponseEntity.ok(userService.putMyPW(user));
    }
    @GetMapping("/userInfo/{id}")
    public ResponseEntity<UserResponse.Simple> getMyInfo(@PathVariable Long id){
        return ResponseEntity.ok(userService.getOtherInfo(id));
    }

    @GetMapping("/mapRank/{address}")
    public ResponseEntity<List<UserResponse.Simple>> getMyInfo(@PathVariable String address){
        return ResponseEntity.ok(userService.getMapRankUser(address));
    }





}
