
import PostList from "../../components/Community/PostList";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/MyCss/MyLog.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";
import PostList_black from "../../components/Community/PostList_black";
import MainBtn from "../../components/MainBtn/MainBtn";
export const MyLogPage=()=>{
    const [postList,setPostList] = useState([]);
    const [userInfo, setUserInfo] =useState(null);
    const [last, setLast] = useState(null);
    const navigate = useNavigate();
    const [scrollNum,setScrollNum] = useState(1);

    useEffect(() => {
        getMyInfo();
        getLatestPostList();
    }, []);


    const getMyInfo = async() =>{
        await axios.get(`/user/mypage`,{headers: {
            Authorization: $.cookie("cookie")}}).then(returnData=>{
              
                setUserInfo(returnData.data);
                console.log(returnData.data)
            })
    }
    const getLatestPostList= async()=>{
        await axios.get(`/post/userList/${scrollNum}`,{headers: {
            Authorization: $.cookie("cookie")}}).then(
            response=>{
                setPostList(prevPost=>[...prevPost,...response.data.posts]);
                setLast(response.data.last);
                setScrollNum(prevScrollNum => prevScrollNum + 1);
                console.log(response.data.posts);
            }
        )}
        const goPost = (postid)=>{
            navigate(`/post/${postid}`);
        } 
        const backEvt = ()=>{
            navigate("/MainPage");
          }
          const goPostComment = (id)=>{
            navigate(`/post/${id}`,{state:{isComment : true}});
        } 
        if(postList ===null || userInfo === null){
            return <div>loading.....</div>
        }

    return(
        <div className="ML_Main">
            <div className="ML_header">
                <img className="ML_X" src="/img/Vector.png" onClick={backEvt}></img>
                <h1 className="ML_mylogo">My Log</h1>
                <Link to="/MemberImformationPage"><img className="ML_SetUp" src="/img/SetUp.png"></img></Link>
            </div>
            <div className="ML_Mycontainer">
                <div className="ML_img">
                <img className="ML_MyImg" src = {userInfo.img_url === null ? "/p.jpg" :userInfo.img_url} alt="x"/>

                </div>
                <div className="ML_textcontainer">
                    <h2 className="ML_nameText">{userInfo.name}</h2>
                    <div className="ML_Followcontainer">
                        <Link to="/FollowerListPage" className="ML_TextP"><p>{userInfo.followSum} 팔로워</p></Link>
                    </div>
                    <p>{userInfo.postSum} 게시글</p>
                </div>
            </div>
            <hr className="ML_hr"/>
            <div className="ML_postcontainer">
                <h2 className="ML_posth2">게시글</h2>
                <Link to="/MyMapPage"><button className="ML_postbtn">지도보기</button></Link>
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
            <MainBtn initialBtnNum={4} className="M_MainBtn" />
        </div>
    )
}

export default MyLogPage;