import React, { useEffect, useState } from "react";
import "./AppCardComponent.css";

const AppCardComponent = ({ title, subtitle, imageUrl, isPreview = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const card = document.querySelector(".app-card");
    
    setTimeout(() => {
      setIsVisible(true);
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }, 100);

    if (!isPreview) {  // preview 페이지가 아닐 때만 3D 효과 적용
      const handleMouseMove = (event) => {
        if (!isVisible) return;

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const rotateX = ((event.clientY - centerY) / (window.innerHeight / 2)) * 50;
        const rotateY = ((event.clientX - centerX) / (window.innerWidth / 2)) * 50;
        
        card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
      };

      const handleMouseLeave = () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      };

      document.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isVisible, isPreview]);

  return (
    <div className={`app-card-perspective ${isPreview ? 'preview-mode' : ''}`}>
      <div className="app-card">
        <div
          className="app-card-thumb"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        ></div>
        <h2 className="app-card-title">{title}</h2>
        <span className="app-card-subtitle">{subtitle}</span>
      </div>
    </div>
  );
};

export default AppCardComponent;
