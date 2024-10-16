package com.example.back.service;

import com.example.back.controller.request.UserRequest;
import com.example.back.controller.response.PostResponse;
import com.example.back.controller.response.UserResponse;
import com.example.back.emailapi.EmailNumList;
import com.example.back.emailapi.EmailService;
import com.example.back.emailapi.MailDto;
import com.example.back.entity.Likes;
import com.example.back.entity.Post;
import com.example.back.entity.User;
import com.example.back.jwt.JwtTokenProvider;
import com.example.back.repository.FollowRepository;
import com.example.back.repository.PostRepository;
import com.example.back.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RequiredArgsConstructor
@Service
public class UserService  {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FollowRepository followRepository;
    private final PostRepository postRepository;
    private final JwtTokenProvider jwtTokenProvider;
    @Autowired
    private EmailService emailService;

    @Transactional
    public Boolean create(UserRequest.Create requestedUser) {
        try {
            User createdUser = User.builder()
                    .id(requestedUser.getId())
                    .email(requestedUser.getEmail())
                    .password(passwordEncoder.encode(requestedUser.getPassword()))
                    .name(requestedUser.getName())
                    .phone(requestedUser.getPhone())
                    .birth(requestedUser.getBirth())
                    .address(requestedUser.getAddress())
                    .x_coordinate(requestedUser.getX_coordinate())
                    .y_coordinate(requestedUser.getY_coordinate())
                    .isLeave(false)
                    .build();
            userRepository.save(createdUser);
            // 저장 성공 시 true 반환
            return true;
        } catch (Exception e) {
            // 저장 실패 시 false 반환
            return false;
        }
    }
    public ResponseEntity delete() {
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"해당 id를 가진 계정이 없습니다.\"}");
        } else {
            User user = userOptional.get();
            user.setLeave(true);
            userRepository.save(user);
            return ResponseEntity.ok("회원탈퇴를 완료했습니다.");
        }
    }
    @Transactional
    public Boolean checkId(String id) {
        return userRepository.existsById(id);
    }
    public Boolean emailAuthenticationPw(String email, String num) {
        return EmailNumList.sameNumNoDelete(email, num);
    }

    public Boolean sendEmail(String email) {
        MailDto mailDto = new MailDto();
        mailDto.setEmailAddr(email);
        mailDto.setEmailTitle("[우리 동네 대장 찾기]");
        String num = generateRandomNumber();
        mailDto.setEmailContent("본인확인 인증번호는 ["+ num+"]");
        emailService.sendSimpleMessage(mailDto);
        EmailNumList.addNum(email, num);
        return true;
    }
    public Boolean sendEmail(String email, String num) {
        MailDto mailDto = new MailDto();
        mailDto.setEmailAddr(email);
        mailDto.setEmailTitle("[우리 동네 대장 찾기]");
        mailDto.setEmailContent("본인확인 인증번호는 ["+ num+"]");
        emailService.sendSimpleMessage(mailDto);
        EmailNumList.addNum(email, num);
        return true;
    }
    public Boolean sendEmail(String email, String num, String title) {
        MailDto mailDto = new MailDto();
        mailDto.setEmailAddr(email);
        mailDto.setEmailTitle(title);
        mailDto.setEmailContent("비밀번호는 ["+ num+"]" +"입니다");
        emailService.sendSimpleMessage(mailDto);
        EmailNumList.addNum(email, num);
        return true;
    }

    public Boolean sendEmail123(String email, String num, String title) {
        MailDto mailDto = new MailDto();
        mailDto.setEmailAddr(email);
        mailDto.setEmailTitle(title);
        mailDto.setEmailContent("아이디 찾기 ["+ num+"]");
        emailService.sendSimpleMessage(mailDto);
        EmailNumList.addNum(email, num);
        return true;
    }
    public Boolean existEmail(String email){
        return userRepository.existsByEmail(email);
    }


    // 랜덤한 숫자 생성
    private String generateRandomNumber() {
        Random random = new Random();
        int length = random.nextInt(3) + 4; // 4~6 사이의 길이
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10)); // 0~9 사이의 숫자
        }
        return sb.toString();
    }

    public Boolean emailAuthentication(String email, String num) {
        return EmailNumList.sameNum(email, num);
    }

    public boolean getIdByEmail(String email, String num) {
        if (EmailNumList.sameNum(email, num)) {
            Optional<User> user = userRepository.findByEmail(email);
            sendEmail123(email,user.get().getId(), "동네 대장 아이디 찾기");
            return true;

        } else {
            return false;
        }
    }
    public String sendEmailPW(String email, String id){
        if(userRepository.existsById(id) && userRepository.existsByEmail(email)){
            User user = userRepository.findByEmail(email).get();
            if(user.getId().equals(id)){
                sendEmail(email,generateRandomNumber());
                return "인증번호를 전송했습니다.";
            }
            else {
                return "아이디와 이메일이 일치하지 않습니다.";
            }
        }
        else {
            return "아이디 또는 이메일이 존재하지 않습니다.";
        }
    }
    public boolean getPwByEmail(String email, String num) {
        if (EmailNumList.sameNum(email, num)) {
            User user = userRepository.findByEmail(email).get();
            String randomNumber = generateRandomNumber();
            user.setPassword(passwordEncoder.encode(randomNumber));
            userRepository.save(user);
            sendEmail(email,randomNumber,"동네 대장 비밀번호찾기(랜덤한 숫자로 변경)");
            return true;

        } else {
            return false;
        }
    }


    public String login(UserRequest.Login loginUser) {
        Optional<User> findUser = userRepository.findById(loginUser.getId());
        if (!findUser.isPresent()) {
            return null;
        }else if(findUser.get().isLeave()){
            return null;
        }
        else if (!passwordEncoder.matches(loginUser.getPassword(), findUser.get().getPassword())) {
            return null;
        } else {
            return jwtTokenProvider.createToken(findUser.get().getId());
        }


    }

    public UserResponse.Detail getMyInfo() {
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        User savedUser = userRepository.findById(id).get();
        Long postSum = postRepository.countByUserId(id);
        Long followSum = followRepository.countByToUserId(id);
        return UserResponse.Detail.of(savedUser, postSum, followSum);
    }
    public UserResponse.Simple getOtherInfo(Long id) {
        String from_id = SecurityContextHolder.getContext().getAuthentication().getName();
        User fromUser = userRepository.findById(from_id).get();
        User savedUser = userRepository.findById(id).get();
        Long postSum = postRepository.countByUserId(savedUser.getId());
        Long followSum = followRepository.countByToUserId(savedUser.getId());
        boolean follow = followRepository.existsByFromUserAndToUser(fromUser,savedUser);
        return UserResponse.Simple.of(savedUser, postSum, followSum,follow);
    }
    public UserResponse.Detail changeMyInfo(UserRequest.Update updateUser){
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        User savedUser = userRepository.findById(id).get();
        savedUser.setName(updateUser.getName());
        savedUser.setImg_url(updateUser.getImg_url());
        savedUser.setAddress(updateUser.getAddress());
        savedUser.setX_coordinate(updateUser.getX_coordinate());
        savedUser.setY_coordinate(updateUser.getY_coordinate());
        userRepository.save(savedUser);
        return UserResponse.Detail.of(savedUser);
    }

    public Boolean putMyPW(UserRequest.Update updateUser){
        try {
            String id = SecurityContextHolder.getContext().getAuthentication().getName();
            User savedUser = userRepository.findById(id).get();
            savedUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
            userRepository.save(savedUser);
            return true;
        } catch (Exception e){
            e.printStackTrace();
            return false;
        }

    }
    public List<UserResponse.Simple> getMapRankUser(String address){
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        User savedUser = userRepository.findById(id).get();
        PageRequest pageable = PageRequest.of(0,3, Sort.by("countHeart").descending());
        Page<Post> posts = postRepository.findByIsPublicTrueAndAddressContaining(address,pageable);
        List<Post> postList = posts.stream().toList();
        List<UserResponse.Simple> result = new ArrayList<>();
        for(Post post : postList){
            Long followSum = followRepository.countByToUserId(post.getUser().getId());
            boolean follow = followRepository.existsByFromUserAndToUser(savedUser,post.getUser());
            UserResponse.Simple simple;
                simple = UserResponse.Simple.of(post.getUser(),null,followSum, follow);
            result.add(simple);

        }
        return result;
    }

}
