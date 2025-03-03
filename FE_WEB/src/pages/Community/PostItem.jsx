// src/components/community/PostItem.jsx
// import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import "./CommunityBoard.css";

const PostItem = ({ post, onDelete }) => {
  console.group(`PostItem(${post.communityPostId}) 렌더링`);
  console.log('게시글 데이터:', post);
  console.log('작성일:', post.communityCreatedAt);
  console.log('조회수:', post.communityViews);
  console.groupEnd();

  const formatDate = (dateString) => {
    if (!dateString) {
      console.warn('날짜 문자열이 없습니다.');
      return '';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('유효하지 않은 날짜:', dateString);
        return '';
      }
      return format(date, 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.error('날짜 포맷 에러:', error);
      return '';
    }
  };

  return (
    <tr className="post-row">
      <td>{post.communityPostId}</td>
      <td className="post-title">
        <Link to={`/community/${post.communityPostId}`}>
          {post.communityTitle}
        </Link>
      </td>
      <td>{post.userName}</td>
      <td>{formatDate(post.communityCreatedAt)}</td>
      <td>{post.communityViews}</td>
    </tr>
  );
};

export default PostItem;
