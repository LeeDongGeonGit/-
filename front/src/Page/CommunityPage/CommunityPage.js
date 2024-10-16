import PostList from "../../components/Community/PostList";
import "../css/CommunityCss/Community.css";
import FollowRankList from "../../components/Community/FollowRankList";
import MainBtn from "../../components/MainBtn/MainBtn";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";
import { useState,useRef,useEffect } from "react";

const CommunityPage = () => {
    const [postList, setPostList] = useState([]);
    const [rankList, setRankList] = useState(null);
    const [scrollNum, setScrollNum] = useState(1);
    const [last, setLast] = useState(null);
    const [ourPostList, setOurPostList] = useState([]);
    const [ourLast,setOurLast] = useState(null);
    const [ourScrollNum, setOurScrollNum] = useState(1);
    const [address,setAddress] = useState(null);
    const searchRef = useRef(null);
    const [selectTab,setSelectTab] = useState("first");
    const [loading, setLoading] = useState(true); // 추가: 로딩 상태
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getLatestPostList(),
                    getFollowRankList(),
                    getOurLatestPostList()
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getFollowRankList = async () => {
        await axios.get(`/follow/rank`, {
            headers: { Authorization: $.cookie("cookie") }
        }).then(response => {
            setRankList(response.data.follows);
            console.log(response.data);
        });
    }

    const getLatestPostList = async () => {
        await axios.get(`/post/${scrollNum}`, {
            headers: { Authorization: $.cookie("cookie") }
        }).then(response => {
            setPostList(prevPost => [...prevPost, ...response.data.posts]);
            setLast(response.data.last);
            setScrollNum(prevScrollNum => prevScrollNum + 1);
            console.log(response.data);
             // 데이터 로딩 완료 후 로딩 상태 false로 설정
        });
    }
    const getOurLatestPostList = async () => {
        await axios.get(`/post/address/${ourScrollNum}`, {
            headers: { Authorization: $.cookie("cookie") }
        }).then(response => {
            setOurPostList(prevPost => [...prevPost, ...response.data.posts]);
            setOurLast(response.data.last);
            setOurScrollNum(prevScrollNum => prevScrollNum + 1);
            setAddress(response.data.address);
            console.log(response.data);
             // 데이터 로딩 완료 후 로딩 상태 false로 설정
        });
    }

    const search = () => {
        console.log(searchRef.current.value);
        if(searchRef.current.value===null ||searchRef.current.value=== undefined|| searchRef.current.value === ""){
            alert("검색어를 입력해주세요.")
            return;
        }
        else{
        navigate(`/search/?query=${searchRef.current.value}`);}
    }   
    const goPost = (id)=>{
        navigate(`/post/${id}`);
    } 
    const goPostComment = (id)=>{
        navigate(`/post/${id}`,{state:{isComment : true}});
    } 
    const tabClickEvt = (event)=>{
        setSelectTab(event.target.dataset.value);
    }

    if (postList === null || rankList === null) {
        return <div style={{textAlign:"center", verticalAlign:"center", color:"white"}}>loading....</div>
    }

    return(
        <div className="communityPageBody123" >
            <div className="communityPageInBody">
                <div className="communityPageHeaderH">
                    <div className="comunityPageHeader"><p>검색</p></div>
                </div>
                <div className="searchBox">
                    <input type="text" className="communityPageSearch" ref={searchRef} />
                    <img src="/img/search.png" className="searchBtn" alt="x" onClick={search} />
                </div>
                <div>
                    <div className="communityPageRankHeader">
                        <img src="/img/fire.png" alt="x" />
                        <span>팔로워 랭킹</span>
                        
                    </div>
                    <div className="communityPageRankBox">
                        <div className="communityPageRank">
                            {rankList.map(rank => (
                                <FollowRankList key={rank.to_user.pk} name={rank.to_user.name} img_url={rank.to_user.img_url} pk={rank.to_user.pk} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <hr className="communityPageLine" />
            <div className="postListHeaderBox">
                <div className="s_comunityPageTab123">
                    <span className={selectTab ==="first"?"selected123":"nonSelected123"} data-value="first" onClick={tabClickEvt}>전체 게시글</span>
                    <span className={selectTab ==="first"?"nonSelected123":"selected123"} data-value="second" onClick={tabClickEvt}>
                        우리 동네글
                    </span>
                </div>
                {selectTab==="second"?<div className="s_comunityPageMyTwon">{address}</div>:""}
                {loading ? (
                    <img src="/skeleton.png" alt="Loading..." style={{width:"300px", margin:"20px", opacity:"0.6"}}/> // 스켈레톤 이미지 경로 설정
                ) : (
                    selectTab === "first" ? postList.map(post => (
                        <PostList 
                            key={post.pk} 
                            title={post.title} 
                            tags={post.tags !== null ? post.tags
                                .split(' ')
                                .filter(tag => tag.trim() !== '') // 공백 태그 제거
                                .map(tag => tag.startsWith('#') ? tag : `#${tag}`) // 태그 앞에 # 추가
                                .join(' ')
                                .trim() : ""}
                            img_url={post.img_url.length === 0 ? null : post.img_url[0].imgUrl} 
                            comment={post.comment} 
                            isHeart={post.heart} 
                            goPost={() => goPost(post.pk)} 
                            postPk={post.pk} 
                            likesPk={post.likes_pk}
                            commentSum={post.commentSum}
                            heartCount={post.heartSum}
                            goPostComment={()=>goPostComment(post.pk)}
                        />
                    )) : ourPostList.map(post => (
                        <PostList 
                            key={post.pk} 
                            title={post.title} 
                            tags={post.tags !== null ? post.tags
                                .split(' ')
                                .filter(tag => tag.trim() !== '') // 공백 태그 제거
                                .map(tag => tag.startsWith('#') ? tag : `#${tag}`) // 태그 앞에 # 추가
                                .join(' ')
                                .trim() : ""}
                            img_url={post.img_url.length === 0 ? null : post.img_url[0].imgUrl} 
                            comment={post.comment} 
                            isHeart={post.heart} 
                            goPost={() => goPost(post.pk)} 
                            postPk={post.pk} 
                            likesPk={post.likes_pk}
                            commentSum={post.commentSum}
                            heartCount={post.heartSum}
                            goPostComment={()=>goPostComment(post.pk)}
                        />
                    ))
                )}
                {selectTab === "first" ? 
                    (last ? 
                    <div className="communityPageLoadingBox"  onClick={getLatestPostList}></div> :
                        <div className="communityPageLoading" onClick={getLatestPostList}>
                            <img className="communityPageLoading" src="/img/downarrow.png"/>
                        </div>) :
                        (ourLast ? 
                        <div className="communityPageLoading"></div> :
                        <div className="communityPageLoading" onClick={getOurLatestPostList}>
                            <img className="communityPageLoading" src="/img/downarrow.png"/>
                        </div>)
                }
            </div>
            <MainBtn initialBtnNum={1} />
        </div>
    );
}

export default CommunityPage;