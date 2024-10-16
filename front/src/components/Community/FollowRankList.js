import "../css/FollowRankList.css"
import { useNavigate } from "react-router-dom";

const FollowRankList = ({img_url,name,pk})=>{
    const navigate = useNavigate();
    const goUserInfo = () =>{
        navigate(`/FollowerLogPage/${pk}`);
    }
    return(
        <div className="FollowRankListBody" onClick={()=>goUserInfo()}>
            <div className="FollowRankListImgBox">
                <img src={img_url===null? "/logo.png":img_url} alt="x"/>
            </div>
            <div>
                {name}
            </div>
        </div>
    )
}
export default FollowRankList;