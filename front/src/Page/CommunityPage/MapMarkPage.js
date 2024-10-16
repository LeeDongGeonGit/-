import React, { useState, useEffect, useRef } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk"; // 카카오 지도 SDK 컴포넌트
import axios from "axios"; // HTTP 요청을 위한 라이브러리
import useKakaoLoader from "../../components/useKakaoLoader"; // 카카오 지도 API 로딩을 위한 사용자 정의 훅
import $ from "jquery"; // jQuery 라이브러리
import {} from "jquery.cookie"; // jQuery로 쿠키 관리를 위한 플러그인

const MapMarkPage = () => {
  const [posts, setPosts] = useState([]); // 지도에 표시할 포스트 데이터
  const [visiblePosts, setVisiblePosts] = useState([]); // 현재 지도에 보이는 포스트
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 포스트
  const [selectedAddress, setSelectedAddress] = useState(""); // 선택된 주소
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 지도 중심 위치
  const [zoomLevel, setZoomLevel] = useState(3); // 지도 줌 레벨
  const mapRef = useRef(null); // 지도 인스턴스를 저장하기 위한 ref

  useKakaoLoader(); // 카카오 지도 API 로드

  // 포스트 데이터를 가져오는 부분
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/post/myMap", { headers: { Authorization: $.cookie("cookie") } });
        setPosts(response.data.posts);
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

  return (
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
          position={{ lat: post.x_coordinate, lng: post.y_coordinate }}
          onClick={() => handleMarkerClick(post)}
          image={{ src: '/img/Maker.png', size: { width: 36, height: 40 }, options: { offset: { x: 18, y: 36 } }}}
        />
      ))}
      {selectedPost && (
        <CustomOverlayMap position={{ lat: selectedPost.x_coordinate, lng: selectedPost.y_coordinate }}>
          <div style={{ position: "absolute", backgroundColor: "white", border: "1px solid black", padding: "5px", maxWidth: "300px", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 1000 }}>
            <img className="ML_X" src="/img/VectorBlack.png" onClick={() => setSelectedPost(null)} alt="Close" />
            <div>제목: {selectedPost.title}</div>
            <div>태그: {selectedPost.tags}</div>
            <img src={selectedPost.img_url || '/img/placeholder.png'} alt="Post" style={{ width: "100%" }} />
            <div>작성자: {selectedPost.user.name}</div>
            <img src={selectedPost.user.img_url || '/img/userPlaceholder.png'} alt="User" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
          </div>
        </CustomOverlayMap>
      )}
    </Map>
  );
};

export default MapMarkPage;
