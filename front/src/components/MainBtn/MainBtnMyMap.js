import "../css/MainBtnMyMap.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const MainBtnMyMap = ({ initialBtnNum = 0 }) =>{
    const [btnNum, setBtnNum] = useState(initialBtnNum);
    const [imgList] = useState(["/img/communityBtn.png","/img/mapBtn.png","/img/writeBtn.png"]);
    const navigate = useNavigate();
    const onClickMainBtnE = (num)=>{
        setBtnNum(num);
        if(num === 0){
            navigate("/community");
        }else if(num === 1){
            navigate("/MainPage");
        }
        else if(num === 2){
            navigate("/postUp");
        }
    }
    const renderMainBtn = () =>{
        const btns = [];
        for(let i =0; i<3; i++){
            btns.push(
                <button key={i} onClick={()=>onClickMainBtnE(i)}
                className={btnNum === i ? 'Active' : 'Non'}
                > <img src={imgList[i]} alt="x"/>
                </button>
              );
        }
        return btns;

    }
    return(
        <div className="MainBtnMyMapBody123">
            {renderMainBtn()}
        </div>
    )
}
export default MainBtnMyMap;