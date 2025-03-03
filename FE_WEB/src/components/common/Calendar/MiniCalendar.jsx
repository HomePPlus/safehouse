// MiniCalendar.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import './MiniCalendar.css';

const MiniCalendar = ({ onDateClick }) => {
  const [value, onChange] = useState(new Date());
  const [isDarkMode] = useState(false);

  return (
    <div className={`calendar-wrapper ${isDarkMode ? 'dark-mode' : ''}`}>
      <Calendar
        onChange={onChange}
        value={value}
        view="month"
        prevLabel={<MdChevronLeft size={24} />}
        nextLabel={<MdChevronRight size={24} />}
        navigationLabel={({ date }) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
        onClickDay={onDateClick}
      />
    </div>
  );
};

export default MiniCalendar;
