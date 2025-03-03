import apiClient from "./apiClient";

// ✅ 입주민 커뮤니티 API

// 게시글 작성
export const postResidentCommunity = (data) =>
  apiClient.post("/api/resident_communities", data);
// 전체 게시글 조회
export const residentCommunity = () =>
  apiClient.get("/api/resident_communities");
// 게시글 상세 보기
export const residentCommunityDetail = (postId) =>
  apiClient.get(`/api/resident_communities/${postId}`);
// 게시글 수정
export const updateResidentCommunity = (postId, data) =>
  apiClient.put(`/api/resident_communities/${postId}`, data);
// 게시글 삭제
export const deleteResidentCommunity = (postId) =>
  apiClient.delete(`/api/resident_communities/${postId}`);
// 게시글 댓글 작성
export const createResidentCommunityComment = (communityId, data) =>
  apiClient.post(`/api/resident_communities/comments/${communityId}`, data);

// ✅ 점검자 커뮤니티 API
export const postInspectorCommunity = (data) =>
  apiClient.post("/api/inspector_communities", data);
export const inspectorCommunity = () =>
  apiClient.get("/api/inspector_communities");
export const inspectorCommunityDetail = (postId) =>
  apiClient.get(`/api/inspector_communities/${postId}`);
export const updateInspectorCommunity = (postId, data) =>
  apiClient.put(`/api/inspector_communities/${postId}`, data);
export const deleteInspectorCommunity = (postId) =>
  apiClient.delete(`/api/inspector_communities/${postId}`);
