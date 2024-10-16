import React, { useState, useEffect, useRef } from "react";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import axios from "axios";
import useKakaoLoader from "../../components/useKakaoLoader";
import $ from "jquery";
import sigGeoJSON from "../../coor/sig.json";
import sidoGeoJSON from "../../coor/sido.json";
import "../css/MainCss/Main.css";
import MainBtn from "../../components/MainBtn/MainBtn";
import { location } from "../MemberPage/Ro";
import { useNavigate } from "react-router-dom";


const MainPage = () => {
  const [position, setPosition] = useState(null);
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [center, setCenter] = useState({ lat: 36.228503, lng: 127.929344});
  const [zoomLevel, setZoomLevel] = useState(13);
  const mapRef = useRef(null);
  const [userRank, setUserRank] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]); // 검색된 장소 상태 추가
  const [isSmall,setIsSmall] = useState();
  const navigate = useNavigate();

  useKakaoLoader();

  const handleUserClick = (userPk) => {
    navigate(`/FollowerLogPage/${userPk}`);
  };

  const myLocation = () => {
    M.plugin("location").current({
      timeout: 10000,
      maximumAge: 1,
      callback: function (result) {
        if (result.status === 'NS') {
          console.log('This Location Plugin is not supported');
        } else if (result.status !== 'SUCCESS') {
          if (result.message) {
            console.log(result.status + ":" + result.message);
          } else {
            console.log('Getting GPS coords is failed');
          }
        } else {
          if (result.coords) {
            console.log(JSON.stringify(result.coords));
            const newCenter = { lat: result.coords.latitude, lng: result.coords.longitude };
            setZoomLevel(8);
            setCenter(newCenter); // Set to true to move map center
          } else {
            console.log('It cannot get GPS Coords.');
          }
        }
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookie = $.cookie("cookie");
        console.log("쿠키 값:", cookie);

       // const response = await axios.get("/post/map", {
       //   headers: { Authorization: cookie },
       // });
        setPosts(location);
        updateVisiblePosts(location);
        console.log(location);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []);

  const updateVisiblePosts = (posts) => {
    if (zoomLevel >= 10) {
      setVisiblePosts(posts.slice(0, 17));
    } else {
      setVisiblePosts(posts.slice(17));
   
    }
  };

  const updateVisiblePosts123 = () => {
    if (zoomLevel >= 10) {
      setIsSmall(false);
    } else {
       setIsSmall(true);
    }
  };

  useEffect(() => {
    updateVisiblePosts123();
  }, [zoomLevel, posts]);

  useEffect(() => {
    updateVisiblePosts(posts);
  }, [isSmall]);

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
            strokeStyle: "longdash",
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
            strokeStyle: "longdash",
          });
        });
      });
    };

    if (zoomLevel >= 10) {
      displayDistricts(sidoGeoJSON);
    } else {
      displayDistricts2(sigGeoJSON);
    }
  }, [zoomLevel, mapRef]);

  useEffect(() => {
    console.log("Updated Address:", selectedAddress);
  }, [selectedAddress]);

  const handleMarkerClick = async (post) => {
    setSelectedPost(post);
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(post.x, post.y, async (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        const address = result[0].address;
        const simplifiedAddress = `${address.region_1depth_name} ${address.region_2depth_name}`;
        const encodedAddress = encodeURIComponent(simplifiedAddress);
        setSelectedAddress(simplifiedAddress);

        try {
          const cookie = $.cookie("cookie");
          const response = await axios.get(`/user/mapRank/${encodedAddress}`, {
            headers: { Authorization: cookie },
          });
          setUserRank(response.data);
          console.log("User Rank Data:", response.data);
        } catch (error) {
          console.error("Error fetching user rank data:", error);
        }
      } else {
        setSelectedAddress("주소를 찾을 수 없습니다.");
      }
    });
  };

  const handleMarkerClick2 = async (post) => {
    setSelectedPost(post);
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(post.x, post.y, async (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        const address = result[0].address;
        const simplifiedAddress = `${address.region_1depth_name}`;
        console.log(simplifiedAddress);
        const encodedAddress = encodeURIComponent(simplifiedAddress);
        setSelectedAddress(simplifiedAddress);

        try {
          const cookie = $.cookie("cookie");
          const response = await axios.get(`/user/mapRank/${encodedAddress}`, {
            headers: { Authorization: cookie },
          });
          setUserRank(response.data);
          console.log("User Rank Data:", response.data);
        } catch (error) {
          console.error("Error fetching user rank data:", error);
        }
      } else {
        setSelectedAddress("주소를 찾을 수 없습니다.");
      }
    });
  };


  const searchPlaces = () => {
    if (!keyword.trim()) {
      alert("Please enter a keyword!");
      return;
    }

    // 키워드를 포함하는 포스트를 필터링
    const filteredPosts = posts.filter(post =>
      post.tags.includes(keyword)
    );

    if (filteredPosts.length > 0) {
      setVisiblePosts(filteredPosts);
      setPlaces(filteredPosts);
      const firstPlace = filteredPosts[0];
      const newCenter = { lat: firstPlace.y, lng: firstPlace.x };
      setPosition(newCenter);
      setCenter(newCenter);
    } else {
      alert("No search results found.");
      setVisiblePosts([]);
      setPlaces([]);
    }
  };

  return (
    <div className="M_Main">
      <div className="M_MyLogBox">
      </div>
      <div className="M_TopFiveListContaier">
        <img src="/img/HomeMarker.png" className="homeMarker" onClick={myLocation}></img>
      </div>
      <Map
        center={center}
        style={{ width: "100vw", height: "100vh",}}
        level={zoomLevel}
        onZoomChanged={(map) => {
          setZoomLevel(map.getLevel());
          mapRef.current = map;
        }}
        onCreate={(map) => {
          mapRef.current = map;
        }}
      >
        {visiblePosts.length === 17
          ? visiblePosts.map((post, index) => (
              <CustomOverlayMap
                key={`post-${index}`}
                position={{ lat: post.y, lng: post.x }}
                yAnchor={1}
                className="M_Marker"
              >
                <div onClick={() => handleMarkerClick2(post)} style={{ cursor: "pointer" }}>
                  <div>
                    <img src={"/img/Maker.png"} style={{ width: 25, height: 30 }} />
                  </div>
                </div>
              </CustomOverlayMap>
            ))
          : visiblePosts.map((post, index) => (
              <CustomOverlayMap
                key={`post-${index}`}
                position={{ lat: post.y, lng: post.x }}
                yAnchor={1}
                className="M_Marker"
              >
                <div onClick={() => handleMarkerClick(post)} style={{ cursor: "pointer" }}>
                  <div>
                    <img src={"/img/Maker.png"} style={{ width: 25, height: 30 }} />
                  </div>
                </div>
              </CustomOverlayMap>
            ))}
        {selectedPost && (
            <div className="M_MainClickBox">
              <div className="M_mainClickBoxHeader">
                <div className="AreaNameBox">
                <h1 className="AreaText">{selectedAddress} Top 3</h1>
                </div>
                <img className="M_X" src="/img/VectorBlack.png" onClick={() => setSelectedPost(null)} alt="Close" />
              </div>
              {userRank[0] && (
                <div className="M_mainFollowBoxOne" onClick={() => handleUserClick(userRank[0].pk)}>
                  <img className="RankIcon1" src="/img/the first.png" alt="Rank 1" />                  
                  <div className="M_mainFollowleftBox">
                    <img className="M_mainFollowleftImg" src={userRank[0].img_url || "/p.jpg"} alt="User" style={{ width: "70px", height: "70px"}} />
                  </div>
                  <div className="M_mainFollowRight">

                  <div className="M_mainFollowRightuserName">{userRank[0].name}</div>
                    <div className="M_mainFollowRightFollow">{userRank[0].followSum} 팔로워</div>
                  </div>
                </div>
              )}

              {userRank[1] && (
                <div className="M_mainFollowBoxTwo" onClick={() => handleUserClick(userRank[1].pk)}>
                  <img className="RankIcon2" src="/img/the second.png" alt="Rank 2" />

                  <div className="M_mainFollowleftBox">
                    <img className="M_mainFollowleftImg" src={userRank[1].img_url || "/p.jpg"} alt="User" style={{ width: "70px", height: "70px"}} />
                  </div>
                  <div className="M_mainFollowRight">

                  <div className="M_mainFollowRightuserName">{userRank[1].name}</div>
                    <div className="M_mainFollowRightFollow">{userRank[1].followSum} 팔로워</div>
                  </div>
                </div>
              )}

              {userRank[2] && (
                <div className="M_mainFollowBoxThree" onClick={() => handleUserClick(userRank[2].pk)}>
                  <img className="RankIcon3" src="/img/the third.png" alt="Rank 3" />

                  <div className="M_mainFollowleftBox">
                    <img className="M_mainFollowleftImg" src={userRank[2].img_url || "/p.jpg"} alt="User" style={{ width: "70px", height: "70px" }} />
                  </div>
                  <div className="M_mainFollowRight">
                  <div className="M_mainFollowRightuserName">{userRank[2].name}</div>
                    <div className="M_mainFollowRightFollow">{userRank[2].followSum} 팔로워</div>
                  </div>
                </div>
              )}
            </div>
        )}
        
      </Map>
      <div className="PL_searchBoxContainer">
        <div className="PL_searchBoxTitle">우리 동네 대장</div>
        <div className="PL_searchBox">
          <input type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)} 
          placeholder="지역명을 입력하세요"
          className="PL_searchinput"/>
          <img src="/img/search.png" className="PL_searchBtn" onClick={searchPlaces} />
        </div>
      </div>
      {false &&places.length > 0 && (
        <ul className="PL_searchResults">
          {places.map((place, index) => (
            <li key={index} onClick={() => {
              setCenter({ lat: place.y, lng: place.x });
              setSelectedPost(place);
            }}>
              {place.tags}
            </li>
          ))}
        </ul>
      )}
      <MainBtn initialBtnNum={0} className="M_MainBtn" />
    </div>
  );
};

export default MainPage;
