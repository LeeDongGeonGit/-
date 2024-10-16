import React, { useState, useEffect, useRef } from "react";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk"; // 카카오 지도 SDK 컴포넌트
import axios from "axios"; // HTTP 요청을 위한 라이브러리
import useKakaoLoader from "../../components/useKakaoLoader"; // 카카오 지도 API 로딩을 위한 사용자 정의 훅
import $ from "jquery"; // jQuery 라이브러리
import {} from "jquery.cookie"; // jQuery로 쿠키 관리를 위한 플러그인
import sigGeoJSON from "../../coor/sig.json";  // 행정 구역 경계 데이터
import sidoGeoJSON from "../../coor/sido.json";  // 행정 도 경계 데이터
import "../css/CommunityCss/MapWithMarkers.css";

const MapWithMarkers = () => {
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
        const response = await axios.get("/post/map", { headers: { Authorization: $.cookie("cookie") } });
        setPosts(response.data.posts);
        updateVisiblePosts(response.data.posts);  // 초기 포스트를 바탕으로 보여질 포스트 업데이트
        console.log(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []);

  // 보이는 포스트 업데이트 함수
  const updateVisiblePosts = (posts) => {
    if (zoomLevel >= 10) {
      setVisiblePosts(posts.filter((_, index) => index % 45 === 0).slice(0, 5));
    } else {
      setVisiblePosts(posts);
    }
  };

  // 줌 레벨이나 포스트 변경 시 보이는 포스트 업데이트
  useEffect(() => {
    updateVisiblePosts(posts);
  }, [zoomLevel, posts]);

  // 줌 레벨에 따라 지도에 폴리곤 표시
  useEffect(() => {
    if (!mapRef.current) return;

    const displayDistricts = (geoJSON) => {
      geoJSON.features.forEach((feature) => {
        feature.geometry.coordinates.forEach((polygon) => {
          const path = polygon.map((point) => new window.kakao.maps.LatLng(point[1], point[0]));
          new window.kakao.maps.Polygon({
            map: mapRef.current,
            path: path,
            strokeWeight: 3,
            strokeColor: "#39DE2A",
            strokeOpacity: 0.1,
            strokeStyle: "longdash"
          });
        });
      });
    };
    const displayDistricts2 = (geoJSON) => {
      geoJSON.features.forEach((feature) => {
        feature.geometry.coordinates.forEach((polygon) => {
          const path = polygon.map((point) => new window.kakao.maps.LatLng(point[1], point[0]));
          new window.kakao.maps.Polygon({
            map: mapRef.current,
            path: path,
            strokeWeight: 3,
            strokeColor: "#004c80",
            strokeOpacity: 0.1,
            strokeStyle: "longdash"
          });
        });
      });
    };

    // 줌 레벨에 따라 사용할 GeoJSON 선택
    if (zoomLevel >= 10) {
      displayDistricts(sidoGeoJSON);
    } else {
      displayDistricts2(sigGeoJSON);
      //둘다뜨니까 투명도를 조정하는 함수가 필요할거같음
    }
  }, [zoomLevel, mapRef]);

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
        <CustomOverlayMap
          key={`post-${index}`}
          position={{ lat: post.y_coordinate, lng: post.x_coordinate }}
          yAnchor={1}
        >
          <div onClick={() => handleMarkerClick(post)} style={{ cursor: 'pointer' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #fff',
              boxShadow: '0 0 5px rgba(0,0,0,0.3)',
            }}>
              <img
                src={post.user?.img_url || '/Logo2.png'}
                alt="User"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </CustomOverlayMap>
      ))}
      {selectedPost && (
        <CustomOverlayMap position={{ lat: selectedPost.y_coordinate, lng: selectedPost.x_coordinate }}>
          <div className="M_mainClickBox" style={{ position: "absolute", backgroundColor: "white", border: "1px solid black", padding: "5px", maxWidth: "300px", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000 }}>
            <img className="M_X" src="/img/VectorBlack.png" onClick={() => setSelectedPost(null)} alt="Close" />
            <div className="M_mainPostBox">
              <div className="M_mainPostBoxleft">
                <img className="M_mainPostImg" src={selectedPost.img_url || '/img/placeholder.png'} alt="Post" style={{ width: "100%" }} />
              </div>
              <div className="M_mainPostBoxRight">
                <div className="M_mainPostBoxTitle">{selectedPost.title}</div>
                <div className="M_mainPostBoxTags">{selectedPost.tags}</div>
                <div className="M_mainPostBoxisheart">
                  {selectedPost.heart ? <img src="/img/fullheart.png" alt="Heart" /> : <img src="/img/heart.png" alt="Heart" />}
                </div>
              </div>
            </div>
            <div className="M_mainFollowBox">
              <div className="M_mainFollowleft">
                <img className="M_mainFollowleftImg" src={selectedPost.user?.img_url || '/img/userPlaceholder.png'} alt="User" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
              </div>
              <div className="M_mainFollowRight">
                <div className="M_mainFollowRightName">{selectedPost.user.name}</div>
                <div><button className="M_mainFollowRightBtn">팔로우</button></div>
              </div>
            </div>
          </div>
        </CustomOverlayMap>
      )}
    </Map>
  );
};

export default MapWithMarkers;