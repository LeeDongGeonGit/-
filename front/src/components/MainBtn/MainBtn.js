import "../css/MainBtn.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MainBtn = ({ initialBtnNum }) =>{
    const [btnNum, setBtnNum] = useState(initialBtnNum);
    const [imgList] = useState(["/mainBtn/homeBtn.png","/mainBtn/postBtn.png","/mainBtn/postUpBtn.png","/mainBtn/followBtn.png","/mainBtn/myInfoBtn.png"]);
    const [imgOnList] = useState(["/mainBtn/homeBtnOn.png","/mainBtn/postBtnOn.png","/mainBtn/postUpBtnOn.png","/mainBtn/followBtnOn.png","/mainBtn/myInfoBtnOn.png"]);
    const navigate = useNavigate();
    const onClickMainBtnE = (num)=>{
        setBtnNum(num);
        if(num === 0){
            navigate("/MainPage");
        }else if(num === 1){
            navigate("/community");
        }
        else if(num === 2){
            navigate("/postUp");
        }
        else if(num === 3){
            navigate("/FollowerListPage");
        }
        else if(num === 4){
            navigate("/MyLogPage");
        }
    }
    const renderMainBtn = () =>{
        const btns = [];
        for(let i =0; i<5; i++){
            btns.push(
                <button key={i} onClick={()=>onClickMainBtnE(i)}
                className={btnNum === i ? 'active' : 'non'}
                > <img className="MainBtnImg" src={btnNum===i?imgOnList[i]:imgList[i]} alt="x"/>
                </button>
              );
        }
        return btns;

    }
    return(
        <div className="MainBtnBody123">
            {renderMainBtn()}
        </div>
    )
}
export default MainBtn;