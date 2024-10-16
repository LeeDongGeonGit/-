import "../css/FollowCss/List.css";
import { useNavigate } from "react-router-dom";

export const ListPage=({follower, deleteEvt, btnName, user_pk})=>{
    const navigate = useNavigate();
    const goUserInfo = () =>{
        navigate(`/FollowerLogPage/${user_pk}`);
    }
    return(
        <div className="LP_Main">
            <div className={"LP_followercontainer"}>
                <div className={"LP_imagecontainer"}>
                    <img src={follower.img_url === null?"/p.jpg":follower.img_url} alt="x"/>
                </div>
                <div>
                    <h2 className="LP_h2" onClick={goUserInfo}>{follower.name}</h2>
                </div>
                <div>
                    <button className="LP_btn" onClick={()=>deleteEvt()}>{btnName}</button>
                </div>
            </div>
        </div>
    )
}
export default ListPage;