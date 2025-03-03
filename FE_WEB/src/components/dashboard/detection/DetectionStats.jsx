import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getDetectionStats } from '../../../api/apiClient';
import './DetectionStats.css';
import '../dashboardCommon.css';

const { Option } = Select;

const COLORS = [
  '#80b1e6', // 진한 파스텔 블루
  '#ffa366', // 진한 파스텔 오렌지
  '#66cc7a', // 진한 파스텔 그린
  
  '#b399ff', // 진한 파스텔 퍼플
  '#ff8080', // 진한 파스텔 레드
  '#d4a276', // 진한 파스텔 브라운
  '#ff99cc', // 진한 파스텔 핑크
];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.03 || value === 0) return null;

  const startRadius = outerRadius + 2;
  const startX = cx + startRadius * Math.cos(-midAngle * RADIAN);
  const startY = cy + startRadius * Math.sin(-midAngle * RADIAN);
  
  const controlRadius = radius * 0.7;
  const controlX = cx + controlRadius * Math.cos(-midAngle * RADIAN);
  const controlY = cy + controlRadius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <path
        d={`
          M ${startX},${startY}
          Q ${controlX},${controlY} ${x},${y}
        `}
        stroke="#104e1e"
        fill="none"
        strokeWidth={0}
      />
      <text
        x={x}
        y={y}
        fill="#104e1e"
        textAnchor={x > cx ? 'start' : 'end'}

        dominantBaseline="central"
        fontSize="15px"
        className="eLight"
      >
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const AREA_LIST = [
  '부산시', '동래구', '해운대구', '수영구', '사하구',
  '부산진구', '남구', '북구', '강서구', '연제구', '사상구',
  '금정구', '동구', '서구', '영도구', '중구', '기장군',
];

const DetectionStats = () => {
  const [selectedArea, setSelectedArea] = useState('부산시');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDetectionStats(selectedArea);
        if (response.data.status === 200) {
          setStats(response.data.data[selectedArea]);
          setError(null);
        } else {
          setStats(null);
          setError(response.data.message);
        }
      } catch (error) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching detection stats:', error);
      }
    };

    fetchStats();
  }, [selectedArea]);

  const handleAreaChange = (value) => {
    setSelectedArea(value);
  };

  const formatDataForPieChart = (stats) => {
    if (!stats) return [];
    return Object.entries(stats).map(([name, value]) => ({
      name,
      value,
    }));
  };

  return (
    <div className="dashboard-section detection-stats">
      <div className="content-section">
        <div className="header-section">
          <h2 className="section-title eMedium">AI가 분석한 {selectedArea} 결함 통계</h2>
          <div className="area-selector">
              <Select value={selectedArea} onChange={handleAreaChange}>

              {AREA_LIST.map((area) => (
                <Option key={area} value={area}>
                  {area}
                </Option>
              ))}
            </Select>
          </div>
        </div>
            
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={formatDataForPieChart(stats)}
                cx="41%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={110}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {formatDataForPieChart(stats).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="top"
                iconType="circle"
                wrapperStyle={{
                  paddingLeft: "5px",
                  paddingTop: "40px",
                  fontSize: "1.0em",
                  fontFamily: "eMedium"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* 통계 데이터가 없을 경우 메시지 표시 */}
          {stats === null && (
            <div className="error-message-overlay">
              <div className="error-message">해당 지역의 통계 데이터가 없습니다.</div>
            </div>
          )}
        </div>
    </div>
    </div>
  );
};

export default DetectionStats;