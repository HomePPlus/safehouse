// src/components/community/PostList.jsx
import React from "react";
import PostItem from "./PostItem";
import "./CommunityBoard.css";
import { Link } from "react-router-dom";

const PostList = ({ posts, onDelete }) => {
  console.group('PostList 렌더링');
  console.log('받은 게시글 목록:', posts);
  console.log('게시글 수:', posts.length);
  console.groupEnd();

  return (
    <div>
      <table className="post-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <PostItem
              key={post.communityPostId}
              post={post}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;
