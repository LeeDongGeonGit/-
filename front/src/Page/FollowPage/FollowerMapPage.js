import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk"; // 카카오 지도 SDK 컴포넌트
import axios from "axios"; // HTTP 요청을 위한 라이브러리
import useKakaoLoader from "../../components/useKakaoLoader"; // 카카오 지도 API 로딩을 위한 사용자 정의 훅
import $ from "jquery"; // jQuery 라이브러리
import {} from "jquery.cookie"; // jQuery로 쿠키 관리를 위한 플러그인
import { useParams } from "react-router-dom";
import "../css/CommunityCss/MapWithMarkers.css";
import MainBtnMyMap from "../../components/MainBtn/MainBtnMyMap";

const FollowerMapPage = () => {
  const { id } = useParams(); // Extract `id` from the URL
  const [posts, setPosts] = useState([]); // 지도에 표시할 포스트 데이터
  const [visiblePosts, setVisiblePosts] = useState([]); // 현재 지도에 보이는 포스트
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 포스트
  const [selectedAddress, setSelectedAddress] = useState(""); // 선택된 주소
  const [center, setCenter] = useState({ lat: 24.128503, lng: 127.529344});
  const [zoomLevel, setZoomLevel] = useState(13);
  const mapRef = useRef(null); // 지도 인스턴스를 저장하기 위한 ref
  const navigate = useNavigate(); // navigate 함수 인스턴스화

  useKakaoLoader(); // 카카오 지도 API 로드

  
  // 포스트 데이터를 가져오는 부분
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/post/otherMap/${id}`, { headers: { Authorization: $.cookie("cookie") } });
        setPosts(response.data.posts);
        console.log(response.data);
        updateVisiblePosts(response.data.posts);  // 초기 포스트를 바탕으로 보여질 포스트 업데이트
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []);

  // 보이는 포스트 업데이트 함수
  const updateVisiblePosts = (posts) => {
      setVisiblePosts(posts);
  };

  // 마커 클릭 핸들러
  const handleMarkerClick = (post) => {
    setSelectedPost(post);
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(post.y_coordinate, post.x_coordinate, (result, status) => {
      setSelectedAddress(status === window.kakao.maps.services.Status.OK ? result[0].address_name : "주소를 찾을 수 없습니다.");
    });
  };

  const FriendMapBackClick = ()=>{
    navigate(-1);
  }

  return (
    <div className="MM_Main">

      <div className="MM_searchBoxContainer">
        <img onClick={FriendMapBackClick} className="Map_X" src="/img/Vector Black.png" alt="back" />
        <h1 className="MM_MyMap">Friend Map</h1>
      </div>

      <Map
        center={center}
        style={{ width: "100vw", height: "450vh" }}
        level={zoomLevel}
        onZoomChanged={(map) => {
          setZoomLevel(map.getLevel());
          mapRef.current = map;
        }}
        onCreate={(map) => {
          mapRef.current = map;
        }}
      >
        {visiblePosts.map((post, index) => (
          <MapMarker
            key={`post-${index}`}
            position={{ lat: post.y_coordinate, lng: post.x_coordinate }} // Corrected the latitude and longitude keys
            onClick={() => handleMarkerClick(post)}
            image={{ src: '/img/Maker.png', size: { width: 25, height: 30 }, options: { offset: { x: 18, y: 36 } }}}
          />
        ))}
{selectedPost && (
  <div className="M_MainClickBoxWrapper">
    <div 
      className="M_mainClickBox"
      onClick={() => navigate(`/post/${selectedPost.pk}`)} // 게시글 상세 페이지로 이동
    >
      <img className="FM_X" src="/img/VectorBlack.png" onClick={(e) => { e.stopPropagation(); setSelectedPost(null); }} alt="Close" />
      <div className="M_mainPostBox">
        <img className="M_mainPostImg" src={selectedPost.img_url.length === 0 ? '/p.jpg':selectedPost.img_url[0].imgUrl } alt="Post" style={{ width: "150px", height: "120px"}} />
        <div className="M_mainPostBoxTitle">{selectedPost.title}</div>
        <div className="M_mainPostBoxTags">{selectedPost.tags}</div>
        <div className="M_mainPostBoxIsHeart">
          {selectedPost.heart ? <img className="M_mainPostBoxIsHeartImg" src="/img/fullheart.png" alt="Full Heart" /> : <img className="M_mainPostBoxIsHeartImg" src="/img/heart.png" alt="Empty Heart" />}
        </div>
      </div>
    </div>
  </div>
)}
      </Map>
    </div>
  );
}  
export default FollowerMapPage;
