
import PostList from "../../components/Community/PostList";
import { useState, useEffect } from "react";
import "../css/FollowCss/FollowerLog.css";
import "../css/FollowCss/FollowerLogOne.css";
import {useNavigate,useParams,Link } from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";
import axios from "axios";

export const FollowerLogOnePage=()=>{
    const {id} = useParams();
    const [postList,setPostList] = useState([]);
    const [userInfo, setUserInfo] =useState(null);
    const [follow,setFollow] = useState(null);
    const [last, setLast] = useState(null);
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
                setFollow(returnData.follow);
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
            await axios.put(`/follow/reverse/${id}`,"",{headers: {
                Authorization: $.cookie("cookie")}}).then(
                response=>{
                    setFollow(response.data);
                    setTimeout(() => {
                    }, 1000); // 예: 5초
                   
                }
            )
          }
          const backEvt = ()=>{
            navigate(-1);
          }
        if(postList ===null || userInfo === null){
            return <div>loading.....</div>
        }

    return(
        <div className="FLP_Main">
            <div className="FLP_header">
              <img className="FLP_X" src="/img/Vector.png" onClick={backEvt}/>
                <h1 className="FLOP_friendlogo">우리동네대장</h1>
                <img  className="FLOP_friendlogoCrown" src="/img/OneCrown.png"/>
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
                    <p>{userInfo.followSum}명 팔로우</p>
                    <p>{userInfo.postSum}개 게시물</p>
                </div>
            </div>
            <hr className="FLP_hr"/>
            <div className="FLP_postcontainer">
                <h2 className="FLP_posth2">게시글</h2>
                <button className="FLP_postbtn">
                    지도보기
                </button>
            </div>
            <div>
                {postList.map(post=>(
                    <PostList title={post.title} tags={post.tags} comment={post.comment} img_url={post.img_url} isHeart={post.heart} goPost={()=>goPost(post.pk)}/>
                ))}
                {last?<div className="communityPageLoading">end</div>:
                <div className="communityPageLoading" onClick={getLatestPostList}>더 보기</div>}
            </div>
        </div>
    )
}

export default FollowerLogOnePage;