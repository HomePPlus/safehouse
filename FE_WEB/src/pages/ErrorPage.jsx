import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  const location = useLocation();
  const error = location.state?.error || {
    status: 404,
    message: '페이지를 찾을 수 없습니다.'
  };

  // 에러 메시지 매핑
  const getErrorMessage = (status) => {
    switch (status) {
      case 400:
        return '잘못된 요청입니다.';
      case 401:
        return '인증이 필요합니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '페이지를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다.';
      case 502:
        return '게이트웨이 오류가 발생했습니다.';
      case 503:
        return '서비스를 사용할 수 없습니다.';
      default:
        return '오류가 발생했습니다.';
    }
  };

  // 에러 설명 매핑
  const getErrorDescription = (status) => {
    switch (status) {
      case 400:
        return '요청이 잘못되었습니다. 다시 시도해주세요.';
      case 401:
        return '로그인이 필요한 서비스입니다.';
      case 403:
        return '해당 리소스에 접근할 권한이 없습니다.';
      case 404:
        return '요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요!';
      case 500:
        return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 502:
        return '서버 게이트웨이에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 503:
        return '서비스가 일시적으로 중단되었습니다. 잠시 후 다시 시도해주세요.';
      default:
        return '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  };

  return (
    <div className="error-page">
      <div className="text">
        <p>{error.status}</p>
      </div>
      <div className="error-message">
        <h2>{getErrorMessage(error.status)}</h2>
        <p>{getErrorDescription(error.status)}</p>
      </div>
      <div className="container">
        {/* 기존 caveman 코드 유지 */}
        <div className="caveman">
          <div className="leg">
            <div className="foot"><div className="fingers"></div></div>      
          </div>
          <div className="leg">
            <div className="foot"><div className="fingers"></div></div>      
          </div>
          <div className="shape">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <div className="head">
            <div className="eye"><div className="nose"></div></div>
            <div className="mouth"></div>
          </div>
          <div className="arm-right"><div className="club"></div></div>    
        </div>
        <div className="caveman">
          <div className="leg">
            <div className="foot"><div className="fingers"></div></div>      
          </div>
          <div className="leg">
            <div className="foot"><div className="fingers"></div></div>      
          </div>
          <div className="shape">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <div className="head">
            <div className="eye"><div className="nose"></div></div>
            <div className="mouth"></div>
          </div>
          <div className="arm-right"><div className="club"></div></div>    
        </div>
      </div>
      <div className="button-container">
        <button onClick={() => window.history.back()} className="back-button">
          이전 페이지
        </button>
        <Link to="/" className="back-button">
          메인으로
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;