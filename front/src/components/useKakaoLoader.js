import { useState, useEffect } from "react";
import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

export default function useKakaoLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useKakaoLoaderOrigin({
    appkey: "b3328ab13a52f1941daabe34a2cdcf6c",
    libraries: ["clusterer", "drawing", "services"],
    onload: () => setIsLoaded(true)  // 스크립트 로드 완료 시 상태 업데이트
  });

  return isLoaded;
}
