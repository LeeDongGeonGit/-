import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/MemberCss/IdFind.css";
import { useRef, useState } from "react";
import axios from "axios";

export const IdFindPage = () => {
    const location = useLocation();
    // const id = location.state.id;
    const id = 0; //오류나서 임시로 해놓음
    const [email, setEmail] = new useState("");
    const emailRef = new useRef(null);
    const numRef = new useRef(null);
    const navigate = useNavigate();

    const emailBtn = async() => {
        let emailText = emailRef.current.value;
        setEmail(emailText);
        await axios.get(`/user/${emailText}/sendemail-id`)
        .then(
            returnData=>{
                if(returnData.data){
                    alert("인증번호를 보냈습니다.");
                }
                else{
                    alert("이메일 정보가 다릅니다.");
                }
            }
        ).catch(error => {
            console.error("Email send error: ", error);
            alert("서버 오류로 인증번호 전송에 실패했습니다.");
        });
    }

    const emailAuthentication = async () => {
        let num = numRef.current.value; 
        try {
            const response = await axios.get(`/user/${email}/${num}/id`); // 서버에 이메일과 인증번호를 검증 요청합니다.
            if (response.data) {
                alert("이메일로 아이디를 보냈습니다."); // 서버에서 긍정적인 응답을 받았을 경우
                navigate(`/`);
            } else {
                alert("인증번호가 틀렸습니다."); // 서버에서 부정적인 응답을 받았을 경우
            }
        } catch (error) {
            console.error("인증 과정에서 오류 발생:", error); // 네트워크 오류나 서버 오류 처리
            alert("인증 과정에서 문제가 발생했습니다."); // 오류 메시지 출력
        }
    };

    return(
        <div className="IF_main">
            <Link to="/"><img className="IF_X" src="/img/Vector.png"></img></Link>
            
            <div className="IF_textcontainer">
                <h1 className="IF_text1">아이디 찾기</h1>
                <Link to="/PwFindPage" style={{ textDecoration: 'none', color: 'inherit' }}><h1 className="IF_pwText2">비밀번호 찾기</h1></Link>
            </div>
            
            <div className="IF_inputdox">
                <p className="IF_P">*회원정보에 등록된 이메일 입력</p>
                <div className="IF_EMcontainer MP_inputBox">
                    <img className="IF_iconEm" src="/img/email.png" alt="이메일 아이콘" />
                    <input className="IF_inputcontainerEm" type="text" ref={emailRef} placeholder="이메일"></input>
                    <button className="MP_checkBtn"  onClick={()=>emailBtn()}>전송</button>
                </div>
                <div className="MP_NUMcontainer MP_inputBox">
                    <img className="IF_iconNum" src="/img/email.png" alt="인증번호 아이콘" />
                    <input className="MP_inputcontainerNum" ref={numRef} type="text" placeholder="인증번호" />
                </div>

            </div>
            <div>
                <button className="IF_btn" onClick={()=>emailAuthentication()}>확인</button>
            </div>
        </div>
    );
};
export default IdFindPage;