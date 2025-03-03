import axios from 'axios';

const api = {
  // 회원가입 관련 API
  registerResident: (data) => {
    return axios.post('/api/users/resident/join', data);
  },
  
  registerInspector: (data) => {
    return axios.post('/api/users/inspector/join', data);
  },

  // 이메일 관련 API
  checkEmail: (email) => {
    return axios.get(`/api/users/check-email?email=${email}`);
  },

  sendVerificationCode: (email) => {
    return axios.post('/api/users/send-verification', { email: email });
  },
  

  verifyEmail: (token) => {
    return axios.get(`/api/users/verify?token=${token}`);
  },

  // 프로필 조회
  getProfile: () => {
    return axios.get('/api/users/profile');
  },

  // 신고 점검 일정 관련 API
  getReportSchedules: () => {
    return axios.get('/api/schedules/reports');
  },

  createReportSchedule: (data) => {
    return axios.post('/api/schedules/reports', data);
  },

  getReportScheduleDetail: (scheduleId) => {
    return axios.get(`/api/schedules/reports/${scheduleId}`);
  },

  // 정기 점검 일정 관련 API
  getRegularSchedules: () => {
    return axios.get('/api/schedules/regular');
  },

  createRegularSchedule: (data) => {
    return axios.post('/api/schedules/regular', data);
  },

  getRegularScheduleDetail: (scheduleId) => {
    return axios.get(`/api/schedules/regular/${scheduleId}`);
  }
};
export default api;
