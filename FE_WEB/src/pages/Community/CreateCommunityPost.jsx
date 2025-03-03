import React, { useState, useEffect } from "react";
import { createCommunityPost } from "../../api/apiClient";
import { useNavigate } from 'react-router-dom';
import { useAlert } from "../../contexts/AlertContext";
import FormGroup from "../../components/FormGroup/FormGroup";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import "./CreateCommunityPost.css";

const CreateCommunityPost = () => {
  console.group('CreateCommunityPost 컴포넌트 렌더링');
  
  useEffect(() => {
    console.log('CreateCommunityPost 컴포넌트 마운트됨');
    return () => {
      console.log('CreateCommunityPost 컴포넌트 언마운트됨');
    };
  }, []);

  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    communityTitle: "",
    communityContent: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.group('CreateCommunityPost - handleChange');
    console.log('변경된 필드:', name);
    console.log('새로운 값:', value);
    console.groupEnd();

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log('handleSubmit 함수 시작'); // 가장 먼저 실행되는 로그
    e.preventDefault();
    
    console.group('CreateCommunityPost - handleSubmit');
    console.log('폼 제출 시도');
    console.log('현재 formData:', formData);
    
    // 데이터 검증
    if (!formData.communityTitle.trim() || !formData.communityContent.trim()) {
      console.log('폼 검증 실패: 제목 또는 내용이 비어있음');
      showAlert('제목과 내용을 모두 입력해주세요.', 'error');
      console.groupEnd();
      return;
    }

    try {
      setLoading(true);
      console.log('API 호출 직전 데이터:', {
        title: formData.communityTitle.trim(),
        content: formData.communityContent.trim()
      });
      
      const response = await createCommunityPost({
        communityTitle: formData.communityTitle.trim(),
        communityContent: formData.communityContent.trim()
      });
      
      console.log('API 응답 완료:', response);
      
      if (response.status === 200 || response.status === 201) {
        console.log('게시글 작성 성공');
        showAlert('게시글이 성공적으로 작성되었습니다.', 'success');
        setTimeout(() => {
          navigate('/community');
        }, 1000);
      }
    } catch (error) {
      console.group('API 호출 에러');
      console.error('에러 발생 시점:', new Date().toISOString());
      console.error('에러 객체:', error);
      console.error('에러 메시지:', error.message);
      console.error('에러 응답:', error.response);
      console.groupEnd();

      showAlert(error.response?.data?.message || '게시글 작성에 실패했습니다.', 'error');
    } finally {
      console.log('작업 완료, 로딩 상태 해제');
      setLoading(false);
      console.groupEnd();
    }
  };

  const handleCancel = () => {
    navigate('/community'); // 취소 시 커뮤니티 페이지로 바로 이동
  };

  console.log('현재 폼 데이터:', formData);
  console.groupEnd();

  return (
     
      <div className="community-post-write-container">
          <h1>글쓰기</h1>
          <form onSubmit={handleSubmit}>
            <div className="community-post-input-wrapper">
              <label>제목</label>
              <Input
                type="text"
                name="communityTitle"
                value={formData.communityTitle}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
                required
              />
            </div>
            <div className="community-post-input-wrapper">
              <label>내용</label>
              <Input
                type="textarea"
                name="communityContent"
                value={formData.communityContent}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
                required
              />
            </div>
            <div className="community-post-button-wrapper">
              <Button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="community-post-cancel-button"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="community-post-submit-button"
                onClick={(e) => {
                  console.log('제출 버튼 클릭됨');
                  // handleSubmit(e); // 필요한 경우 직접 호출
                }}
              >
                작성완료
              </Button>
            </div>
          </form>
        </div>
  );
};

export default CreateCommunityPost;
