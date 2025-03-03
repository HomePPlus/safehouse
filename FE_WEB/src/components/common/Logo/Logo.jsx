// Logo.js
import React from 'react';
import logoImage from '../../../assets/images/Logo.png';
import LogoText from './LogoText';
import './Logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <img src={logoImage} alt="안주 로고" className="logo-image" />
      <LogoText />
    </div>
  );
};

export default Logo;