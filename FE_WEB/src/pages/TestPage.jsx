import React from "react";
import CardComponent from "../components/main/AppCardComponent"; // CardComponent import
import "./TestPage.css"; // 스타일 import

const TestPage = () => {
  return (
    <div className="test-page">
      <CardComponent
        // title="앱"
        // subtitle="여기를 클릭해 다운로드 하세요"
        // imageUrl={require("../assets/images/busan.jpg")}
        imageUrl={require("../assets/images/app3.png")}
      />
    </div>
  );
};

export default TestPage;
