import "../css/CommunityCss/PostUp.css"
import { useEffect, useState } from "react";
import axios from "axios"
import { s3HandleUpload, s3DeleteImg } from "../../components/AwsApi/AwsApi";
import {Link, useNavigate, useLocation} from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";
const PostUpPage = () =>{
    const [visibility, setVisibility] = useState(true);
    const [imgUrl, setImgUrl] = useState([]);
    const [imgName,setImgName] = useState([]);
    const [imgBase64,setImgBase64] = useState([]);
    const [title, setTitle] = useState(null);
    const [content, setContent] = useState(null);
    const [tags, setTags] = useState(null);
    const [address, setAddress] = useState(null);
    const [x_coordinate, setX_coordinate] = useState(null);
    const [y_coordinate, setY_coordinate] = useState(null);
    const [pk,setPk] = useState(null);
    const [isModification, setIsModification] = useState(null); 
    const navigate = useNavigate();
    const location = useLocation();
    const postData = location.state?.postData;
    const updatedPostData = location.state?.updatedPostData;
    useEffect(()=>{
      console.log(postData);
      console.log(updatedPostData);
      if(postData !== undefined && postData !== null){
        setTitle(postData.title);
        setContent(postData.content);
        setX_coordinate(postData.x_coordinate);
        setY_coordinate(postData.y_coordinate);
        setAddress(postData.address);
        setImgUrl(postData.img_url);
        const name = postData.img_url;
        if(name.length !==0){
          postData.img_url.map(url=>(


            loadImageAsBase64(url.imgUrl).then(base64Image => {
              setImgBase64(prev=>[...prev,base64Image])
              setImgName(prev=>[...prev,url.imgUrl.substring(name.lastIndexOf('/') + 1)])
            })
          
          ))
   
        }
        setTags(postData.tags);
        setVisibility(postData.public)
      }
      else if(updatedPostData  !== undefined && updatedPostData  !== null){
        setVisibility(updatedPostData.visibility);
        setTitle(updatedPostData.title);
        setContent(updatedPostData.content);
        setX_coordinate(updatedPostData.x_coordinate);
        setY_coordinate(updatedPostData.y_coordinate);
        setImgName(updatedPostData.imgName);
        setImgBase64(updatedPostData.imgBase64);
        setTags(updatedPostData.tags);
        setImgUrl(updatedPostData.img_url);
        if(updatedPostData.address !== undefined){
          setAddress(updatedPostData.address);
        }
        setPk(updatedPostData.pk);
        setIsModification(updatedPostData.isModification);
      }
    },[])

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value === "true");
    };
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
      };
    
      const handleContentChange = (event) => {
        setContent(event.target.value);
      };
    
      const handleTagsChange = (event) => {
        setTags(event.target.value);
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
                    setImgName(prevName=> [...prevName ,uniqueImageName]);
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
            setImgBase64(prev=>[...prev,src]);
          }
                mediaPicker()
                  .then((imagePath) => {
                    return img2base64(imagePath);
                  })
                  .then((base64) => {
                    appendBodyImage('data:image/png;base64,' + base64);
                  })
                  .catch((e) => {
                    console.error(e);
                    M.pop.alert('이미지 가져오기 실패');
                  });
    }
    const saveImg = async()=>{
      const imgUrls = await Promise.all(
        imgBase64.map(async (base64, index) => {
          const bob = base64ToBlob(base64);
          const imgFile = blobToFile(bob, imgName[index]);
          const s3Url = await s3HandleUpload(imgFile, imgName[index], "post");
          return s3Url;
        })
      );
      setImgUrl(imgUrls);
      return imgUrls;
    }
    const savePost = async()=>{
        if(title===null){
            alert("제목을 입력해주세요.");
            return;
        }
        else if(content === null){
            alert("내용을 입력해주세요.");
            return;
        }
        else if(x_coordinate === null || y_coordinate === null){
          alert("위치를 입력해주세요.");
          return;
        }
        else{
          let newImgUrls = [];
            if(imgBase64[0] !== null ){
              if(imgUrl !== null && imgUrl !== undefined){
                for(let i =0; i<imgUrl.length; i++){
                  console.log(imgUrl[i]);
                  s3DeleteImg(imgUrl[i].imgUrl,"post");
                }
              }
              newImgUrls = await saveImg();
            }
        
         const send_Data ={
            title : title,
            isPublic: visibility,
            content : content,
            img_url : newImgUrls,
            x_coordinate : x_coordinate,
            y_coordinate : y_coordinate,
            address : address,
            tags : tags,
         }
         if(isModification){
          await axios.put(`/post/${pk}`,send_Data,{headers: {
            Authorization: $.cookie("cookie")}}).then(
            response=>{
                if(response.data){
                    alert("등록 완료");
                    navigate("/community");
                }
                else{
                    alert("등록 실패");
                }
            }
         )
         }
         else if(postData !==undefined && postData !== null){
          await axios.put(`/post/${postData.pk}`,send_Data,{headers: {
            Authorization: $.cookie("cookie")}}).then(
            response=>{
                if(response.data){
                    alert("등록 완료");
                    navigate("/community");
                }
                else{
                    alert("등록 실패");
                }
            }
         )
         }
         else{
          await axios.post("/post",send_Data,{headers: {
            Authorization: $.cookie("cookie")}}).then(
            response=>{
                if(response.data){
                    alert("등록 완료");
                    navigate("/community");
                }
                else{
                    alert("등록 실패");
                }
            }
         )

         }
        
        }}
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
      const loadImageAsBase64 = (url) => {
        return new Promise((resolve, reject) => {
          fetch(url)
            .then(response => {
              return response.blob();
            })
            .then(blob => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);  // Blob을 Base64로 변환
              reader.onloadend = () => {
                const base64data = reader.result;
                // 접두사를 MIME 타입에 맞게 동적으로 추가
                resolve(`data:image/png;base64,${base64data.split(',')[1]}`);
              };
              reader.onerror = error => reject(error);
            })
            .catch(error => {
              console.error('Error loading or converting image:', error);
              reject(error);
            });
        });
      }
      const deleteImg = (index)=>{
        setImgBase64((prevBase64) => prevBase64.filter((_, i) => i !== index));
        setImgName((prevNames) => prevNames.filter((_, i) => i !== index));
      }
      const backEvt = ()=>{
        navigate("/community");
      }
      const goMap = ()=>{
        let isModification = false;
        let pk = null;
        if(postData !==undefined && postData !== null){
          isModification = true; 
          pk = postData.pk;
        }
        const postPrev = {
          pk : pk,
          visibility : visibility,
          title : title,
          x_coordinate : x_coordinate,
          y_coordinate : y_coordinate,
          content : content,
          imgName : imgName,
          imgBase64 : imgBase64,
          tags : tags,
          address : address,
          isModification : isModification,
          img_url : imgUrl
        }
        console.log(postPrev);
        
        navigate("/PostLocationPage",{ state: { postPrev : postPrev } });
      }
    return(
        <div className="PostUpPageBody123">
            <div className="PostUpPageHeader">
                <div onClick={backEvt}><img className="PostUp_X" src="/img/Vector.png"></img></div>
                <div className="PostUpPageSelect">
                <input 
                        type="radio" 
                        name="visibility" 
                        value="true"
                        checked={visibility === true} 
                        onChange={handleVisibilityChange} 
                    />
                    <label>공개</label>
                    <input 
                        type="radio" 
                        name="visibility" 
                        value="false"
                        checked={visibility === false} 
                        onChange={handleVisibilityChange}
                    />
                    <label>비공개</label>
                </div>
                <button className="PostUp_saveBtn" onClick={()=>savePost()}>등록</button>
            </div>
            <div onClick={goMap} className="PostUpPageMapBtn">
            {address===null? <><img className="PostUpPageMapBtnImg" src="/img/writeMapBtn.png" alt="x"/>
                <span className="PostUpPageMapBtnSpan">위치 추가</span></>:<span style={{paddingLeft:"10px"}}>{address}</span>}
                </div>
            <hr className="PostUpPageLine"/>
            <div className="PostUpPageTile">
              <input type="text" placeholder="제목" value={title} onChange={handleTitleChange}/>
            </div>
            <hr className="PostUpPageLine"/>
            <div className="PostUpPageMainText">
              {imgBase64[0] === null ? "":
              imgBase64.map((img,index)=>(<div><span onClick={()=>deleteImg(index)}><img className="PostUp_deletePicture" src="/img/deletePicture.png"/></span><img src={img} alt="x"/></div>))}
                <textarea placeholder="본문에 사진을 이용해 글을 적어보세요!"  className="PostUpText" value={content} onChange={handleContentChange}/>
            </div>
            <hr className="PostUpPageLine"/>
            <div className="PostUpPageTag">
                <input type="text" placeholder="#태그추가"  value={tags} onChange={handleTagsChange}/>
            </div>
            <div className="PostUpPageImgBtn" onClick={uploadImg}>
                <img src="/img/camera.png" alt="x"/>
            </div>
        </div>
    )
}

export default PostUpPage;