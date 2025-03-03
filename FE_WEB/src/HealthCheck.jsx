import React, { useEffect, useState } from "react";
import { checkServerHealth } from "./api/apiClient";
import { getToken, decodeToken } from "./utils/auth";

function HealthCheck() {
  const [isServerHealthy, setIsServerHealthy] = useState(false);

  useEffect(() => {
    // 서버 상태 체크
    checkServerHealth().then((isHealthy) => {
      setIsServerHealthy(isHealthy);
    });

    // 토큰 및 유저 정보 확인
    const token = getToken();
    console.log("토큰:", token);

    const userInfo = decodeToken();
    console.log("유저 정보:", userInfo);
  }, []);

  return <div>{isServerHealthy ? "서버 연결 성공" : "서버 연결 실패"}</div>;
}

export default HealthCheck;
