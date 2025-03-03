import React, { useEffect, useState, useRef } from 'react';
import './SvgBorder.css';

let svgBorderInstance = 0;

const SvgBorder = () => {
  const [rect, setRect] = useState({});
  const [clipPathId, setClipPathId] = useState('');
  const elementRef = useRef(null);

  useEffect(() => {
    svgBorderInstance++;
    setClipPathId(`svg-border-cp-${svgBorderInstance}`);
    getRect();

    const events = ['load', 'DOMContentLoaded', 'resize', 'orientationchange'];
    events.forEach(event => window.addEventListener(event, debounce(getRect, 1000)));

    return () => {
      events.forEach(event => window.removeEventListener(event, debounce(getRect, 1000)));
    };
  }, []);

  const getRect = () => {
    if (elementRef.current && elementRef.current.parentNode) {
      setRect(elementRef.current.parentNode.getBoundingClientRect());
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const width = Math.round(rect.width || 0);
  const height = Math.round(rect.height || 0);
  const viewBox = `0 0 ${width} ${height}`;

  const path = [
    `M ${width/2} ${height}`,
    `h ${(width-height)/2}`,
    `a ${height/2} ${height/2} 0 1 0 0 ${height*-1}`,
    `h ${(width-height)*-1}`,
    `a ${height/2} ${height/2} 0 1 0 0 ${height}`,
    `h ${(width-height)/2}`,
  ].join(' ');

  return (
    <svg 
      className="svg-border" 
      viewBox={viewBox} 
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      ref={elementRef}
    >
      <clipPath id={clipPathId}>
        <path d={path} />
      </clipPath>
      <path 
        clipPath={`url(#${clipPathId})`}
        d={path} 
        fill="none"
        pathLength="100" 
      />
    </svg>
  );
};

export default SvgBorder;
