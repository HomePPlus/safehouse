import React, { useEffect, useState } from 'react';
import './Pagination.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ totalPage, page, setPage }) => {
  const [pageNumbers, setPageNumbers] = useState([]);

  // 페이지 번호 생성 로직 -------------------------------------------------
  useEffect(() => {
    const generatePageNumbers = () => {
      let startPage = Math.max(1, page - 2); // 현재 페이지 기준 앞 2개
      let endPage = Math.min(totalPage, startPage + 4); // 총 5개씩 표시

      // 전체 페이지가 5개 미만일 때 처리
      if (totalPage < 5) {
        startPage = 1;
        endPage = totalPage;
      }
      // 현재 페이지가 끝에 가까울 때 처리
      else if (page > totalPage - 2) {
        startPage = totalPage - 4;
        endPage = totalPage;
      }

      const numbers = [];
      for (let i = startPage; i <= endPage; i++) {
        numbers.push(i);
      }
      setPageNumbers(numbers);
    };

    generatePageNumbers();
  }, [page, totalPage]); // 페이지 변경 시마다 재계산

  // 렌더링 부분 ----------------------------------------------------------
  return (
    <div id="pag-cover">
      <div id="pg-links">
        {/* 이전 페이지 화살표 */}
        <div className={`arrow ${page === 1 ? 'disabled' : ''}`} onClick={() => page > 1 && setPage(page - 1)}>
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </div>

        {/* 페이지 번호 버튼 */}
        {pageNumbers.map((num) => (
          <div key={num} className={`pg-link ${num === page ? 'active' : ''}`} onClick={() => setPage(num)}>
            <span>{num}</span>
          </div>
        ))}

        {/* 다음 페이지 화살표 */}
        <div
          className={`arrow ${page === totalPage ? 'disabled' : ''}`}
          onClick={() => page < totalPage && setPage(page + 1)}
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
