
import "../css/MemberCss/ChangePw.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import axios from 'axios';
import $ from 'jquery';

export const ChangePwPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async () => {
        if (password !== confirmPassword) {
            alert("입력하신 비밀번호가 서로 일치하지 않습니다.");
            return;
        }

        const sendData = {
            password: password
        };

        try {
            const response = await axios.put('/user/mypage/change/pw', sendData, {
                headers: {
                    Authorization: $.cookie("cookie")
                }
            });
            if (response.data) {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                navigate('/MemberImformationPage'); 
            }
        } catch (error) {
            alert("비밀번호 변경에 실패했습니다.");
            console.error("Change password error:", error);
        }
    };
    const backEvt = ()=>{
        navigate(-1);
      }

    return (
        <div className="CP_Main">
            <img className="MP_X" src="/img/Vector.png" onClick={backEvt}></img>
            <div className="CP_img">
              
                <img className="MP_Logo" src="/img/logo.PNG"></img>
            </div>
            <div className="CP_title">
                <h1 className="CP_PwChangeH2">비밀번호 변경</h1>
            </div>

            <div className="CP_passwordBox">
                <div className="MP_inputBox">
                    <img className="MP_icon" src="/img/pw.png" alt="비밀번호 아이콘" />
                    <input
                    className="MP_inputcontainer2"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)} style={{color: 'black'}}
                    placeholder="새 비밀번호 입력"
                />
                </div>
                <div className="MP_inputBox">
                    <img className="MP_icon" src="/img/pw.png" alt="비밀번호 확인 아이콘" />
                    <input
                    className="MP_inputcontainer2"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 확인"
                />                </div>
            </div>

            <div>
                <button className="CP_btn" onClick={handleChangePassword}>변경</button>
            </div>
        </div>
    );
}

export default ChangePwPage;