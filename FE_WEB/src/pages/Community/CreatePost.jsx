// import React, { useState } from "react";
// import { createCommunityPost } from "../../api/apiClient";
// import "./CommunityBoard.css";
// import { useNavigate } from 'react-router-dom';
// import { useAlert } from "../../contexts/AlertContext";

// const CreatePost = ({ onCreate }) => {
//   const navigate = useNavigate();
//   const { showAlert } = useAlert();
//   const [postData, setPostData] = useState({
//     communityTitle: "",
//     communityContent: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('handleSubmit 함수 실행됨');

//     try {
//       console.group('CreatePost - 게시글 작성 시도');
//       console.log('전송할 데이터:', postData);

//       console.log('API 호출 시작');
      
//       const response = await createCommunityPost({
//         communityTitle: postData.communityTitle,
//         communityContent: postData.communityContent
//       });
      
//       console.log('API 호출 완료');
//       console.log('서버 응답 전체:', response);
//       console.log('응답 상태:', response.status);
//       console.log('응답 데이터:', response.data);
//       console.groupEnd();

//       if (response.data.success || response.status === 200) {
//         showAlert('게시글이 성공적으로 작성되었습니다.', 'success');
//         navigate('/community');
//       } else {
//         throw new Error(response.data.message || '게시글 작성에 실패했습니다.');
//       }
      
//     } catch (error) {
//       console.group('CreatePost - 게시글 작성 에러');
//       console.error('에러 발생:', error);
//       console.error('에러 상세:', {
//         message: error.message,
//         response: error.response,
//         stack: error.stack
//       });
//       console.groupEnd();

//       showAlert(error.response?.data?.message || '게시글 작성에 실패했습니다.', 'error');
//     }
//   };

//   const handleInputChange = (e, field) => {
//     console.log(`${field} 변경:`, e.target.value);
//     setPostData(prev => ({
//       ...prev,
//       [field]: e.target.value
//     }));
//   };

//   return (
//     <div className="create-post-container">
//       <div className="create-post-form">
//         <h2>새 게시글 작성</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="text"
//               placeholder="제목을 입력하세요"
//               value={postData.communityTitle}
//               onChange={(e) => handleInputChange(e, 'communityTitle')}
//               required
//               className="form-input"
//             />
//           </div>
//           <div className="form-group">
//             <textarea
//               placeholder="내용을 입력하세요"
//               value={postData.communityContent}
//               onChange={(e) => handleInputChange(e, 'communityContent')}
//               required
//               className="form-textarea"
//             />
//           </div>
//           <div className="form-actions">
//             <button 
//               type="submit"
//               className="submit-button"
//               onClick={() => console.log('제출 버튼 클릭됨')}
//             >
//               작성 완료
//             </button>
//             <button 
//               type="button" 
//               className="cancel-button"
//               onClick={() => navigate('/community')}
//             >
//               취소
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreatePost;
