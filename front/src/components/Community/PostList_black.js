import "../css/PostList_black.css"
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import { useState } from "react";
const PostList_black = ({title, tags, img_url,isHeart, goPost, comment, postPk,likesPk, commentSum, heartCount, goPostComment})=>{
    const [heartPk, setHeartPk] = useState(likesPk);
    const [heart, setHeart] = useState(isHeart);
    const [heartSum, setHeartSum] =useState(heartCount);
    const heartClickEvt = async () => {
        if (window.heartRequestInProgress) return;
        window.heartRequestInProgress = true;

        const send_data = {
            likesPk: heartPk,
            postPk: postPk
        };
        console.log(send_data)

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
        <div className="B_PostListBody">
            <div className="B_PostListInBody">
            <div className="PostListLeft">
            <div className="PostListTitle" onClick={goPost}>{title}</div>

        
            <div className="PostListtage">{tags}</div>

            <div className="PostListListIcon">
                {heart?<img src="/img/fullheart.png" alt="x" onClick={heartClickEvt}/>:<img src="/img/heart.png" alt="x" onClick={heartClickEvt}/>}
                <span style={{  transform: "translateY(-9px)", display: "inline-block", fontSize:"12px" }}>{heartSum}</span>
                {comment?<img src="/img/fullCommentimg.png" alt="x" onClick={goPostComment}/>:<img src="/img/chaticon.png" alt="x" onClick={goPostComment}/> }
                <span style={{  transform: "translateY(-9px)", display: "inline-block", fontSize:"12px" }}>{commentSum}</span>
            </div>
            </div>
            <div className="imgBox">
                <img src={(img_url===null) ||(img_url === "")? "/logo.png":img_url} alt="x" onClick={goPost}/>
            </div>
            </div>
            <hr className="PostPageLine" />
        </div>

    )
}
export default PostList_black;