// MovingMascot.js
import React from 'react';
import './MovingMascot.css';
import mascotone from '../../../assets/images/mascot1.png';
import mascottwo from '../../../assets/images/mascot2.png';
import mascotthree from '../../../assets/images/mascot3.png';

const MovingMascot = () => {
  return (
    <div className="mascot-container">
      <img src={mascotone} alt="mascot" className="mascot mascot-1" />
      <img src={mascottwo} alt="mascot" className="mascot mascot-2" />
      <img src={mascotthree} alt="mascot" className="mascot mascot-3" />
      {/* <img src={mascotImage} alt="mascot" className="mascot mascot-4" /> */}
    </div>
  );
};

export default MovingMascot;
