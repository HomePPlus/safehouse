import React from 'react';
import crackImage from '../../assets/images/model/concreate_crack.jpg';
import spallingImage from '../../assets/images/model/Spalling.jpg';
import efforescenceImage from '../../assets/images/model/efforescence.jpg';
import exposureImage from '../../assets/images/model/exposure.jpg';
import steeldefectImage from '../../assets/images/model/steeldefect.jpg';
import paintdamageImage from '../../assets/images/model/paintdamage.jpg';
import gptImg from '../../assets/images/model/gptimg.png';

const defectTypes = {
  CRACK: {
    label: '균열',
    description: '구조물의 균열로 인한 문제입니다.',
    exampleImage: crackImage,
  },
  PEELING: {
    label: '박리',
    description: '도장이나 마감재, 콘크리트가 벗겨지는 현상입니다.',
    exampleImage: spallingImage,
  },
  LEAK: {
    label: '백태/누수',
    description: '물이나 습기가 새는 현상입니다.',
    exampleImage: efforescenceImage,
  },
  REBAR_EXPOSURE: {
    label: '철근 노출',
    description: '콘크리트가 벗겨져 철근이 드러나는 현상입니다.',
    exampleImage: exposureImage,
  },
  STEEL_DAMAGE: {
    label: '강재 손상',
    description: '강재 구조물의 손상입니다.',
    exampleImage: steeldefectImage,
  },
  PAINT_DAMAGE: {
    label: '도장 손상',
    description: '도장이나 페인트가 벗겨지는 현상입니다.',
    exampleImage: paintdamageImage,
  },
  UNKNOWN: {
    label: '모름',
    description: '결함 유형을 모르실 경우 선택해주세요.',
    exampleImage: gptImg,
  },
  // 추가 결함 유형...
};

export default defectTypes;
