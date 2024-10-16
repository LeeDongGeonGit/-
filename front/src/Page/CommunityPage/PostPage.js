import React, { useEffect, useState, useRef } from "react";
import "../css/CommunityCss/Post.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import CommentInputBox from "../../components/Community/CommentInputBox";
import { s3DeleteImg } from "../../components/AwsApi/AwsApi";
import $ from "jquery";
import {} from "jquery.cookie";
import CommentList from "../../components/Community/CommentList";

const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [postData, setPostData] = useState(null);
    const [heart, setHeart] = useState(null);
    const [follow, setFollow] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentPage, setCommentPage] = useState(2);
    const [commentLast, setCommentLast] = useState(true);
    const [countHeart, setCountHeart] = useState(null);
    const [tags, setTags] = useState(null);
    const [user123,setUser123] = useState(null);
    const location = useLocation();
    const isComment = location.state?.isComment;
    const scrollRef = useRef();
    useEffect(() => {
        const fetchData = async () => {
            await getPost();
            await getMyInfo();
            if (isComment !== undefined) {
                setTimeout(() => {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    console.log("밑으로 이동");
                }, 0);
            }
        };
        fetchData();
    }, []);
    const getMyInfo = async() =>{
        await axios.get(`/user/mypage`,{headers: {
            Authorization: $.cookie("cookie")}}).then(returnData=>{
              
                setUser123(returnData.data);
                console.log(returnData.data)
            })
    }

    const getPost = async () => {
        try {
            const response = await axios.get(`/post/detail/${id}`, {
                headers: { Authorization: $.cookie("cookie") }
            });
            console.log(response.data); // 서버로부터 받은 데이터 확인
            setPostData(response.data);
            setHeart(response.data.likesPk);
            setFollow(response.data.follow);
            setComments(response.data.commentList.comments);
            setCommentLast(response.data.commentList.last);
            setCountHeart(response.data.countHeart);
            if (response.data.tags) {
                const tags = response.data.tags.split('#').filter(Boolean); // # 기호로 분리하고 빈 문자열 제거
                setTags(tags);
                console.log(tags)
            }
        } catch (error) {
            console.error("Error fetching post data:", error);
        }
    };

    const heartClickEvt = async () => {
        if (window.heartRequestInProgress) return;
        window.heartRequestInProgress = true;

        const send_data = {
            likesPk: heart,
            postPk: postData.pk
        };

        try {
            const response = await axios.post(`/likes`, send_data, {
                headers: { Authorization: $.cookie("cookie") }
            });

            if (response.data.heartPK === -1) {
                setHeart(null);
            } else {
                setHeart(response.data.heartPK);
            }
            setCountHeart(response.data.countHeart);
        } catch (error) {
            console.error("Error posting like:", error);
        }

        window.heartRequestInProgress = false;
    };

    const backEvt = () => {
        navigate("/community");
    };

    const deletePost = async () => {
        if (window.confirm("정말로 삭제하겠습니까?")) {
            try {
                const response = await axios.delete(`/post/${postData.pk}`, {
                    headers: { Authorization: $.cookie("cookie") }
                });

                if (response.data) {
                    if (postData.img_url !== null) {
                        for(let i =0;i<postData.img_url.length; i++){
                            s3DeleteImg(postData.img_url[i].imgUrl, "post");
                        }
                    }
                    alert("삭제 완료");
                    navigate("/community");
                } else {
                    alert("오류 발생");
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("오류 발생");
            }
        }
    };

    const reverseFollow = async () => {
        if (window.heartRequestInProgress) return;
        window.heartRequestInProgress1 = true;

        try {
            const response = await axios.put(`/follow/reverse/${postData.user.pk}`, "", {
                headers: { Authorization: $.cookie("cookie") }
            });
            setFollow(response.data.follow);
            console.log(response.data);
        } catch (error) {
            console.error("Error reversing follow:", error);
        }

        window.heartRequestInProgress1 = false;
    };

    const getComment = async () => {
        try {
            const response = await axios.get(`/comment/${postData.pk}/${commentPage}`, {
                headers: { Authorization: $.cookie("cookie") }
            });
            setCommentLast(response.data.last);
            setComments((prevComments) => [...prevComments, ...response.data.comments]);
            setCommentPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const getCommentFirst = async () => {
        try {
            const response = await axios.get(`/comment/${postData.pk}/1`, {
                headers: { Authorization: $.cookie("cookie") }
            });
            setCommentLast(response.data.last);
            setComments(response.data.comments);
            setCommentPage(2);
        } catch (error) {
            console.error("Error fetching first page of comments:", error);
        }
    };

    const deleteComment = async (comment_pk) => {
        if (window.confirm("정말로 삭제하겠습니까?")) {
            try {
                await axios.delete(`/comment/${comment_pk}`, "", {
                    headers: { Authorization: $.cookie("cookie") }
                });
                getCommentFirst();
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    const writeComment = async (content) => {
        const send_data = {
            post_pk: postData.pk,
            content: content.current.value
        };
        try {
            await axios.post(`/comment`, send_data, {
                headers: { Authorization: $.cookie("cookie") }
            });
            getCommentFirst();
            content.current.value = "";
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const editClickEvt = () => {
        navigate("/postUp", { state: { postData: postData } });
    };

    const goUserInfo = () => {
        navigate(`/FollowerLogPage/${postData.user.pk}`);
    };

    const goMyInfo = () => {
        navigate(`/MyLogPage`);
    };
    const search = (tag)=>{
        navigate(`/search/?query=${tag}`);
    }  

    const goToMap = () => {
        navigate("/MapPage", { state: { coords: { lat: postData.y_coordinate, lng: postData.x_coordinate }, post: postData } });
    };

    if (postData === null || user123 === null) {
        return <div>loading</div>;
    }

    return (
        <div className="PostPageBody" ref={scrollRef}>
            <div className="PostPageHeader">
                <div onClick={backEvt}><img className="PostPage_X" src="/img/Vector.png" alt="close" /></div>
                <div className="PostUpPageHeaderRight">
                    {postData.me ? 
                    <div>
                        <img className="editBtn" src="/img/editBtn.png" alt="edit" onClick={editClickEvt} />
                        <img className="deleteBtn" src="/img/deleteBtn.png" alt="delete" onClick={deletePost} />
                    </div> : ""}
                </div>
            </div>
            <div className="PostPagePostInfo">
                <div className="PostPagePostTitle">{postData.title}</div>
            </div>
            <div className="PostPageUserInfo">
                <div className="PostPageUserImg">
                    <img src={postData.user.img_url === null ? "/p.jpg" : postData.user.img_url} alt="user" />
                </div>
                <div className="PostPageUserInfoRBox" onClick={postData.me ? goMyInfo : goUserInfo}>
                    <div className="PostPageUserInfoRName">{postData.user.name}</div>
                    <div className="PostPageUserInfoRDay">{new Date(postData.created_at).toLocaleDateString()}</div>
                </div>
                <div className="PostPageUserInfoBBox">
                    {postData.me ? "" : <button className={follow ? "PostPageUserInfoOn" : "PostPageUserInfoOff"} onClick={reverseFollow}>{follow ? "팔로잉" : "팔로우"}</button>}
                </div>
            </div>
            <hr className="PostPageLine" />
            <div className="PostPageMapBtn" onClick={goToMap}>
                <img src="/img/writeMapBtn.png" alt="map" />
                <span>위치</span>
                <div>{postData.address}</div>
            </div>
            <div className="PostPagePostImg">
                {(postData.img_url.length === 0) || (postData.img_url === "") ? "" : postData.img_url.map(url=>(<img src={url.imgUrl} alt="post" />))}
            </div>
            <div className="PostPagePostContent">
                {postData.content.split('\n').map((line, index) => (
                    <span key={index}>
                        {line}
                        <br />
                    </span>
                ))}
            </div>
            <div className="PostPagePostTags">
                {tags!== null?tags.map(tag=>(<span onClick={()=>search(tag)}>#{tag}</span>)):""}
            </div>
            <div className="PostPagePostHeart">
                <img src={heart !== null ? "/img/fullheart.png" : "/img/heart.png"} onClick={heartClickEvt} alt="heart" />
                <div className="PostPagePostHeartCount">{countHeart}</div>
            </div>
            
            <CommentInputBox img_url={user123.img_url} writeEvt={writeComment} />
            <hr/>
            <h2 className="PostPageComment">댓글</h2>
            <div>
                {comments.map(comment=>(
                <CommentList content={comment.content} img_url={comment.user.img_url} name={comment.user.name} me={comment.me} deleteEvt={()=>deleteComment(comment.pk)}/>))}
            </div>   
            {commentLast?<div className="communityPageLoading"></div>:
                <div className="communityPageLoading" onClick={getComment}>
                    <img className="communityPageLoading" src="/img/downarrow.png"/>
                </div>}
        </div>
    );
};

export default PostPage;