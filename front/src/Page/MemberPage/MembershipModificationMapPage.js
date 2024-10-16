import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useNavigate, useLocation } from "react-router-dom";
import useKakaoLoader from "../../components/useKakaoLoader";
import "../css/CommunityCss/PostLocation.css"; // Same CSS as PostLocationPage

export default function MembershipModificationMapPage() {
  useKakaoLoader();
  const location = useLocation();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.450701, lng: 126.570667 }); // Default center
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null); // New state to handle selected marker
  const [moveToCenter, setMoveToCenter] = useState(false); // New state to handle center movement
  const prevData = location.state?.userInfo;

  useEffect(()=>{
    myLocation();
  },[])
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
            setPosition(newCenter);
            setMapCenter(newCenter);
            setMoveToCenter(true); // Set to true to move map center
          } else {
            console.log('It cannot get GPS Coords.');
          }
        }
      }
    });
  };

  const searchPlaces = () => {
    if (!keyword.trim()) {
      alert("Please enter a keyword!");
      return;
    }

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data);
        if (data.length > 0) {
          const firstPlace = data[0];
          const newCenter = { lat: firstPlace.y, lng: firstPlace.x };
          setPosition(newCenter);
          if (moveToCenter) {
            setMapCenter(newCenter);
          }
        }
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("No search results found.");
        setPlaces([]);
      } else {
        alert("An error occurred during the search.");
      }
    });
  };

  const handleMarkerClick = (placeId, lat, lng) => {
    setSelectedMarkerId(placeId);
    setPosition({ lat, lng });
    // Only update map center if moveToCenter is true
    if (moveToCenter) {
      setMapCenter({ lat, lng });
      setMoveToCenter(false); // Reset to false after moving center
    }
  };

  const handleRegisterClick = async () => {
    if (position && selectedMarkerId !== null) {
      try {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const addressPromise = await new Promise((resolve, reject) => {
          geocoder.coord2Address(position.lng, position.lat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              console.log(result[0].address.address_name);
              resolve(result[0].address.address_name);
            } else {
              reject("주소를 찾을 수 없습니다.");
            }
          });
        });

        const mapInfo = {
          ...prevData,
          x_coordinate: position.lng,
          y_coordinate: position.lat,
          address: addressPromise,
        };

        console.log("Updated Post Data:", mapInfo);
        navigate("/MembershipModificationPage", { state: { mapInfo } }); // Navigate after async operation
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else {
      alert("위치를 선택한 후 등록 버튼을 클릭하세요.");
    }
  };

  const PostLocationMapBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="PL_Main" style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div className="PL_img">
        
      </div>
      <Map
        id="map"
        center={mapCenter}
        style={{ width: "100%", height: "100%" }}
        level={3}
        onClick={(_, mouseEvent) => {
          const latlng = mouseEvent.latLng;
          setPosition({
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          });
          // Do not update map center on map click
          setSelectedMarkerId(null); // Reset selected marker when map is clicked
        }}
      >
        {position && (
          <MapMarker
            position={position}
            onClick={() => handleMarkerClick("initial", position.lat, position.lng)}
            image={{
              src: selectedMarkerId === "initial" ? "/img/MarkerChange.png" : "/img/Maker.png", // Change image conditionally
              size: { width: 25, height: 30 },
            }}
          />
        )}
        {places.map((place) => (
          <MapMarker
            key={place.id}
            position={{ lat: place.y, lng: place.x }}
            onClick={() => handleMarkerClick(place.id, place.y, place.x)}
            image={{
              src: selectedMarkerId === place.id ? "/img/MarkerChange.png" : "/img/Maker.png", // Change image conditionally
              size: { width: 25, height: 30 },
            }}
          />
        ))}
      </Map>

      <div className="PL_searchBoxContainer">
        <img onClick={PostLocationMapBackClick} className="Map_X" src="/img/Vector Black.png" alt="back" />
        <div className="PL_searchBoxTitle">주소 찾기</div>
        <div className="PL_searchBox">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="PL_searchinput"
          />
          <img src="/img/search.png" className="PL_searchBtn" onClick={searchPlaces} />
        </div>
      </div>

      {places.length > 0 && (
        <ul className="PL_searchResults">
          {places.map((place, index) => (
            <li key={index} onClick={() => setPosition({ lat: place.y, lng: place.x })}>
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={handleRegisterClick}
        className="PL_RegistrationBtn"
      >
        등록
      </button>
      <div className="PL_positionBox">
        <img src="/img/position4.png" onClick={() => { myLocation(); setMoveToCenter(true); }} className="PL_questionClick"></img>
      </div>    
    </div>
  );
}