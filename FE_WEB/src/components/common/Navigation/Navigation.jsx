import React, { useState } from "react";
import { Link } from "react-router-dom";
import SvgBorder from "./SvgBorder";
import "./Navigation.css";

const Navigation = ({ links }) => {
  const [active, setActive] = useState(null);

  return (
    <nav className="nav">
      {links.map(({ url, label, onClick }, index) => (
        <Link
          key={index}
          to={url}
          className={`nav-item ${active === index ? 'is-active' : ''} ${
            label === '로그인' ? 'login-button' : ''
          }`}
          onClick={onClick}
        >
          <SvgBorder />
          <SvgBorder />
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
