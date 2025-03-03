import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Dimensions, Text, Animated } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const DashboardMap = ({ reports = [] }) => {
  const [mapReady, setMapReady] = useState(false);
  const [markersReady, setMarkersReady] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const slideAnim = useState(new Animated.Value(300))[0];

  // 맵 준비 상태 관리
  const handleMapReady = useCallback(() => {
    console.log("✅ 맵 레이아웃 완료");
    setMapReady(true);
  }, []);

  // 마커 데이터 준비
  useEffect(() => {
    if (mapReady && reports.length > 0) {
      console.log("📍 맵 준비됨, 마커 데이터 설정 시작");
      const timer = setTimeout(() => {
        setMarkersReady(true);
        console.log("📍 마커 데이터 설정 완료");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mapReady, reports]);

  // 마커 클릭 핸들러
  const handleMarkerPress = (markerData) => {
    setSelectedMarker(markerData);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // 맵 클릭 시 카드 숨기기
  const handleMapPress = () => {
    Animated.spring(slideAnim, {
      toValue: 300,
      useNativeDriver: true,
    }).start();
    setSelectedMarker(null);
  };

  const initialRegion = {
    latitude: 35.1796,
    longitude: 129.0756,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onLayout={handleMapReady}
        onMapReady={handleMapReady}
        onPress={handleMapPress}
      >
        {/* 부산 시청 기본 마커 */}
        {mapReady && (
          <Marker
            coordinate={{
              latitude: 35.1796,
              longitude: 129.0756,
            }}
            pinColor="#8ABCAD"
            onPress={() =>
              handleMarkerPress({
                title: "부산 시청",
                description: "부산광역시 연제구 중앙대로 1001",
                type: "기준점",
              })
            }
          />
        )}

        {/* 신고/점검 위치 마커들 */}
        {mapReady &&
          markersReady &&
          reports.map((report, index) => {
            const latitude = Number(report.latitude);
            const longitude = Number(report.longitude);

            if (isNaN(latitude) || isNaN(longitude)) {
              return null;
            }

            return (
              <Marker
                key={`marker-${index}-${latitude}-${longitude}`}
                coordinate={{
                  latitude,
                  longitude,
                }}
                pinColor={report.color || "#FF0000"}
                onPress={() => handleMarkerPress(report)}
              />
            );
          })}
      </MapView>

      {/* 마커 정보 카드 */}
      <Animated.View
        style={[
          styles.markerInfoCard,
          {
            transform: [{ translateY: slideAnim }],
            pointerEvents: selectedMarker ? "auto" : "none",
          },
        ]}
      >
        {selectedMarker && (
          <>
            <Text style={styles.cardTitle}>
              {selectedMarker.title || "제목 없음"}
            </Text>
            <Text style={styles.cardDescription}>
              {selectedMarker.description || "설명 없음"}
            </Text>
            <Text style={styles.cardType}>
              유형: {selectedMarker.type || "미지정"}
            </Text>
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 300,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  markerInfoCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 120,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  cardType: {
    fontSize: 14,
    color: "#8ABCAD",
    fontWeight: "500",
  },
});

export default React.memo(DashboardMap);
