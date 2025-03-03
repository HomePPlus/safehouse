import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, isInspector } from "../../utils/auth";

const ProtectedInspectorRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/auth" />;
  }

  if (!isInspector()) {
    // INSPECTOR가 아닌 경우 홈페이지로 리다이렉트
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedInspectorRoute;
