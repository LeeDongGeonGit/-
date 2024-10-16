import "../css/MemberCss/MembershipModification.css";
import { useLocation, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { s3HandleUpload, s3DeleteImg } from "../../components/AwsApi/AwsApi";
import axios from 'axios';
import $ from 'jquery';

export const MembershipModificationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [imgName,setImgName] = useState(null);
    const [imgBase64,setImgBase64] = useState(null);
   let userInfo = location.state?.userInfo;
   const mapInfo = location.state?.mapInfo;
    const [myInfo, setMyInfo] = useState(null);
    const [isChange,setIsChange] = useState(false);

    useEffect(
      ()=>{
        if(mapInfo !== undefined){
          setMyInfo(mapInfo);
          setImgName(mapInfo.imgName);
          setImgBase64(mapInfo.imgBase64);
          setIsChange(mapInfo.isChange);
          userInfo = mapInfo;
          console.log(userInfo.img_url);
        }
        else{
          setMyInfo(userInfo);
        }

      },[]
    )
    const goMap = () => {
      const userInfo = {
          name: myInfo.name,
          x_coordinate: myInfo.x_coordinate,
          y_coordinate: myInfo.y_coordinate,
          address: myInfo.address,
          img_url: myInfo.img_url,
          isChange: isChange,
          imgBase64: imgBase64,
          imgName: imgName
      };
      console.log(userInfo);
      navigate("/MembershipModificationMapPage", { state: { userInfo: userInfo } });
  };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setMyInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };
    const saveImg = async()=>{
      const bob = await base64ToBlob(imgBase64);
      const imgFile =await blobToFile(bob,imgName); 
      const s3Url = await s3HandleUpload(imgFile,imgName,"profile");
      return s3Url;
  }

    const updateUserInfo = async () => {
        if (!myInfo.name) {
            alert("모든 필드를 채워주세요");
            return;
        }
        let img_urlSave = myInfo.img_url;
      
        if(imgBase64 !==  null && isChange){
            img_urlSave = await saveImg();
            if(myInfo.img_url !== null && myInfo.img_url !== undefined){
               await s3DeleteImg(myInfo.img_url,"profile");
            }
        }else{
          img_urlSave = myInfo.img_url;
        }

        const sendData = {
            name: myInfo.name,
            img_url: img_urlSave,
            address : myInfo.address,
            x_coordinate : myInfo.x_coordinate,
            y_coordinate : myInfo.y_coordinate
            
        };
        console.log(sendData);
       

        await axios.put(`/user/mypage/change/myInfo`, sendData, {
            headers: {
                Authorization: $.cookie("cookie")
            }
        }).then(returnData => {
            alert("정보가 변경되었습니다.");
            navigate("/MemberImformationPage");
        }).catch(error => {
            alert("정보 변경에 실패했습니다.");
            console.error("Update error:", error);
        });
    };

    const changePWPagebtn= () => {
        navigate("/ChangPwPage");
    };
    const uploadImg = ()=>{
        function mediaPicker() {
            return new Promise((resolve, reject) => {
              M.media.picker({
                mode: 'SINGLE',
                media: 'PHOTO',
                column: 3,
                callback: function (status, result) {
                  if (status === 'SUCCESS') {
                    resolve(result.fullpath);
                    const currentTimeMillis = new Date().getTime();
                    const uniqueImageName = `${result.name.split('.')[0]}_${currentTimeMillis}.${result.name.split('.')[1]}`;
                    setImgName(uniqueImageName);
                  } else {
                    reject();
                  }
                },
              });
            });
          }
        
          function img2base64(imagePath) {
            return new Promise((resolve, reject) => {
              M.file.read({
                path: imagePath,
                encoding: 'BASE64',
                indicator: true,
                callback: function (status, result) {
                  if (status === 'SUCCESS') {
                    resolve(result.data);
                  } else {
                    reject();
                  }
                },
              });
            });
          }
          function appendBodyImage(src) {
            setImgBase64(src);
            
          }
                mediaPicker()
                  .then((imagePath) => {
                    return img2base64(imagePath);
                  })
                  .then((base64) => {
                    appendBodyImage('data:image/png;base64,' + base64);
                    setIsChange(true);
                  })
                  .catch((e) => {
                    console.error(e);
                    M.pop.alert('이미지 가져오기 실패');
                  });
    }


        
        
    const  base64ToBlob = (base64) =>{
        const base64WithoutPrefix = base64.split(',')[1]; // MIME Type 제거
        const bytes = window.atob(base64WithoutPrefix);
        const buffer = new ArrayBuffer(bytes.length);
        const byteArrays = new Uint8Array(buffer);
      
        for (let i = 0; i < bytes.length; i++) {
          byteArrays[i] = bytes.charCodeAt(i);
        }
      
        return new Blob([byteArrays], { type: "image/png" });
      }
      const blobToFile = (blob, fileName)=> {
        return new File([blob], fileName, { type: blob.type });
      }
      const backEvt = ()=>{
        navigate(-1);
      }
      if(myInfo === null){
        return <div>loading</div>;
      }
    
    return (
        <div className="MP_Main">
          <div className="MSM_img">
            <img className="MSM_X" src="/img/Vector.png" onClick={backEvt}></img>
          </div>
            <h1 className="MSM_h2">회원수정</h1>
            <div className="qwer">
              {isChange?<img onClick={uploadImg} className="MP_Logo" src={imgBase64} alt="x"/>:<img onClick={uploadImg} className="MP_Logo" src={myInfo.img_url===null?"/img/profileImgbtn.PNG":myInfo.img_url} alt="x"/>}
               <img src="/img/profileImgPlusBtn.png" onClick={uploadImg} className="MP_PLUS_PROFILE"/>
            </div>
            
            <div className="MSM_inputBox">
                    <img className="MP_icon" src="/img/id.png" alt="이름 아이콘" />
                    <input className="MP_inputNamecontainer1" type="text" style={{color: 'black'}} value={myInfo.name} name="name" onChange={handleChange} placeholder="이름" />
                </div>
            <div>
            <div className="MSM_addressContainer">
                <img className="MP_icon" src="/img/town.png" alt="우리 동네 입력 아이콘" />
                <input className="MSM_inputcontainerTown" type="text" placeholder="우리 동네 입력" value={myInfo.address} readOnly/>
                <button className="ML_mapBtn" onClick={goMap}>주소 찾기</button>
            </div>
              <div className="MSM_BtnContainer">
                <button className="MSM_Btn" onClick={updateUserInfo}>변경</button>
              </div>
            </div>
            <div className="MSM_changePw" onClick={changePWPagebtn}>비밀번호 변경 바로가기</div>
        </div>
    );
};

export default MembershipModificationPage;