package com.example.back.controller.response;

import com.example.back.entity.Post;
import com.example.back.entity.PostImg;
import com.example.back.entity.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.time.format.DateTimeFormatter;
import java.util.List;

public class PostResponse {
    @Data
    @Builder
    public static class Detail {
        private long pk;
        private String title;
        private String content;
        private boolean isPublic;
        private double x_coordinate;
        private double y_coordinate;
        private List<PostImgResponse.Simple> img_url;
        private String tags;
        private String address;
        private String created_at;
        private Long likesPk;
        private boolean isHeart;
        private boolean me;
        private UserResponse.Detail user;
        private boolean follow;
        private long countHeart;
        private CommentResponse.CommentList commentList;

        public static PostResponse.Detail of(Post post, boolean isHeart, Long likesPk, boolean me, boolean follow, CommentResponse.CommentList commentList, List<PostImg> img_url){
            return Detail.builder()
                    .pk(post.getPk())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .isPublic(post.isPublic())
                    .x_coordinate(post.getX_coordinate())
                    .y_coordinate(post.getY_coordinate())
                    .img_url(img_url.stream().map(PostImgResponse.Simple::of).toList())
                    .tags(post.getTags())
                    .address(post.getAddress())
                    .created_at(post.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                    .isHeart(isHeart)
                    .likesPk(likesPk)
                    .me(me)
                    .user(UserResponse.Detail.of(post.getUser()))
                    .follow(follow)
                    .commentList(commentList)
                    .countHeart(post.getCountHeart())
                    .build();
        }
    }
    @Data
    @Builder
    public static class ListDetail {
        private Long pk;
        private String title;
        private String tags;
        private List<PostImgResponse.Simple> img_url;
        private Long likes_pk;
        private boolean isHeart;
        private boolean comment;
        private Long heartSum;
        private Long commentSum;
        private double x_coordinate;
        private double y_coordinate;
        private UserResponse.Simple user;
        public static PostResponse.ListDetail ofMap(Post post, boolean is_heart, Long likes_pk,  boolean comment,  List<PostImg> img_url, Long commentSum){
            return ListDetail.builder()
                    .pk(post.getPk())
                    .title(post.getTitle())
                    .img_url(img_url.stream().map(PostImgResponse.Simple::of).toList())
                    .tags(post.getTags())
                    .isHeart(is_heart)
                    .likes_pk(likes_pk)
                    .comment(comment)
                    .user(UserResponse.Simple.of(post.getUser()))
                    .x_coordinate(post.getX_coordinate())
                    .y_coordinate(post.getY_coordinate())
                    .commentSum(commentSum)
                    .heartSum(post.getCountHeart())
                    .build();
        }

        public static PostResponse.ListDetail of(Post post, boolean is_heart, Long likes_pk, List<PostImg> img_url, Long commentSum){
            return ListDetail.builder()
                    .pk(post.getPk())
                    .title(post.getTitle())
                    .img_url(img_url.stream().map(PostImgResponse.Simple::of).toList())
                    .tags(post.getTags())
                    .isHeart(is_heart)
                    .likes_pk(likes_pk)
                    .commentSum(commentSum)
                    .heartSum(post.getCountHeart())
                    .build();
        }
        public static PostResponse.ListDetail of(Post post, boolean is_heart, Long likes_pk, boolean comment,  List<PostImg> img_url, Long commentSum){
            return ListDetail.builder()
                    .pk(post.getPk())
                    .title(post.getTitle())
                    .img_url(img_url.stream().map(PostImgResponse.Simple::of).toList())
                    .tags(post.getTags())
                    .isHeart(is_heart)
                    .likes_pk(likes_pk)
                    .comment(comment)
                    .commentSum(commentSum)
                    .heartSum(post.getCountHeart())
                    .build();
        }
    }
    @Data
    @Builder
    public static class PostList {
        private List<PostResponse.ListDetail> posts;
        private String address;
        private boolean last;

        public static PostResponse.PostList of(List<PostResponse.ListDetail> posts,boolean last){
            return PostList.builder()
                    .posts(posts)
                    .last(last)
                    .build();
        }
        public static PostResponse.PostList of(List<PostResponse.ListDetail> posts,boolean last, String address){
            return PostList.builder()
                    .posts(posts)
                    .last(last)
                    .address(address)
                    .build();
        }
    }


}
