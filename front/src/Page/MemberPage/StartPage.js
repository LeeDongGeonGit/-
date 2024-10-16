import "../css/MemberCss/Start.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";

export const StartPage= ()=> {
    const idRef = new useRef(null);
    const pwRef = new useRef(null);
    const navigate = useNavigate();
    
    const login = ()=>{
        let id = idRef.current.value;
        let pw = pwRef.current.value;
        if(id === ""){
            alert("아이디를 입력해주세요.");
        }
        else if(pw === ""){
            alert("비밀번호를 입력해주세요.")
        }
        else{
            let user = {
                id:id,
                password:pw
            }
            axios.post("/user/login", user).then(
                returnData=>{
                    if(returnData.data){
                        alert("로그인 성공")
                        $.cookie("cookie", returnData.data, {expires: 1});
                        navigate("/MainPage");
                    }
                    else{
                        alert("로그인 정보가 일치하지 않습니다.");
                    }
                }
            )
            .catch(error => {
                console.error("로그인 실패:", error);
                alert("로그인 처리 중 오류가 발생했습니다.");
            });
        }
    }
  

    return(
        <div className="SP_Main">
            <img className="SP_Logo" src="/img/logo.PNG"></img>
            <div className="SP_container">
                <div className="SP_idBox">
                    <img className="SP_icon" src="/img/id.png" alt="아이디 아이콘" />
                    <input className="SP_inputcontainer1" type="text" ref={idRef} placeholder="아이디"></input>
                </div>
                <div className="SP_pwBox">
                    <img className="SP_icon" src="/img/pw.png" alt="비밀번호 아이콘" />
                    <input className="SP_inputcontainer2" type="password" ref={pwRef} placeholder="비밀번호"></input><br/>
                </div>
                <button className="SP_button" onClick={()=>login()}>로그인</button>

            </div>
            <div className="SP_textContainer">
                <Link to="/IdFindPage" className="link-no-decor"><p className="SP_text1">아이디 찾기</p></Link>
                <p style={{  transform: "translateY(2px)", display: "inline-block" }}>|</p>
                <Link to="/PwFindPage" className="link-no-decor"><p className="SP_text2">비밀번호 찾기</p></Link>
                <p style={{  transform: "translateY(2px)", display: "inline-block" }}>|</p>
                <Link to="/MembershipPage" className="link-no-decor"><p className="SP_text3">회원가입</p></Link>
            </div>
    
        </div>
    );
};

export default StartPage;