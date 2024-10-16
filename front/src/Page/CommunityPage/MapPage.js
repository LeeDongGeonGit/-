import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useLocation, useNavigate } from 'react-router-dom';
import "../css/CommunityCss/MapPage.css"; // MapPage.css 사용

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [center, setCenter] = useState({ lat: 33.450701, lng: 126.570667 });
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=b3328ab13a52f1941daabe34a2cdcf6c&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
        if (location.state && location.state.coords) {
          setCenter(location.state.coords);
        }
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [location]);

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="MM_Main">
      <div className="MM_searchBoxContainer">
        <img onClick={handleClose} className="MyMap_X" src="/img/Vector Black.png" alt="back" />
        <h1 className="MM_MyMap">Post Map</h1>
      </div>

      {mapLoaded && (
        <Map center={center} style={{ width: '100%', height: '100vh' }}>
          <MapMarker position={center} image={{ src: '/img/Maker.png', size: { width: 36, height: 40 }, options: { offset: { x: 18, y: 36 } }}}/>
        </Map>
      )}
    </div>
  );
};

export default MapPage;