package com.example.back.controller.response;

import com.example.back.entity.Follow;
import com.example.back.entity.Post;
import com.example.back.entity.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.time.format.DateTimeFormatter;
import java.util.List;

public class FollowResponse {
    @Data
    @Builder
    public static class ListDetail {
        private Long pk;
        private UserResponse.Simple to_user;

        public static FollowResponse.ListDetail of(Follow follow){
            return FollowResponse.ListDetail.builder()
                    .pk(follow.getPk())
                    .to_user(UserResponse.Simple.of(follow.getToUser()))
                    .build();
        }
        public static FollowResponse.ListDetail of(User user){
            return FollowResponse.ListDetail.builder()
                    .pk(null)
                    .to_user(UserResponse.Simple.of(user))
                    .build();
        }
    }

    @Data
    @Builder
    public static class FollowList {
        private List<FollowResponse.ListDetail> follows;
        private boolean last;
        private Long followSum;

        public static FollowResponse.FollowList of(Page<Follow> followPage){
            return FollowResponse.FollowList.builder()
                    .follows(followPage.getContent().stream().map(ListDetail::of).toList())
                    .last(followPage.isLast())
                    .build();
        }
        public static FollowResponse.FollowList of(Page<Follow> followPage, Long followSum){
            return FollowList.builder()
                    .follows(followPage.getContent().stream().map(ListDetail::of).toList())
                    .last(followPage.isLast())
                    .followSum(followSum)
                    .build();
        }
        public static FollowResponse.FollowList ofSearch(Page<User> userPage){
            return FollowResponse.FollowList.builder()
                    .follows(userPage.getContent().stream().map(ListDetail::of).toList())
                    .last(userPage.isLast())
                    .build();
        }

    }
    @Data
    @Builder
    public static class Reverse {
        private Long followSum;
        private boolean follow;

        public static FollowResponse.Reverse of(boolean follow, Long followSum){
            return Reverse.builder()
                    .follow(follow)
                    .followSum(followSum)
                    .build();
        }
    }


}
