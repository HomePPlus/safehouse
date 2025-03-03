import axios from 'axios';
import serverConfig from '../config/serverConfig';
import { getToken } from '../utils/auth'; // JWT 토큰 가져오기
// axios 전역 설정
axios.defaults.withCredentials = true;

export const apiClient = axios.create({
  baseURL: serverConfig.serverUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // CSRF 토큰이 필요한 경우 추가
    // 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
  },
  // 리다이렉션 최대 횟수 설정
  maxRedirects: 5,
});

// 응답 인터셉터 수정
apiClient.interceptors.response.use(
  (response) => {
    // 로그인 응답에서 토큰 확인
    if (response.config.url === '/api/auth/login' && response.data.data?.token) {
      console.log('Login response received with token');
    }
    return response;
  },
  (error) => {
    // 401 에러 처리 (인증 실패)
    if (error.response && error.response.status === 401) {
      console.log('인증 실패:', error);
    }
    return Promise.reject(error);
  }
);

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// * Health check API
export const checkServerHealth = async () => {
  console.log('API URL (env 파일 잘 읽어오는 지 확인용):', process.env.REACT_APP_API_URL);
  try {
    const response = await apiClient.get('/api/health');
    if (response.data === 'OK') {
      console.log('서버 연결 성공');
      return true;
    }
  } catch (error) {
    console.error('서버 연결 실패:', error);
    return false;
  }
};

