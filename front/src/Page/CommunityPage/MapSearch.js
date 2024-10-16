/* global kakao */

import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useKakaoLoader from "../../components/useKakaoLoader";
import "../css/CommunityCss/MapSearch.css";

const MapSearch = () => {
  const [map, setMap] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const isKakaoLoaded = useKakaoLoader();

  const searchPlaces = () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    const ps = new kakao.maps.services.Places(map);
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setPlaces(data);
        setShowSearch(true);
        if (data.length > 0) {
          moveToMarker(data[0].y, data[0].x); // 첫 번째 검색 결과로 이동
        }
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else {
        alert('검색 중 오류가 발생했습니다.');
      }
    });
  };

  const moveToMarker = (lat, lng) => {
    const moveLatLon = new kakao.maps.LatLng(lat, lng);
    map.setCenter(moveLatLon);
  };

  useEffect(() => {
    if (isKakaoLoaded && map) {
      // 초기 로딩 시 자동으로 검색하지 않음
    }
  }, [isKakaoLoaded, map]);

  return (
    <div className="map_wrap">
      <Map
        center={{ lat: 37.566826, lng: 126.9786567 }}
        style={{ width: "100%", height: "500px" }}
        level={3}
        onCreate={setMap}
      >
        {places.map((place, index) => (
          <MapMarker
            key={`marker-${index}`}
            position={{ lat: place.y, lng: place.x }}
            onClick={() => alert(place.place_name)}
          />
        ))}
        <div className="searchButton" onClick={() => setShowSearch(true)}>검색하기</div>
      </Map>
      {showSearch && (
        <div id="menu_wrap" className="bg_white">
          <button onClick={() => setShowSearch(false)}>닫기</button>
          <div className="option">
            <form onSubmit={(e) => {
              e.preventDefault();
              searchPlaces();
            }}>
              키워드: <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} size="15" />
              <button type="submit">검색 실행</button>
            </form>
          </div>
          <hr />
          <ul id="placesList">
            {places.map((place, index) => (
              <li key={index} className="item" onClick={() => moveToMarker(place.y, place.x)}>
                <span className={`markerbg marker_${index + 1}`}></span>
                <div className="info">
                  <h5>{place.place_name}</h5>
                  <span>{place.road_address_name || place.address_name}</span>
                  {place.phone && <span className="tel">{place.phone}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapSearch;
