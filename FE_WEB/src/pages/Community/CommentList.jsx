// src/components/community/CommentList.jsx
import React from "react";
import CommentItem from "./CommentItem";
import "./CommunityBoard.css";

const CommentList = ({ comments }) => {
  console.group('CommentList 렌더링');
  console.log('받은 댓글 목록:', comments);
  console.log('댓글 수:', comments.length);
  console.groupEnd();

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.commentId} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
