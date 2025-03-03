import React, { useState, useEffect } from 'react';
import { downloadChecklist } from '../../../api/apiClient';
import './CompletedChecklistPage.css';

const CompletedChecklistPage = () => {
  const [completedChecklists, setCompletedChecklists] = useState([]);

  useEffect(() => {
    // localStorage에서 완료된 체크리스트 불러오기
    const savedChecklists = JSON.parse(localStorage.getItem('completedChecklists') || '[]');
    setCompletedChecklists(savedChecklists);
  }, []);

  const handleDownload = async (inspectionId) => {
    try {
      const response = await downloadChecklist(inspectionId);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `checklist_${inspectionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('보고서 다운로드에 실패했습니다.');
    }
  };

  return (
    <div className="completed-checklist-page">
      <h1>완료된 체크리스트 목록</h1>
      <div className="checklist-table-container">
        <table className="checklist-table">
          <thead>
            <tr>
              <th>점검 ID</th>
              <th>주소</th>
              <th>점검일</th>
              <th>점검자</th>
              <th>결함 유형</th>
              <th>다운로드</th>
            </tr>
          </thead>
          <tbody>
            {completedChecklists.map((checklist) => (
              <tr key={checklist.inspection_id}>
                <td>{checklist.inspection_id}</td>
                <td>{checklist.address}</td>
                <td>{checklist.inspection_date}</td>
                <td>{checklist.inspector_name}</td>
                <td>{checklist.defect_types?.join(', ') || '-'}</td>
                <td>
                  <button 
                    onClick={() => handleDownload(checklist.inspection_id)}
                    className="download-btn"
                  >
                    다운로드
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedChecklistPage; 