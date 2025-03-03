// // styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

// export const GlobalStyle = createGlobalStyle`

//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }
  

//   body {
//     font-family: 'eBold', sans-serif;
//     font-weight: 300;
//     font-size: 15px;
//     line-height: 1.7;
//     color: #c4c3ca;
//     background-color: #ffffff;  /* 기본 배경색을 흰색으로 변경 */
//     overflow-x: hidden;
//   }

//   a {
//     cursor: pointer;
//     transition: all 200ms linear;
//     text-decoration: none;
//   }

//   h4 {
//     font-weight: 600;
//   }

//   .header {
//     background-color: #ffffff;
//     box-shadow: none;
//   }
// `;
// export default GlobalStyle;
export const GlobalStyle = createGlobalStyle`
  /* 전역 스타일은 최소한으로 유지 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'eBold', sans-serif;
    background-color: #ffffff;
    overflow-x: hidden;
  }

  /* AuthForm에만 적용될 스타일은 제거 */
`;