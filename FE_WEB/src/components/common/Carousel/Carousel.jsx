import React, { useState } from "react";
import { TiChevronLeftOutline, TiChevronRightOutline } from "react-icons/ti";
import "./Carousel.css";

const Card = ({ imageUrl, title, result, index, onTest, isLoading }) => (
  <div className="card">
    <h2>{title}</h2>
    <div className="card-image-container">
      <img src={imageUrl} alt={title} className="card-image" loading="lazy" />
      <div className="result-overlay">
        {result && (
          <div className={`result-box ${result.error ? "error" : ""}`}>
            {result.error ? (
              <span>❌ {result.error}</span>
            ) : (
              <>
                <span>{result.defectType}</span>
                <div className="confidence">신뢰도: {result.confidence}%</div>
              </>
            )}
          </div>
        )}
      </div>
      <button
        className="test-button"
        aria-label={`${title} 이미지 검사 시작`}
        onClick={() => onTest(index)}
        disabled={isLoading}
      >
        {isLoading ? "검사 중..." : "이 이미지 검사"}
      </button>
    </div>
  </div>
);

const Carousel = ({ children }) => {
  const [active, setActive] = useState(2);
  const count = React.Children.count(children);

  return (
    <div className="carousel">
      {active > 0 && (
        <button
          className="carousel-nav left"
          onClick={() => setActive((i) => i - 1)}
        >
          <TiChevronLeftOutline />
        </button>
      )}
      {React.Children.map(children, (child, i) => (
        <div
          className="card-container"
          style={{
            "--active": i === active ? 1 : 0,
            "--offset": (active - i) / 3,
            "--direction": Math.sign(active - i),
            "--abs-offset": Math.abs(active - i) / 3,
            pointerEvents: active === i ? "auto" : "none",
            opacity: Math.abs(active - i) >= 3 ? "0" : "1",
            display: Math.abs(active - i) > 3 ? "none" : "block",
          }}
        >
          {child}
        </div>
      ))}
      {active < count - 1 && (
        <button
          className="carousel-nav right"
          onClick={() => setActive((i) => i + 1)}
        >
          <TiChevronRightOutline />
        </button>
      )}
    </div>
  );
};

export { Card, Carousel };
