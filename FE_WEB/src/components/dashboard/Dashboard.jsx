import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChecklistForm from './checklist/ChecklistForm';
import ErrorBoundary from 'react-error-boundary';
import TodayInspection from './inspection/TodayInspection';
import DefectStats from './stats/DefectStats';

const Dashboard = () => {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    if (error.response?.status === 500) {
      // 서버 에러 발생 시 기본 데이터 표시
      return {
        data: {
          data: [] // 빈 배열 반환
        }
      };
    }
    throw error;
  };

  // 에러 알림 표시 함수
  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // 성공 알림 표시 함수
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="dashboard-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ErrorBoundary fallback={<div>일시적인 오류가 발생했습니다.</div>}>
        <TodayInspection onError={handleError} />
        <DefectStats onError={handleError} />
        <ChecklistForm 
          onError={(message) => {
            setError(message);
            showErrorToast(message);
          }}
          onSuccess={(message) => {
            showSuccessToast(message);
          }}
        />
      </ErrorBoundary>
    </div>
  );
};

export default Dashboard; 