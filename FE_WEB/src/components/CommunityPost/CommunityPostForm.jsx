import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCommunityPost } from "../../api/apiClient";
import FormGroup from "../FormGroup/FormGroup";
import Input from "../common/Input/Input";
import Button from "../common/Button/Button";
import "./CommunityPostForm.css";

const CommunityPostForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.group('커뮤니티 게시글 생성 요청');
      console.log('요청 데이터:', formData);
      
      const response = await createCommunityPost(formData);
      
      console.log('전체 응답:', response);
      console.log('응답 상태:', response.status);
      console.log('응답 데이터:', response.data);
      console.log('응답 데이터 내용:', response.data.data);
      console.log('응답 메시지:', response.data.message);
      console.groupEnd();

      if (response.data.success) {
        navigate("/community");
      } else {
        throw new Error(response.data.message || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.group('커뮤니티 게시글 생성 에러');
      console.error('에러 객체:', error);
      console.error('에러 응답:', error.response);
      console.error('에러 데이터:', error.response?.data);
      console.error('에러 메시지:', error.response?.data?.message);
      console.error('에러 상태:', error.response?.status);
      console.groupEnd();
      
      alert(error.response?.data?.message || "게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "작성 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?"
    );
    if (confirmCancel) {
      navigate(-1);
    }
  };

  return (
    <div className="report-wrapper">
      <div className="community-post-write-container">
        <h1>글쓰기</h1>
        <FormGroup onSubmit={handleSubmit}>
          <div className="community-post-input-wrapper">
            <label>제목</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div className="community-post-input-wrapper">
            <label>내용</label>
            <Input
              type="textarea"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          <div className="community-post-button-wrapper">
            <Button
              onClick={handleCancel}
              disabled={loading}
              className="create-community-cancel-button"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="create-community-submit-button"
            >
              작성완료
            </Button>
          </div>
        </FormGroup>
      </div>
    </div>
  );
};

export default CommunityPostForm;
