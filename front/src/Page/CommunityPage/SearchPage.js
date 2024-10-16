import { useEffect, useState } from "react";
import PostList from "../../components/Community/PostList";
import "../css/CommunityCss/Search.css";
import MainBtn from "../../components/MainBtn/MainBtn";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";
import ListPage from "../FollowPage/ListPage";

const CommunityPage = ()=>{
    const [postList,setPostList] = useState([]);
    const [followList,setFollowList] = useState([]);
    const [scrollNum,setScrollNum] = useState(1);
    const [last, setLast] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    const [searchQuery,setSearchQuery] = useState(query);
    const [selectTab,setSelectTab] = useState("first");
    useEffect(()=>{
        if(selectTab==="first"){
            getLatestPostList();
        }
        else{
            getLatestFollowList();
        }
    },[])
    useEffect(()=>{
           if(selectTab==="first"){
            getFirtPostList();
        }
        else{
            getFirtFollowList();
        }
    },[query])

    useEffect(()=>{
        if(selectTab==="first"){
            getFirtPostList();
        }
        else{
            getFirtFollowList();
        }

    },[selectTab])
    const onChangeQuery = (event)=>{
        setSearchQuery(event.target.value);
    }
    const backEvt = ()=>{
        navigate("/community");
    }

    const getLatestPostList= async()=>{
      
        await axios.get(`/post/${scrollNum}/${query}`,{headers: {
            Authorization: $.cookie("cookie")}}).then(
            response=>{
                setPostList(prevPost=>[...prevPost,...response.data.posts]);
                setLast(response.data.last);
                setScrollNum(prevScrollNum => prevScrollNum + 1);
                console.log(response.data);
            }
        )}
        const getFirtPostList= async()=>{
      
            await axios.get(`/post/1/${query}`,{headers: {
                Authorization: $.cookie("cookie")}}).then(
                response=>{
                    setPostList(response.data.posts);
                    setLast(response.data.last);
                    setScrollNum(2);
                    console.log(response.data);
                }
            )}
            const getLatestFollowList= async()=>{
                await axios.get(`/follow/${scrollNum}/${query}`,{headers: {
                    Authorization: $.cookie("cookie")}}).then(
                    response=>{
                        setFollowList(prevPost=>[...prevPost,...response.data.follows]);
                        setLast(response.data.last);
                        setScrollNum(prevScrollNum => prevScrollNum + 1);
                        console.log(response.data);
                    }
                )}
            const getFirtFollowList= async()=>{
                await axios.get(`/follow/1/${query}`,{headers: {
                    Authorization: $.cookie("cookie")}}).then(
                    response=>{
                        setFollowList(response.data.follows);
                        setLast(response.data.last);
                        setScrollNum(2);
                        console.log(response.data);
                    }
                )}
        const search = ()=>{
            if(searchQuery===null ||searchQuery=== undefined|| searchQuery === ""){
                alert("검색어를 입력해주세요.")
                return;
            }else{
            navigate(`/search/?query=${searchQuery}`);}
        }    
        const tabClickEvt = (event)=>{
            setSelectTab(event.target.dataset.value);
        }
        const goPost = (id)=>{
            navigate(`/post/${id}`)
        }

        const addFollow= async(user_pk)=>{
            await axios.post(`/follow/${user_pk}`,"",{headers: {
                Authorization: $.cookie("cookie")}}).then(
                response=>{
                    if(response.data)
                        { alert("팔로우 추가 완료!");
                            getFirtFollowList();}
                    else{
                        alert("추가 실패!");
                    }
                 
                }
            )}
            const goPostComment = (id)=>{
                navigate(`/post/${id}`,{state:{isComment : true}});
            } 
            if((postList === null && selectTab ==="first")|| (followList === null&& selectTab ==="second")){
                return <div>loading....</div>
            }

    

    return(
        <div className="s_communityPageBody" >
            <div>
                <div className="searchPage_header">
                    <div onClick={backEvt}><img className="PostUp_X" src="/img/Vector.png"></img></div>
                    <div className="s_comunityPageHeader">검색</div>
                </div>
                <div className="s_searchBox">
                <input type="text" className="s_communityPageSearch2" value={searchQuery} onChange={onChangeQuery}/>
                <img src="/img/search.png" className="s_searchBtn2" alt="x" onClick={search}/>
                </div>
            </div>
            <div className="s_comunityPageTab">
                <span className={selectTab ==="first"?"selected":"nonSelected"} data-value="first" onClick={tabClickEvt}>게시글</span>
                <span className={selectTab ==="first"?"nonSelected":"selected"} data-value="second" onClick={tabClickEvt}>사람</span>
            </div>
           <hr className="search_communityPageLine"/>
            <div className="search_Box">

                {selectTab === "first"?<>{postList.map(post=>(
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
                ))}</>:<>{followList.map(follow=>(
                    <ListPage follower = {follow.to_user} deleteEvt={()=>addFollow(follow.to_user.pk)} btnName="팔로우" user_pk={follow.to_user.pk} />
                ))}</>}
                {last?<div className="s_communityPageLoading"></div>:
                <div className="communityPageLoading" onClick={selectTab==="first"?getLatestPostList:getLatestFollowList}>
                    <img className="communityPageLoading" src="/img/downarrow.png"/>
                </div>}
            </div>
            

        </div>
    )
}



export default CommunityPage;