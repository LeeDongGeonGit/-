import { Link, useNavigate } from "react-router-dom";
import "../css/FollowCss/FollowerList.css";
import { useState, useEffect } from 'react';
import ListPage from "./ListPage";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";


export const FollowerListPage = () =>{
    const navigate = useNavigate();

    const [followers, setFollowers] = useState([]);
    const [num, setNum] = useState();
    const [last,setLast] = useState(true);
    const [scrollNum,setScrollNum] = useState(2);
    useEffect(() => {
        fetchFirstFollowers();
    }, []);

    const fetchFirstFollowers = async () => {
        try {
            axios.get('/follow/1', {
                headers: { Authorization: $.cookie("cookie") }
            }).then(response=>{
                if (response.data) {
                    setFollowers(response.data.follows);
                    setNum(response.data.followSum) 
                    setLast(response.data.last);
                    setScrollNum(2);
                    console.log(response.data)
                }
            })
        } catch (error) {
            console.error('Error fetching followers:', error);
        }
    };
    
    const fetchAddFollowers = async () => {
        try {
            axios.get(`/follow/${scrollNum}`, {
                headers: { Authorization: $.cookie("cookie") }
            }).then(response=>{
                if (response.data) {
                    setFollowers(prv=> [...prv, ...response.data.follows]);
                    setNum(response.data.followSum) 
                    setScrollNum(prv=>prv+1);
                    setLast(response.data.last);
                    console.log(response.data)
                }
            })
        } catch (error) {
            console.error('Error fetching followers:', error);
        }
    };

    const handleFollowerDelete = (pk) => {
        if (window.confirm("정말 팔로워 목록에서 삭제하시겠습니까?")) {
            axios.delete(`/follow/${pk}`,"", {
                headers: { Authorization: $.cookie("cookie") }
            }).then(response => {
                if (response.data) {
                    alert("삭제 완료");
                    fetchFirstFollowers();
                } else {
                    alert("오류 발생");
                }
            }).catch(error => {
                console.error('Error deleting follower:', error);
                alert("오류 발생");
            });
        }
    };
    const backEvt = ()=>{
        navigate(-1);
      }
    

    if (followers === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="FL_Main">
            <div className="FL_img">
                <img onClick={backEvt} className="FL_X" src="/img/Vector.png" alt="닫기" />
            </div>
            <div className="FL_textcontainer">
                <h1 className="FL_text1">팔로잉 목록</h1>
                <h1 className="FL_text2">총 {num}명</h1>
            </div>
            <hr className="FL_hr" />
            <div className="FL_friendcontainer">
                {
                    followers.map(follower => (
                        <ListPage 
                            key={follower.pk}
                            follower={follower.to_user}
                            btnName = "삭제" 
                            user_pk={follower.to_user.pk}
                             deleteEvt={() => handleFollowerDelete(follower.pk)
                            }
                        />
                    ))
                }
                 {last?<div className="communityPageLoading"></div>:
                <div className="communityPageLoading" onClick={fetchAddFollowers}>
                    <img className="communityPageLoading" src="/img/downarrow.png"/>
                </div>}
            </div>
        </div>
    );
}

export default FollowerListPage;