
import PostList from "../../components/Community/PostList";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "../css/FollowCss/NotFollowerLog.css";
import PostList_black from "../../components/Community/PostList_black";

export const NotFollowerLogPage=()=>{
    const navigate = useNavigate();
    const [postList,setPostList] = useState([{title:"제목1",tags:["태그1","태그2","태그3"],img_url:"/p.jpg"},
    {title:"제목2",tags:["태그1","태그2","태그3"],img_url:"/p.jpg"}, {title:"제목3",tags:["태그1","태그2","태그3"],img_url:"/p.jpg"}]);

    const followerMapClick= () =>{
        navigate("/FollowerMapPage");
    }

    return(
        <div className="NFLP_Main">
            <div className="NFLP_header">
                <Link to="/FollowerListPage"><img className="NFLP_X" src="/img/Vector.png"></img></Link>
                <h1 className="NFLP_friendlogo">Friend Log</h1>
            </div>
            <div className="NFLP_Mycontainer">
                <div className="NFLP_img"></div>
                <div className="NFLP_textcontainer">
                    <div className="NFLP_Mycontainer2">
                        <h2 className="NFLP_nameText">김철수</h2>
                        <button className="NFLP_followingbtn">팔로우</button>
                    </div>
                    <p>00명 팔로우</p>
                    <p>00개 게시물</p>
                </div>
            </div>
            <hr className="NFLP_hr"/>
            <div className="NFLP_postcontainer">
                <h2 className="NFLP_posth2">게시글</h2>
                <button className="NFLP_postbtn" onClick={followerMapClick}>
                    지도보기
                </button>
            </div>
            <div>
                {postList.map(post=>(
                    <PostList_black title={post.title} tags={post.tags} img_url={post.img_url} isHeart={false} goPost={null}/>
                ))}
            </div>
        </div>
    )
}

export default NotFollowerLogPage;