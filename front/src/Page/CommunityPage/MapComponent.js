import React, { useEffect, useRef, useState } from "react";
import useKakaoLoader from "../../components/useKakaoLoader";
import { Map } from 'react-kakao-maps-sdk';
import sigGeoJSON from "../../coor/sig.json";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useKakaoLoader(() => setIsMapLoaded(true));

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      console.log("Map not loaded or mapRef not available.");
      return;
    }

    console.log("Map is loaded, and mapRef is available.");

    const displayDistricts = () => {
      sigGeoJSON.features.forEach((feature) => {
        // 폴리곤 처리를 위한 최상위 배열 접근
        feature.geometry.coordinates.forEach((polygon) => {
          // 하위 폴리곤 배열 처리
          const path = polygon.map((point) => {
            return new window.kakao.maps.LatLng(point[1], point[0]);
          });

          const polygonInstance = new window.kakao.maps.Polygon({
            map: mapRef.current,
            path: path,
            strokeWeight: 3,
            strokeColor: "#39DE2A",
            strokeOpacity: 0.8,
            strokeStyle: "longdash",
            fillColor: "#A2FF99",
            fillOpacity: 0.7
          });

          console.log("Polygon path:", path);
          console.log("Polygon instance created:", polygonInstance);
        });
      });
    };

    displayDistricts();
  }, [isMapLoaded]);

  return (
    <Map
      center={{ lat: 36.5, lng: 127.5 }}
      style={{ width: "100%", height: "400px" }}
      level={7}
      onCreate={(map) => {
        mapRef.current = map;
        setIsMapLoaded(true);
        console.log("Map created and mapRef set.");
      }}
    />
  );
};

export default MapComponent;
