// src/components/community/CommentItem.jsx
import React from "react";
import "./CommunityBoard.css";

const CommentItem = ({ comment }) => {
  console.group(`CommentItem(${comment.commentId}) 렌더링`);
  console.log('댓글 데이터:', comment);
  console.log('작성자:', comment.userName);
  console.log('작성일:', comment.commentCreatedAt);
  console.groupEnd();

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">{comment.userName}</span>
        <span className="comment-date">
          {new Date(comment.commentCreatedAt).toLocaleDateString("ko-KR")}
        </span>
      </div>
      <div className="comment-content">
        <p>{comment.commentContent}</p>
      </div>
    </div>
  );
};

export default CommentItem;
