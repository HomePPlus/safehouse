import React, { useState, useRef } from "react";
import "./DropDown.css";

const DropDown = ({ options, placeholder, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    onSelect(value);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div 
        className="dropdown-header" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValue || placeholder}
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li
              key={index}
              className={`dropdown-item ${option.className}`}
              onMouseEnter={() => option.onMouseEnter && option.onMouseEnter()}
              onMouseLeave={() => option.onMouseLeave && option.onMouseLeave()}
              onClick={() => handleSelect(option.value)}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
