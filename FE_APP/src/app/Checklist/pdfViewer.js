import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';

const BASE_URL =
  "https://safehouse-spring-c6eqdvexevhhg6de.koreacentral-01.azurewebsites.net";

const PDFViewer = () => {
  const route = useRoute();
  const { pdfUrl } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("📂 원본 PDF URL:", pdfUrl);

  if (!pdfUrl) {
    return (
      <Text style={styles.errorText}>📂 PDF 파일을 불러올 수 없습니다.</Text>
    );
  }

  // 절대 URL 생성
  const absoluteUrl = pdfUrl.startsWith("http") ? pdfUrl : `${BASE_URL}${pdfUrl}`;
  console.log("📂 최종 PDF URL:", absoluteUrl);

  // Google Docs Viewer URL 생성
  const googleDocsUrl = `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(absoluteUrl)}`;

  // PDF 다운로드 함수
  const handleDownload = async () => {
    try {
      await Linking.openURL(absoluteUrl);
    } catch (error) {
      console.error("다운로드 오류:", error);
      setError("PDF 다운로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 다운로드 버튼 */}
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <MaterialIcons name="file-download" size={24} color="white" />
        <Text style={styles.downloadButtonText}>PDF 다운로드</Text>
      </TouchableOpacity>

      {/* PDF 뷰어 */}
      <View style={styles.webviewContainer}>
        {loading && !error && (
          <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
        )}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <WebView
            source={{ uri: googleDocsUrl }}
            style={styles.webview}
            originWhitelist={['*']}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadStart={() => {
              console.log("🔄 PDF 로딩 시작");
              setLoading(true);
            }}
            onLoad={() => {
              console.log("✅ PDF 로딩 완료");
              setLoading(false);
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("🚨 PDF 로딩 오류:", nativeEvent);
              setError("PDF 파일을 로드하는 데 오류가 발생했습니다.");
              setLoading(false);
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: 'red',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  }
});

export default PDFViewer;
