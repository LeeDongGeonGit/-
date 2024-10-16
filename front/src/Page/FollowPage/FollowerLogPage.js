
import PostList from "../../components/Community/PostList";
import { useState, useEffect } from "react";
import "../css/FollowCss/FollowerLog.css";
import {useNavigate,useParams,Link } from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";
import axios from "axios";
import PostList_black from "../../components/Community/PostList_black";

export const FollowerLogPage=()=>{
    const {id} = useParams();
    const [postList,setPostList] = useState([]);
    const [userInfo, setUserInfo] =useState(null);
    const [follow,setFollow] = useState(null);
    const [last, setLast] = useState(null);
    const [followSum, setFollowSum] = useState(null);
    const navigate = useNavigate();
    const [scrollNum,setScrollNum] = useState(1);

    useEffect(() => {
        getMyInfo();
        getLatestPostList();
    }, []);


    const getMyInfo = async() =>{
        await axios.get(`/user/userInfo/${id}`,{headers: {
            Authorization: $.cookie("cookie")}}).then(returnData=>{
                setUserInfo(returnData.data);
                setFollow(returnData.data.follow);
                setFollowSum(returnData.data.followSum);
                console.log(returnData.data)
            })
    }
    const getLatestPostList= async()=>{
        await axios.get(`/post/userInfo/${id}/${scrollNum}`,{headers: {
            Authorization: $.cookie("cookie")}}).then(
            response=>{
                setPostList(prevPost=>[...prevPost,...response.data.posts]);
                setLast(response.data.last);
                setScrollNum(prevScrollNum => prevScrollNum + 1);
                console.log(response.data);
            }
        )}
        const goPost = (postid)=>{
            navigate(`/post/${postid}`);
        } 
        const reverseFollow =async()=>{
            if (window.heartRequestInProgress) return;
            window.heartRequestInProgress = true;
            await axios.put(`/follow/reverse/${id}`,"",{headers: {
                Authorization: $.cookie("cookie")}}).then(
                response=>{
                    setFollow(response.data.follow);
                    setFollowSum(response.data.followSum);
                   window.heartRequestInProgress = false;
                }
            )
          }
          const backEvt = ()=>{
            navigate(-1);
          }
        if(postList ===null || userInfo === null || follow === null){
            return <div>loading.....</div>
        }

        const followerMapClick= () =>{
            navigate(`/FollowerMapPage/${id}`);
        }
        const goPostComment = (id)=>{
            navigate(`/post/${id}`,{state:{isComment : true}});
        } 

    return(
        <div className="FLP_Main">
            <div className="FLP_header">
              <img className="FLP_X" src="/img/Vector.png" onClick={backEvt}/>
                <h1 className="FLP_friendlogo">Friend Log</h1>
            </div>
            <div className="FLP_Mycontainer">
                <div className="FLP_img">
                <img src = {userInfo.img_url === null ? "/p.jpg" :userInfo.img_url} alt="x"/>


                </div>
                <div className="FLP_textcontainer">
                    <div className="FLP_Mycontainer2">
                        <h2 className="FLP_nameText">{userInfo.name}</h2>
                         <button className={follow?"FLP_followingbtnOn":"FLP_followingbtnOff"} onClick={reverseFollow}>{follow?"팔로잉":"팔로우"}</button>
                    </div>
                    <p>{followSum} 팔로워</p>
                    <p>{userInfo.postSum} 게시물</p>
                </div>
            </div>
            <hr className="FLP_hr"/>
            <div className="FLP_postcontainer">
                <h2 className="FLP_posth2">게시글</h2>
                <button className="FLP_postbtn" onClick={followerMapClick}>지도보기</button>
            </div>
            <div>
                {postList.map(post=>(
                    <PostList_black 
                    key={post.pk} 
                            title={post.title} 
                            tags={post.tags !== null ? post.tags
                                .split(' ')
                                .filter(tag => tag.trim() !== '') // 공백 태그 제거
                                .map(tag => tag.startsWith('#') ? tag : `#${tag}`) // 태그 앞에 # 추가
                                .join(' ')
                                .trim() : ""}
                            img_url={post.img_url.length === 0 ? null : post.img_url[0].imgUrl} 
                            comment={post.comment} 
                            isHeart={post.heart} 
                            goPost={() => goPost(post.pk)} 
                            postPk={post.pk} 
                            likesPk={post.likes_pk}
                            commentSum={post.commentSum}
                            heartCount={post.heartSum}
                            goPostComment={()=>goPostComment(post.pk)}
                    />
                ))}
                {last?<div className="communityPageLoading"></div>:
                <div className="communityPageLoading" onClick={getLatestPostList}>
                    <img className="communityPageLoading" src="/img/downarrow.png"/>
                </div>}
            </div>
        </div>
    )
}

export default FollowerLogPage;