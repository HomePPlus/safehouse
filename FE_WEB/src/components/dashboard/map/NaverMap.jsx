// NaverMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import { getInspectionReports } from '../../../api/apiClient';
import '../dashboardCommon.css';
import './NaverMap.css';

const NaverMap = () => {
  // 상태 관리
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 주소를 좌표로 변환하는 함수
  const getCoordinatesFromAddress = async (address) => {
    return new Promise((resolve, reject) => {
      if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
        reject(new Error('Naver Maps Service is not loaded'));
        return;
      }

      window.naver.maps.Service.geocode(
        {
          query: address,
        },
        function (status, response) {
          if (status === window.naver.maps.Service.Status.ERROR) {
            reject(new Error('Geocoding failed'));
            return;
          }
          if (response.v2.meta.totalCount === 0) {
            reject(new Error('No results found'));
            return;
          }
          const item = response.v2.addresses[0];
          const point = new window.naver.maps.LatLng(item.y, item.x);
          resolve(point);
        }
      );
    });
  };

  // 점검 목록을 가져와서 마커 생성
  const createMarkers = async () => {
    try {
      const response = await getInspectionReports();
      const inspections = response.data.data;

      // 기존 마커 제거
      markers.forEach((marker) => marker.setMap(null));
      const newMarkers = [];

      // 첫 번째 유효한 주소를 찾기 위한 변수
      let firstValidAddress = null;

      for (const inspection of inspections) {
        const reportInfo = inspection.report_info || {};
        const address = reportInfo.detail_address; // 점검의 주소

        if (address) { // 주소가 존재할 경우
          if (!firstValidAddress) {
            firstValidAddress = address; // 첫 번째 유효한 주소 저장
          }

          // 주소를 좌표로 변환하여 마커 생성
          const position = await getCoordinatesFromAddress(address);
          const marker = new window.naver.maps.Marker({
            position,
            map: map,
            title: reportInfo.description,
          });

          // 정보창 생성
          const infoWindow = new window.naver.maps.InfoWindow({
            content: `
              <div class="info-window">
                <h3>점검 정보</h3>
                <p><strong>상태:</strong> ${inspection.status}</p>
                <p><strong>유형:</strong> ${reportInfo.defect_type}</p>
                <p><strong>설명:</strong> ${reportInfo.description}</p>
                <p><strong>주소:</strong> ${address}</p>
              </div>
            `,
          });

          // 마커 클릭 이벤트
          window.naver.maps.Event.addListener(marker, 'click', () => {
            if (infoWindow.getMap()) {
              infoWindow.close();
            } else {
              infoWindow.open(map, marker);
            }
          });

          newMarkers.push(marker); // 새로운 마커 추가
        }
      }

      // 유효한 주소가 있을 경우 구청 마커 추가
      if (firstValidAddress) {
        const district = firstValidAddress.split(' ')[1]; // 예: "부산 해운대구"에서 "해운대구" 추출
        console.log(`추출된 구: ${district}`); // 구 로깅

        const districtOfficePosition = getDistrictOfficePosition(district); // 구청의 좌표 가져오기

        if (districtOfficePosition) {
          console.log(`구청 좌표: ${districtOfficePosition}`); // 구청 좌표 로깅
          const districtOfficeMarker = new window.naver.maps.Marker({
            position: districtOfficePosition,
            map: map,
            title: `${district}청`,
          });
          newMarkers.push(districtOfficeMarker); // 구청 마커 추가

          // 지도 중심을 구청 좌표로 설정
          map.setCenter(districtOfficePosition);
        }
      } else {
        console.warn('신고된 주소가 없습니다. 구청 마커를 설정할 수 없습니다.');
      }

      setMarkers(newMarkers); // 모든 마커 설정
    } catch (error) {
      console.error('점검 목록 로딩 실패:', error);
      setError('점검 위치를 불러오는데 실패했습니다.');
    }
  };

  // 구청의 좌표를 반환하는 함수
  const getDistrictOfficePosition = (district) => {
    const districtOffices = {
      '해운대구': new window.naver.maps.LatLng(35.1637221, 129.1847032), // 해운대구청 좌표
      '부산진구': new window.naver.maps.LatLng(35.1595, 129.0592), // 부산진구청 좌표
      '서면구': new window.naver.maps.LatLng(35.1595, 129.0592), // 서면구청 좌표 (예시)
      '동래구': new window.naver.maps.LatLng(35.2023, 129.0755), // 동래구청 좌표
      '남구': new window.naver.maps.LatLng(35.1304, 129.0865), // 남구청 좌표
      '북구': new window.naver.maps.LatLng(35.1975, 129.0015), // 북구청 좌표
      '영도구': new window.naver.maps.LatLng(35.0665, 129.4000), // 영도구청 좌표
      '사하구': new window.naver.maps.LatLng(35.0965, 128.9930), // 사하구청 좌표
      '금정구': new window.naver.maps.LatLng(35.2325, 129.0865), // 금정구청 좌표
      '강서구': new window.naver.maps.LatLng(35.1745, 128.9470), // 강서구청 좌표
      '기장군': new window.naver.maps.LatLng(35.2395, 129.2270), // 기장군청 좌표
      '수영구': new window.naver.maps.LatLng(35.1500, 129.1160), // 수영구청 좌표
      '사상구': new window.naver.maps.LatLng(35.1395, 128.9790), // 사상구청 좌표
      '중구': new window.naver.maps.LatLng(35.1025, 129.0400), // 중구청 좌표
      '동구': new window.naver.maps.LatLng(35.1293, 129.0453)
      // 추가적인 구청 좌표를 여기에 추가할 수 있습니다.
    };

    return districtOffices[district] || null; // 해당 구청의 좌표 반환, 없으면 null
  };

  // 네이버 지도 초기화
  useEffect(() => {
    const loadNaverMap = () => {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
      script.async = true;

      script.onerror = () => {
        setError('지도를 불러오는데 실패했습니다.');
        setLoading(false);
      };

      script.onload = () => {
        if (!window.naver || !window.naver.maps) {
          setError('네이버 지도 API를 초기화하는데 실패했습니다.');
          setLoading(false);
          return;
        }

        const busanCityHall = new window.naver.maps.LatLng(35.1798159, 129.0750222);
        const mapInstance = new window.naver.maps.Map(mapRef.current, {
          center: busanCityHall,
          zoom: 14,
          zoomControl: true,
          zoomControlOptions: {
            style: window.naver.maps.ZoomControlStyle.SMALL,
            position: window.naver.maps.Position.TOP_LEFT,
            legendDisabled: true
          },
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT
          }
        });

        setMap(mapInstance);
        setLoading(false);
      };

      document.head.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    loadNaverMap();
  }, []);

  // 마커 생성 effect
  useEffect(() => {
    if (map) {
      createMarkers();
    }
  }, [map]);

  return (
    <div className="dashboard-section">
      <div className="content-section">
        <div className="header-section map-title">
          <h2 className="section-title eMedium map-title">부산시 신고 위치</h2>
        </div>
        <div className="map-content-wrapper">
          {loading && <div className="loading">지도를 불러오는 중...</div>}
          {error && <div className="error">{error}</div>}
          <div ref={mapRef} className="naver-map" />
        </div>
      </div>
    </div>
  );
};

export default NaverMap;
