import "../css/CommentList.css"
const CommentList = ({img_url,content,name,deleteEvt,me}) =>{
    return(
        <div>
            <div className="CommentListBody">
                <div className="CommentListImgBox">
                    <img src={img_url===null?"/p.jpg":img_url}/>
                </div>
                <div className="CommentListDataBox">
                    <div className="CommentListName">
                        {name}
                    </div>
                    <div className="CommentListContent">
                        {content}
                    </div>
                </div>
                <div className="CommentListDeleteBox">
                    {me?<img src="/img/deleteBtn.png" onClick={()=>deleteEvt()} alt="x"/>:""}
                </div>
            </div>
            <hr className="communityPageLine"/>
        </div>
    )
    
}
export default CommentList;