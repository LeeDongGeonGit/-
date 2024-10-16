import "../css/TopPostList.css"
const TopPostList = ({title, tags, img_url,isHeart, goPost, comment})=>{
    return(
        <div className="T_PostListBody" onClick={goPost}>
            <div className="T_PostListInBody">
                <div className="T_PostListLeft">
                    <div className="T_imgBox">
                        <img src={img_url===null? "/logo.png":img_url} alt="x"/>
                    </div>
                </div>
                <div className="T_PostListright">
                    <div className="T_PostListTitle">{title}</div>
                    <div className="T_PostListtags">{tags}</div>

                    <div className="T_PostListListIcon">
                        {isHeart?<img src="/img/fullheart.png" alt="x"/>:<img src="/img/heart.png" alt="x"/>}
                        
                        {comment?<img src="/img/chaticon.png" alt="x"/>:"" }
                    </div>
                </div>
            </div>
            <hr className="T_PostListline"/>
        </div>

    )
}
export default TopPostList;