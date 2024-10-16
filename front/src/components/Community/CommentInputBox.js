import { useRef, useEffect } from "react";
import "../css/CommentInputBox.css"
const CommentInputBox = ({img_url,writeEvt})=>{
    const commentRef = useRef(null);
    useEffect(() => {
        commentRef.current.value = ""; // 렌더링 시마다 commentRef의 값 초기화
    }, []);
    return(
        <div className="CommentInputBoxBody">
            <div className="CommentInputBoxInBody">
            <img className="CommentInputBoxUserImg" src={img_url === null ? "/p.jpg":img_url}/>
            <input type="text" ref={commentRef}/>
            <img  className="CommentInputBoxBtn" src="/img/sendComment.png" onClick={()=>writeEvt(commentRef)}/>
            </div>
        </div>
    )
}
export default CommentInputBox;