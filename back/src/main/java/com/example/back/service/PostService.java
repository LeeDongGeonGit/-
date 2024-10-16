package com.example.back.service;

import com.example.back.controller.request.PostRequest;
import com.example.back.controller.response.CommentResponse;
import com.example.back.controller.response.PostResponse;
import com.example.back.entity.*;
import com.example.back.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class PostService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final LikesRepository likesRepository;
    private final FollowRepository followRepository;
    private final CommentRepository commentRepository;
    private final PostImgRepository postImgRepository;

    public boolean postUp(PostRequest.Create create){
        try {
            String id = SecurityContextHolder.getContext().getAuthentication().getName();
            User writedUser = userRepository.findById(id).get();
            System.out.println(create);


            Post newPost = Post.builder()
                    .title(create.getTitle())
                    .isPublic(create.getIsPublic() == "true")
                    .content(create.getContent())
                    .x_coordinate(create.getX_coordinate())
                    .y_coordinate(create.getY_coordinate())
                    .address(create.getAddress())
                    .tags(create.getTags())
                    .user(writedUser)
                    .build();
            Post post = postRepository.save(newPost);
            for (int i=0;i<create.getImg_url().length; i++){
                PostImg postImg = PostImg.builder()
                        .imgUrl(create.getImg_url()[i])
                        .post(post)
                        .build();
                postImgRepository.save(postImg);
            }
            return true;
        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    public boolean postUp1(PostRequest.Create1 create){
        try {
            User writedUser = userRepository.findById(create.getUser()).get();


            Post newPost = Post.builder()
                    .title(create.getTitle())
                    .isPublic(create.getIsPublic() == "true")
                    .content(create.getContent())
                    .x_coordinate(create.getX_coordinate())
                    .y_coordinate(create.getY_coordinate())
                    .address(create.getAddress())
                    .tags(create.getTags())
                    .user(writedUser)
                    .build();
            Post post = postRepository.save(newPost);
            for (int i=0;i<create.getImg_url().length; i++){
                PostImg postImg = PostImg.builder()
                        .imgUrl(create.getImg_url()[i])
                        .post(post)
                        .build();
                postImgRepository.save(postImg);
            }
            return true;
        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    public boolean putPost(PostRequest.Create create, Long id){
        try{
            Post post = postRepository.findById(id).orElseThrow();
            post.setTags(create.getTags());
            post.setPublic(create.getIsPublic() == "true");
            post.setTitle(create.getTitle());
            post.setContent(create.getContent());
            post.setX_coordinate(create.getX_coordinate());
            post.setY_coordinate(create.getY_coordinate());
            post.setAddress(create.getAddress());
            Post post1 = postRepository.save(post);
            long postPK = post1.getPk();
            postImgRepository.deleteAll(postImgRepository.findByPostPk(postPK));
            for (int i=0;i<create.getImg_url().length; i++){
                PostImg postImg = PostImg.builder()
                        .imgUrl(create.getImg_url()[i])
                        .post(post1)
                        .build();
                postImgRepository.save(postImg);
            }
            return true;

        }catch (Exception e){
            e.printStackTrace();
            return false;
        }

    }
    public boolean deletePost(long id){
        try{
            postImgRepository.deleteAll(postImgRepository.findByPostPk(id));
            postRepository.deleteById(id);
            return true;
        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    public PostResponse.Detail getPost(Long id){
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findById(userId).get();
        Post post = postRepository.findById(id).get();
        boolean follow = followRepository.existsByFromUserAndToUser(user, post.getUser());
        boolean me = post.getUser().getPk() == user.getPk();
        Optional<Likes> likesOptional = likesRepository.findByUserAndPost(user,post);
        PageRequest commentPageRequest = PageRequest.of(0, 10,  Sort.by("createdAt").descending()) ;
        Page<Comment> commentPage = commentRepository.findByPost(post,commentPageRequest);
        List<PostImg> postImgs = postImgRepository.findByPostPk(id);
        if(likesOptional.isPresent()){
            return PostResponse.Detail.of(post,true,likesOptional.get().getPk(),me,follow,CommentResponse.CommentList.of(commentPage,userId),postImgs);
        }
        else {
            return PostResponse.Detail.of(post,false,null,me,follow,CommentResponse.CommentList.of(commentPage,userId),postImgs);
        }
    }
    public PostResponse.PostList getPostList(int page){
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        User savedUser = userRepository.findById(id).get();
        PageRequest pageable = PageRequest.of(page-1,10, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByIsPublicTrue(pageable);
        List<Post> postList = posts.stream().toList();
        List<PostResponse.ListDetail> result = new ArrayList<>();
        for(Post post : postList){
            Optional<Likes> likesOptional = likesRepository.findByUserAndPost(savedUser,post);
            PostResponse.ListDetail listDetail;
            boolean comment = commentRepository.existsByPost(post);
            List<PostImg> postImgs = postImgRepository.findByPostPk(post.getPk());
            long commentCount = commentRepository.countAllByPost(post);
            if(likesOptional.isPresent()){
                listDetail = PostResponse.ListDetail.of(post,true,likesOptional.get().getPk(),comment,postImgs, commentCount);
            }
            else {
                listDetail = PostResponse.ListDetail.of(post,false,null, comment,postImgs, commentCount);
            }
            result.add(listDetail);

        }
        return PostResponse.PostList.of(result,posts.isLast());
    }
    public PostResponse.PostList getUserPostList(int page){
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        User savedUser = userRepository.findById(id).get();
        PageRequest pageable = PageRequest.of(page-1,10, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByUser(savedUser,pageable);
        List<Post> postList = posts.stream().toList();
        List<PostResponse.ListDetail> result = new ArrayList<>();
        for(Post post : postList){
            Optional<Likes> likesOptional = likesRepository.findByUserAndPost(savedUser,post);
            PostResponse.ListDetail listDetail;
            boolean comment = commentRepository.existsByPost(post);
            List<PostImg> postImgs = postImgRepository.findByPostPk(post.getPk());
            long commentCount = commentRepository.countAllByPost(post);
            if(likesOptional.isPresent()){
                listDetail = PostResponse.ListDetail.of(post,true,likesOptional.get().getPk(),comment,postImgs, commentCount);
            }
            else {
                listDetail = PostResponse.ListDetail.of(post,false,null,comment,postImgs, commentCount);
            }
            result.add(listDetail);

        }
        return PostResponse.PostList.of(result,posts.isLast());
    }
    public PostResponse.PostList getOtherUserPostList(int page, Long user_id){
        User savedUser = userRepository.findById(user_id).get();
        String meId = SecurityContextHolder.getContext().getAuthentication().getName();
        User me = userRepository.findById(meId).get();
        PageRequest pageable = PageRequest.of(page-1,10, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByIsPublicTrueAndUser(savedUser,pageable);
        List<Post> postList = posts.stream().toList();
        List<PostResponse.ListDetail> result = new ArrayList<>();
        for(Post post : postList){
            Optional<Likes> likesOptional = likesRepository.findByUserAndPost(me,post);
            PostResponse.ListDetail listDetail;
            boolean comment = commentRepository.existsByPost(post);
            List<PostImg> postImgs = postImgRepository.findByPostPk(post.getPk());
            long commentCount = commentRepository.countAllByPost(post);
            if(likesOptional.isPresent()){
                listDetail = PostResponse.ListDetail.of(post,true,likesOptional.get().getPk(),comment,postImgs, commentCount);
            }
            else {
                listDetail = PostResponse.ListDetail.of(post,false,null,comment,postImgs, commentCount);
            }
            result.add(listDetail);

        }
        return PostResponse.PostList.of(result,posts.isLast());
    }

    public PostResponse.PostList getPostListSearch(int page, String query){
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        User savedUser = userRepository.findById(id).get();
        PageRequest pageable = PageRequest.of(page-1,10, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByIsPublicTrueAndTagsContainingOrTitleContainingOrContentContaining(query,query,query,pageable);
        List<Post> postList = posts.stream().toList();
        List<PostResponse.ListDetail> result = new ArrayList<>();
        for(Post post : postList){
            Optional<Likes> likesOptional = likesRepository.findByUserAndPost(savedUser,post);
            PostResponse.ListDetail listDetail;
            boolean comment = commentRepository.existsByPost(post);
            List<PostImg> postImgs = postImgRepository.findByPostPk(post.getPk());
            long commentCount = commentRepository.countAllByPost(post);
            if(likesOptional.isPresent()){
                listDetail = PostResponse.ListDetail.of(post,true,likesOptional.get().getPk(),comment,postImgs, commentCount);
            }
            else {
                listDetail = PostResponse.ListDetail.of(post,false,null,comment,postImgs, commentCount);
            }
            result.add(listDetail);

        }
        return PostResponse.PostList.of(result,posts.isLast());
    }
    public PostResponse.PostList getMapPostList(){
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        User savedUser = userRepository.findById(id).get();
        PageRequest pageable = PageRequest.of(0,249, Sort.by("countHeart").descending());
        Page<Post> posts = postRepository.findByIsPublicTrue(pageable);
        List<Post> postList = posts.stream().toList();
        List<PostResponse.ListDetail> result = new ArrayList<>();
        for(Post post : postList){
            Optional<Likes> likesOptional = likesRepository.findByUserAndPost(savedUser,post);
            PostResponse.ListDetail listDetail;
            boolean comment = commentRepository.existsByPost(post);
            List<PostImg> postImgs = postImgRepository.findByPostPk(post.getPk());
            long commentCount = commentRepository.countAllByPost(post);
            if(likesOptional.isPresent()){
                listDetail = PostResponse.ListDetail.ofMap(post,true,likesOptional.get().getPk(),comment,postImgs, commentCount);
            }
            else {
                listDetail = PostResponse.ListDetail.ofMap(post,false,null,comment,postImgs, commentCount);
            }
            result.add(listDetail);

        }
        return PostResponse.PostList.of(result,posts.isLast());
    }
    public PostResponse.PostList getMyMapPostList(){
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        User savedUser = userRepository.findById(id).get();
        List<Post> postList = postRepository.findByUser(savedUser);
        List<PostResponse.ListDetail> result = new ArrayList<>();
        for(Post post : postList){
            Optional<Likes> likesOptional = likesRepository.findByUserAndPost(savedUser,post);
            PostResponse.ListDetail listDetail;
            boolean comment = commentRepository.existsByPost(post);
            List<PostImg> postImgs = postImgRepository.findByPostPk(post.getPk());
            long commentCount = commentRepository.countAllByPost(post);
            if(likesOptional.isPresent()){
                listDetail = PostResponse.ListDetail.ofMap(post,true,likesOptional.get().getPk(),comment,postImgs, commentCount);
            }
            else {
                listDetail = PostResponse.ListDetail.ofMap(post,false,null,comment, postImgs, commentCount);
            }
            result.add(listDetail);

        }
        return PostResponse.PostList.of(result,true);
    }
    public PostResponse.PostList getOtherMapPostList(Long otherId){
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        User savedUser = userRepository.findById(id).get();
        User otherUser = userRepository.findById(otherId).get();
        List<Post> postList = postRepository.findByUser(otherUser);
        List<PostResponse.ListDetail> result = new ArrayList<>();
        for(Post post : postList){
            Optional<Likes> likesOptional = likesRepository.findByUserAndPost(savedUser,post);
            PostResponse.ListDetail listDetail;
            boolean comment = commentRepository.existsByPost(post);
            List<PostImg> postImgs = postImgRepository.findByPostPk(post.getPk());
            long commentCount = commentRepository.countAllByPost(post);
            if(likesOptional.isPresent()){
                listDetail = PostResponse.ListDetail.ofMap(post,true,likesOptional.get().getPk(),comment,postImgs, commentCount);
            }
            else {
                listDetail = PostResponse.ListDetail.ofMap(post,false,null,comment, postImgs, commentCount);
            }
            result.add(listDetail);

        }
        return PostResponse.PostList.of(result,true);
    }
    public PostResponse.PostList getPostListMap(int page){
        String id = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(id);
        User savedUser = userRepository.findById(id).get();
        String[] parts = savedUser.getAddress().split(" ");
        String address = parts[0] + " " + parts[1]; // 첫 두 부분을 공백으로 연결하여 반환
        PageRequest pageable = PageRequest.of(page-1,10, Sort.by("createdAt").descending());

        Page<Post> posts = postRepository.findByIsPublicTrueAndAddressContaining(address,pageable);
        List<Post> postList = posts.stream().toList();
        List<PostResponse.ListDetail> result = new ArrayList<>();
        for(Post post : postList){
            Optional<Likes> likesOptional = likesRepository.findByUserAndPost(savedUser,post);
            PostResponse.ListDetail listDetail;
            boolean comment = commentRepository.existsByPost(post);
            List<PostImg> postImgs = postImgRepository.findByPostPk(post.getPk());
            long commentCount = commentRepository.countAllByPost(post);
            if(likesOptional.isPresent()){
                listDetail = PostResponse.ListDetail.of(post,true,likesOptional.get().getPk(),comment, postImgs, commentCount);
            }
            else {
                listDetail = PostResponse.ListDetail.of(post,false,null,comment, postImgs, commentCount);
            }
            result.add(listDetail);

        }
        return PostResponse.PostList.of(result,posts.isLast(),address);
    }


}