// * 회원가입 관련 API
// 입주민 회원가입
export const registerResident = (data) =>
  apiClient.post('/api/users/resident/join', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

//점검자 회원가입
export const registerInspector = (data) =>
  apiClient.post('/api/users/inspector/join', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

// * 이메일 관련 API
export const checkEmail = (email) => apiClient.get(`/api/users/check-email`, { params: { email } });

export const sendVerificationCode = (email) =>
  apiClient.post(`/api/users/send-verification`, null, { params: { email } });

export const verifyEmail = (email, code) =>
  apiClient.post(
    `/api/users/verify-code`,
    {},
    {
      // 빈 객체를 본문으로 전송
      params: { email, code },
      headers: { 'Content-Type': 'application/json' }, // 명시적 헤더 설정
    }
  );

// * 로그인 관련 API
export const login = (data) =>
  apiClient.post('/api/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const logout = () => {
  const token = getToken(); // JWT 토큰 가져오기
  return apiClient.post('/api/auth/logout', null, {
    headers: {
      Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
    },
  });
};
// export const getProfile = () =>
//   apiClient.get("/api/users/profile", {
//     headers: {
//       Authorization: getCookie("tokenKey"),
//     },
//   });

// * 입주민 커뮤니티 관련 API
export const createCommunityPost = async (requestDto) => {
  console.group('API - createCommunityPost 호출');
  console.log('요청 데이터:', requestDto);
  
  try {
    // 요청 전 토큰 확인
    const token = getToken();
    console.log('인증 토큰:', token);

    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await apiClient.post('/api/resident_communities', requestDto, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('API 응답:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    console.groupEnd();
    
    // 응답 데이터 확인
    if (!response.data) {
      throw new Error('서버 응답에 데이터가 없습니다.');
    }
    
    return response;
    
  } catch (error) {
    console.group('API - createCommunityPost 에러');
    console.error('에러 타입:', error.name);
    console.error('에러 메시지:', error.message);
    console.error('요청 설정:', error.config);
    if (error.response) {
      console.error('응답 데이터:', error.response.data);
      console.error('응답 상태:', error.response.status);
      console.error('응답 헤더:', error.response.headers);
    } else {
      console.error('응답 없음');
    }
    console.groupEnd();
    
    throw error;
  }
};

export const getCommunityPost = (communityPostId) => apiClient.get(`/api/resident_communities/${communityPostId}`);

export const getAllCommunityPosts = async () => {
  try {
    console.group('API - 커뮤니티 게시글 목록 조회');
    
    const response = await apiClient.get('/api/resident_communities');
    
    console.log('전체 응답:', response);
    console.log('응답 상태:', response.status);
    console.log('응답 데이터:', response.data);
    console.log('응답 데이터 내용:', response.data.data);
    console.log('응답 메시지:', response.data.message);
    console.groupEnd();
    
    return response;
  } catch (error) {
    console.group('API - 커뮤니티 게시글 목록 조회 에러');
    console.error('에러 객체:', error);
    console.error('에러 응답:', error.response);
    console.error('에러 데이터:', error.response?.data);
    console.error('에러 메시지:', error.response?.data?.message);
    console.error('에러 상태:', error.response?.status);
    console.groupEnd();
    throw error;
  }
};

export const updateCommunityPost = (communityPostId, requestDto) =>
  apiClient.put(`/api/resident_communities/${communityPostId}`, requestDto);

export const deleteCommunityPost = (communityPostId) =>
  apiClient.delete(`/api/resident_communities/${communityPostId}`);

// 커뮤니티 댓글 관련 API
export const createCommunityComment = (communityId, requestDto) =>
  apiClient.post(`/api/resident_communities/comments/${communityId}`, requestDto);

export const getCommunityComments = (communityId) => apiClient.get(`/api/resident_communities/comments/${communityId}`);

export const updateCommunityComment = (commentId, requestDto) =>
  apiClient.put(`/api/resident_communities/comments/${commentId}`, requestDto);

export const deleteCommunityComment = (commentId) =>
  apiClient.delete(`/api/resident_communities/comments/${commentId}`);

// * 신고 점검 일정 관련 API
export const getReportSchedules = () => apiClient.get('/api/schedules/reports');

export const createReportSchedule = (data) => apiClient.post('/api/schedules/reports', data);

export const getReportScheduleDetail = (scheduleId) => apiClient.get(`/api/schedules/reports/${scheduleId}`);

// * 정기 점검 일정 관련 API
export const getRegularSchedules = () => apiClient.get('/api/schedules/regular');

export const createRegularSchedule = (data) => apiClient.post('/api/schedules/regular', data);

export const getRegularScheduleDetail = (scheduleId) => apiClient.get(`/api/schedules/regular/${scheduleId}`);

// * 결함 검출 관련 API
// export const createDefect = (fileName) =>
//   apiClient.post('/api/model/detect', null, {
//     params: {
//       file: fileName
//     },
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

// * 오늘 예약된 점검 일정 API
export const getTodayInspections = (date = new Date().toISOString().split('T')[0]) =>
  apiClient.get(`/api/inspections/today?date=${date}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

// * 오늘의 점검 일정 API
// export const getTodayInspections = () =>
// apiClient.get("/api/inspections/today");

// * 대시보드 관련 API
export const getDefectStats = (area) =>
  apiClient.get(`/api/dashboard/defects/stats`, {
    params: { area },
  });

// * 점검 관련 API
export const getInspectionReports = () => 
  apiClient.get('/api/inspections/report');

// * 점검 통계 API
export const getInspectionStats = async () => {
  try {
    const response = await apiClient.get("/api/inspections/statistics/inspector");
    return response.data.data;
  } catch (error) {
    console.error("통계 데이터 조회 실패:", error);
    throw error;
  }
};

// * 점검 상태 변경 API
export const updateInspectionStatus = (inspectionId, status) =>
  apiClient.patch(`/api/inspections/${inspectionId}/status`, { status });

// 신고 생성 API
export const createReport = (formData) =>
  apiClient.post('/api/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// 신고 목록 조회
export const getAllReports = () => apiClient.get('/api/reports');

// 신고 상세 조회
export const getReportDetail = (reportId) => apiClient.get(`/api/reports/${reportId}`);

// 신고 수정
export const updateReport = (reportId, data) => {
  return apiClient.put(`/api/reports/${reportId}`, data, {
    headers: {
      'Authorization': `Bearer ${getToken()}`, // 토큰 추가
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 신고 삭제
export const deleteReport = (reportId) => apiClient.delete(`/api/reports/${reportId}`);

// 점검자별 예약 가능한 신고 목록 조회
export const getReservableReports = () => 
  apiClient.get('/api/reports/reservable/inspector');

// 점검 예약 생성
export const createInspectionReports = (data) =>
  apiClient.post('/api/inspections/report', data);

export const getDetectionStats = async (area) => {
  try {
    const response = await apiClient.get(`/api/dashboard/detection/stats`, {
      params: { area },
    });
    return response;
  } catch (error) {
    console.error('Error fetching detection stats:', error);
    throw error;
  }
};

// 체크리스트 제출
export const submitChecklist = async (checklistData) => {
  return await apiClient.post('/submit_checklist', checklistData, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });
};

// 체크리스트 PDF 다운로드
export const downloadChecklist = async (inspectionId) => {
  return await apiClient.get(`/download/${inspectionId}`, {
    responseType: 'blob'
  });
};

// 결함 검출 API
export const detectDefect = (fileName) =>
  apiClient.post('/api/model/detect/json', {
    file1: fileName  // request body에 포함
  });
