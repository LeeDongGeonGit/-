import { Link, useNavigate } from "react-router-dom";
import "../css/MemberCss/PwFind.css";
import { useRef, useState } from "react";
import axios from "axios";

//비밀번호를 변경할지 이메일로 임시 비밀번호를 보낼지
export const PwFindPage = () => {
    const emailRef = useRef(null);
    const numRef = useRef(null);
    const idRef = useRef(null);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");  // State to store the email

    const emailBtn = async () => {
        let emailText = emailRef.current.value;
        setEmail(emailText);  // Set email in state
        let idText = idRef.current.value;

        await axios.get(`/user/${emailText}/${idText}/sendemail`)
            .then(returnData => {
                if (returnData.data) {
                    alert("인증번호를 보냈습니다.");
                } else {
                    alert("이메일 정보가 다릅니다.");
                }
            }).catch(error => {
                console.error("이메일 전송 실패:", error);
                alert("이메일 처리 중 오류가 발생했습니다.");
            });
    }

    const emailAuthentication = async() => {
        let num = numRef.current.value;
        await axios.get(`/user/${email}/${num}/authentication-pw`)
            .then(returnData => {
                if (returnData.data) {
                    // navigate("/ChangePwPage", {state: {num:num, email:email}});
                    alert("인증번호가 맞습니다.");
                    navigate(`/`);
                } else {
                    alert("인증번호가 다릅니다.")
                }
            })
    }

    const overlapBtn = ()=>{
        alert("아이디 확인완료");
    }

    return(
        <div className="PF_main">
            <Link to="/"><img className="PF_X" src="/img/Vector.png"></img></Link>
            <div className="PF_textcontainer">
                <Link to="/IdFindPage" style={{ textDecoration: 'none', color: 'inherit' }}><h1 className="PF_text1">아이디 찾기</h1></Link>
                <h1 className="PF_pwText2">비밀번호 찾기</h1>
            </div>
            <div className="PF_inputdox">

                <div className="PF_inputBox">
                <p className="IF_P">*회원정보에 등록된 정보 입력</p>
                    <img className="PF_icon" src="/img/id.png" alt="아이디 아이콘" />
                    <input className="PF_inputcontainerid" type="text" placeholder="아이디" ref={idRef}/>
                    <button className="PF_overlapBtn" onClick={overlapBtn}>확인</button>
                </div>

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
                <button className="PF_btn" onClick={()=>emailAuthentication()}>확인</button>
            </div>
        </div>
    );
};
export default PwFindPage;