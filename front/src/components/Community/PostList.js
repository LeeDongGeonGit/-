import { useState } from "react";
import "../css/PostList.css"
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
const PostList = ({title, tags, img_url,isHeart, goPost, comment,  postPk,likesPk, commentSum, heartCount, goPostComment})=>{
    const [heartPk, setHeartPk] = useState(likesPk);
    const [heart, setHeart] = useState(isHeart);
    const [heartSum, setHeartSum] =useState(heartCount);
    const heartClickEvt = async () => {
        console.log("ff");
        if (window.heartRequestInProgress) return;
        window.heartRequestInProgress = true;
        console.log("ff");

        const send_data = {
            likesPk: heartPk,
            postPk: postPk
        };

        try {
            const response = await axios.post(`/likes`, send_data, {
                headers: { Authorization: $.cookie("cookie") }
            });
            console.log(response.data);

            if (response.data.heartPK === -1) {
                setHeartPk(null);
                setHeart(false);
                setHeartSum(response.data.countHeart)
            } else {
                setHeartPk(response.data.heartPK);
                setHeart(true);
                setHeartSum(response.data.countHeart)
            }
        } catch (error) {
            console.error("Error posting like:", error);
        }

        window.heartRequestInProgress = false;
    };
    return(
        <div className="PostListBody">
            <div className="PostListInBody">
            <div className="PostListLeft">
            <div className="PL_PostListTitle" onClick={goPost}>{title}</div>

        
            <div className="PL_PostListtage">{tags}</div>

            <div className="PostListListIcon">
                {heart?<img src="/img/fullheart.png" alt="x" onClick={heartClickEvt}/>:<img src="/img/heart.png" alt="x" onClick={heartClickEvt}/>}
                <span style={{  transform: "translateY(-9px)", display: "inline-block", fontSize:"12px" }}>{heartSum}</span>
                {comment?<img src="/img/fullCommentimg.png" alt="x" onClick={goPostComment}/>:<img src="/img/chaticon.png" alt="x" onClick={goPostComment}/> }
                <span style={{  transform: "translateY(-9px)", display: "inline-block", fontSize:"12px" }}>{commentSum}</span>
            </div>
            </div>
            <div className="imgBox">
                <img className="imgBox_IMG" src={(img_url===null) ||(img_url === "")? "/p.jpg":img_url} alt="x" onClick={goPost}/>
            </div>
            </div>
            <hr className="PPostListline"/>
        </div>

    )
}
export default PostList;