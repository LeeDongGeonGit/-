import { Link, useNavigate } from "react-router-dom";
import "../css/MemberCss/MemberImformation.css";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
import { useEffect, useState } from "react";

export const MemberImformationPage = () => {
 
    const deleteAccount = async()=>{
        if (window.confirm("정말로 회원탈퇴 하시겠습니까?")) {
            await axios.delete(`/user`,{
                headers: {
                    Authorization: $.cookie("cookie")
                }
            }).then(returnData=>{
                alert(returnData.data);
                $.removeCookie("cookie");
                navigate("/");
                window.location.reload();
            })
        .catch(error => {
                console.error("회원 탈퇴 실패:", error);
                alert("회원 탈퇴 처리 중 문제가 발생했습니다.");
            });
        }
     }

    //회원정보
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/MembershipModificationPage` ,{state:{userInfo: userInfo}});
    };

    useEffect(() => {
        getMyInfo();
    }, []);

    const getMyInfo = async() =>{
        await axios.get(`/user/mypage`,{headers: {
            Authorization: $.cookie("cookie")}}).then(returnData=>{
                let myInfoSave = {
                    name : returnData.data.name,
                    id : returnData.data.id,
                    email : returnData.data.email,
                    img_url: returnData.data.img_url,
                    address : returnData.data.address,
                    x_coordinate: returnData.data.x_coordinate,
                    y_coordinate : returnData.data.y_coordinate
                }
                console.log(returnData.data)
                setUserInfo(myInfoSave);
            })
    }



    const handleLogout = () => {
        navigate("/");  //로그인 페이지로 이동
         try {

             // 쿠키에서 인증 토큰을 제거합니다.
           $.removeCookie("cookie");

            // 사용자를 홈페이지로 리디렉션하고 페이지를 새로 고칩니다.
             navigate("/");
         } catch (error) {
            console.error('Logout failed: ', error);
            alert('로그아웃에 실패했습니다.');
         }
    };
    const backEvt = ()=>{
        navigate("/MyLogPage");
      }

    return(
        <div className="MI_main">
            <div className="MI_img">
                <img className="MI_X" src="/img/Vector.png" onClick={backEvt}></img>
           </div>
            <h1 className="MI_h2">회원정보</h1>
            <img className="MI_Logo" src={userInfo.img_url ===null?"/p.jpg":userInfo.img_url} alt="x"></img>
            <div className="MI_imformation">
                <div className="MI_name">이름 : {userInfo.name}</div>
                <div className="MI_id">아이디 : {userInfo.id}</div>
                <div className="MI_MyTown">우리 동네 : {userInfo.address}</div>
                <div className="MI_email">이메일 : {userInfo.email}</div>
            </div>
            <button className="MI_btn1" onClick={handleEdit}>회원수정</button>
            <div className="MI_btnbox">
                <button className="MI_btn2" onClick={handleLogout}>로그아웃</button>
                <button className="MI_btn3" onClick={deleteAccount}>회원탈퇴</button>

            </div>

        </div>
    );
};
export default MemberImformationPage;