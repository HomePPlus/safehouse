import { useState, useEffect } from "react";
import "./SliderToggle.css";

const SliderToggle = ({ onToggle, initialMode }) => {
  // initialMode가 'mine'일 때 false로 설정 (나의 게시글이 기본)
  const [isChecked, setIsChecked] = useState(initialMode === "all");

  useEffect(() => {
    setIsChecked(initialMode === "all");
  }, [initialMode]);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onToggle(newState);
  };

  return (
    <div className="sliderToggle-wrapper">
      <span className="sliderToggle-label">나의 게시글</span>
      <div className="toggle-wrapper">
        <input className="toggle-checkbox" type="checkbox" checked={isChecked} onChange={handleToggle} />
        <div className="toggle-container">
          <div className="toggle-button">
            <div className="toggle-button-circles-container">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="toggle-button-circle" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="sliderToggle-label">전체 게시글</span>
    </div>
  );
};

export default SliderToggle;
