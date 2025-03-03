// LogoText.js
import React from 'react';

const LogoText = () => {
  return (
    <div className="text-container">
       <span className="logo-gray" style={{ color: '#666' , fontSize: '20px'}}>당신의 </span>
      <span className="logo-green" style={{ color: 'rgb(8, 68, 13)', fontSize: '25px' }}>안</span>
      <span className="logo-gray" style={{ color: '#666' , fontSize: '20px'}}>전한 </span>
      <span className="logo-green" style={{ color: 'rgb(8, 68, 13)', fontSize: '25px' }}>주</span>
      <span className="logo-gray" style={{ color: '#666' , fontSize: '20px'}}>택</span>
      {/* <span className="logo-green" style={{ color: 'rgb(8, 68, 13)', fontSize: '30px' }}>안주</span> */}
    </div>
  );
};

export default LogoText;