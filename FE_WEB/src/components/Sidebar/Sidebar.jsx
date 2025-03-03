// Sidebar.jsx
import React, { useState, useRef } from 'react';
import {
  MdDashboard,
  MdShowChart,
  MdAssignment,
  MdCheckCircle,
  MdFeedback,
  MdPeople,
  MdPalette,
} from 'react-icons/md'; // Material Design 아이콘 사용
import { LuChevronsLeft } from 'react-icons/lu';

import './Sidebar.css';

const Sidebar = ({ onViewChange }) => {
  const [expanded, setExpanded] = useState(true);
  const sidebarRef = useRef(null);
  const expandLabelRef = useRef(null);
  const timeoutRef = useRef(null);

  const toggleSize = () => {
    setExpanded(!expanded);
    const label = !expanded ? '접기' : '펼치기';
    const timeoutValue = !expanded ? 0 : 300;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (expandLabelRef.current) {
        expandLabelRef.current.innerText = label;
      }
    }, timeoutValue);
  };

  return (
    <nav className="sidebar-nav" data-expanded={expanded} ref={sidebarRef}>
      <div className="sidebar-main">
        {/* Analytics 섹션 */}
        <span className="sidebar-heading">
          <span className="sidebar-heading-text">Analytics</span>
        </span>
        <ul className="sidebar-items">
          <li className="sidebar-item">
            <button className="sidebar-item-box" onClick={() => onViewChange('전체')} title="Dashboard">
              <span className="sidebar-item-icon">
                <MdDashboard size={24} />
              </span>
              <span className="sidebar-item-text">전체 대시보드</span>
            </button>
          </li>
          <li className="sidebar-item">
            <button className="sidebar-item-box" onClick={() => onViewChange('내구역')} title="myAreaDashboard">
              <span className="sidebar-item-icon">
                <MdShowChart size={24} />
              </span>
              <span className="sidebar-item-text">내 구역 대시보드</span>
            </button>
          </li>
        </ul>

        {/* Content 섹션 */}
        <span className="sidebar-heading">
          <span className="sidebar-heading-text">Content</span>
        </span>
        <ul className="sidebar-items">
          <li className="sidebar-item">
            <button className="sidebar-item-box" onClick={() => onViewChange('체크리스트 작성')} title="Checklists">
              <span className="sidebar-item-icon">
                <MdCheckCircle size={24} />
              </span>
              <span className="sidebar-item-text">체크리스트 작성</span>
            </button>
          </li>
          <li className="sidebar-item">
            <button className="sidebar-item-box" onClick={() => onViewChange('완료목록')} title="CompletedChecklists">
              <span className="sidebar-item-icon">
                <MdAssignment size={24} />
              </span>
              <span className="sidebar-item-text">AI 보고서</span>
            </button>
          </li>
        </ul>
      </div>

      {/* 하단 토글 버튼 */}
      <div className="sidebar-bottom">
        <ul className="sidebar-items">
          <li className="sidebar-item">
            <button className="sidebar-item-box" type="button" aria-expanded={expanded} onClick={toggleSize}>
              <span className="sidebar-item-icon">
                <LuChevronsLeft size={24} />
              </span>
              <span className="sidebar-item-text" ref={expandLabelRef}>
                {expanded ? '접기' : '펼치기'}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
