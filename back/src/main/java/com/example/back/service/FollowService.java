package com.example.back.service;

import com.example.back.controller.response.FollowResponse;
import com.example.back.entity.Follow;
import com.example.back.entity.User;
import com.example.back.repository.FollowRepository;
import com.example.back.repository.PostRepository;
import com.example.back.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public boolean addFollow(Long toUserId){
        try{
            String fromUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            User fromUser = userRepository.findById(fromUserId).get();
            User toUser = userRepository.findById(toUserId).get();
            Follow newFollow = Follow.builder()
                    .fromUser(fromUser)
                    .toUser(toUser)
                    .build();
            followRepository.save(newFollow);
            Long count = toUser.getCountFollow();
            toUser.setCountFollow(count+1);
            userRepository.save(toUser);
            return true;

        }
        catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    public FollowResponse.Reverse reversFollow(Long toUserId){
        try{
            User toUser = userRepository.findById(toUserId).get();
            String fromUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            User fromUser = userRepository.findById(fromUserId).get();
            Optional<Follow> optionalFollow =  followRepository.findByFromUserAndToUser(fromUser,toUser);
            if(optionalFollow.isPresent()){
                followRepository.delete(optionalFollow.get());
                long followSum = followRepository.countByToUserId(toUser.getId());
                toUser.setCountFollow(toUser.getCountFollow()-1);
                userRepository.save(toUser);
                return FollowResponse.Reverse.of(false,followSum);
            }
            else {
                Follow follow = Follow.builder()
                        .fromUser(fromUser)
                        .toUser(toUser)
                        .build();
                followRepository.save(follow);
                long followSum = followRepository.countByToUserId(toUser.getId());
                toUser.setCountFollow(toUser.getCountFollow()+1);
                userRepository.save(toUser);
                return FollowResponse.Reverse.of(true,followSum);
            }
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
    public FollowResponse.FollowList getList(int page){
        try {
            String fromUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            User fromUser = userRepository.findById(fromUserId).get();
            PageRequest pageRequest = PageRequest.of(page-1,10, Sort.by("createdAt").descending());
            Page<Follow> followPage = followRepository.findByFromUser(fromUser,pageRequest);
            Long followSum = followRepository.countByFromUserId(fromUserId);
            return FollowResponse.FollowList.of(followPage,followSum);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
    public FollowResponse.FollowList getSearchList(int page, String query){
        try {
            String fromUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            User fromUser = userRepository.findById(fromUserId).get();
            PageRequest pageRequest = PageRequest.of(page-1,10, Sort.by("createdAt").descending());
            Page<Follow> follows = followRepository.findByFromUser(fromUser, Pageable.unpaged());
            Set<Long> excludedUserPks = follows.getContent().stream()
                    .map(follow -> follow.getToUser().getPk())
                    .collect(Collectors.toSet());
            excludedUserPks.add(fromUser.getPk());
            Page<User> followPage = userRepository.findByNameContainingAndPkNotInAndIsLeaveFalse(query,excludedUserPks,pageRequest);
            return FollowResponse.FollowList.ofSearch(followPage);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public Boolean deleteFollow(Long followId){
        try{
            String fromUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            Follow follow = followRepository.findById(followId).get();
            if(fromUserId.equals(follow.getFromUser().getId())){
                return false;
            }
            else {
                User user = follow.getToUser();
                Long count = user.getCountFollow();
                user.setCountFollow(count-1);
                userRepository.save(user);
                followRepository.deleteById(followId);
                return true;
            }

        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    public FollowResponse.FollowList getRankList(){
        try {
            PageRequest pageRequest = PageRequest.of(0,4,Sort.by("countFollow").descending());
            Page<User> userPage = userRepository.findAll(pageRequest);
            return FollowResponse.FollowList.ofSearch(userPage);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }



}
