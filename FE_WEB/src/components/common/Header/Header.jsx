import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import Navigation from "../Navigation/Navigation";
import {
  getToken,
  removeToken,
  getUserInfo,
  isInspector,
  removeUserType,
} from "../../../utils/auth";
import { logout } from "../../../api/apiClient";
import Cookies from "js-cookie";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useAlert } from '../../../contexts/AlertContext';

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(getToken());
  const [isInspectorUser, setIsInspectorUser] = useState(isInspector());
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    setLoggedIn(getToken());
    setIsInspectorUser(isInspector());
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      removeToken();
      removeUserType();
      Cookies.remove("email");
      Cookies.remove("userId");
      setLoggedIn(false);
      setIsInspectorUser(false);
      await showAlert('로그아웃 되었습니다.', 'success');
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      await showAlert('로그아웃 중 오류가 발생했습니다.', 'error');
    }
  };

  const navLinks = [
    { url: "/report/list", label: "신고하기" },
    { url: "/community", label: "커뮤니티" },
    {
      url: loggedIn ? "#" : "/auth",
      label: loggedIn ? "로그아웃" : "로그인",
      onClick: loggedIn ? handleLogout : null,
    },
    {
      url: isInspectorUser ? "/dashboard" : "/app-preview",
      label: isInspectorUser ? "대시보드" : "앱",
    },
  ];

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <Logo />
        </Link>
      </div>
      <div className="header-right">
        <Navigation links={navLinks} />
      </div>
    </header>
  );
};

export default Header;
