// src/components/layout/Layout.jsx
import React from 'react';
import ParticleBackground from '../particle/ParticleBackground';

const Layout = ({ children }) => {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <ParticleBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>
    );
  };
  
export default Layout;
