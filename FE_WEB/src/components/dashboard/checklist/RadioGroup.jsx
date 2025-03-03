import React from 'react';
import './RadioGroup.css';

const RadioGroup = ({ title, name, options, value, onChange }) => {
  return (
    <div className="radio-group">
      <div className="radio-group-title">{title}</div>
      <div className="radio-options">
        {options.map((option) => (
          <div 
            key={option} 
            className={`radio-option ${value === option ? 'selected' : ''}`}
          >
            <input
              type="radio"
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
            />
            <label htmlFor={`${name}-${option}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
