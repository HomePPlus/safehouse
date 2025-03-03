import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDownload, MdDelete, MdNavigateBefore, MdNavigateNext, MdSearch } from 'react-icons/md';
import { downloadChecklist } from '../../../api/apiClient';
import { useAlert } from "../../../contexts/AlertContext";
import Loading from "../../common/Loading/Loading";
import './ChecklistCompleteList.css';

const ChecklistCompleteList = () => {
  const [completedChecklists, setCompletedChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    loadCompletedChecklists();
  }, []);

  const loadCompletedChecklists = () => {
    try {
      const savedChecklists = JSON.parse(localStorage.getItem('completedChecklists') || '[]');
      setCompletedChecklists(savedChecklists);
    } catch (error) {
      console.error('체크리스트 로딩 실패:', error);
      showAlert('완료된 체크리스트를 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (inspectionId) => {
    try {
      setLoading(true);
      const response = await downloadChecklist(inspectionId);
      
      // Blob 생성 및 다운로드
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inspection_report_${inspectionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showAlert('보고서가 다운로드되었습니다.', 'success');
    } catch (error) {
      console.error('다운로드 실패:', error);
      showAlert('보고서 다운로드에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (inspectionId) => {
    try {
      const updatedChecklists = completedChecklists.filter(
        checklist => checklist.inspection_id !== inspectionId
      );
      localStorage.setItem('completedChecklists', JSON.stringify(updatedChecklists));
      setCompletedChecklists(updatedChecklists);
      showAlert('체크리스트가 삭제되었습니다.', 'success');
    } catch (error) {
      showAlert('체크리스트 삭제에 실패했습니다.', 'error');
    }
  };

  // 검색어에 따른 필터링
  const filteredChecklists = completedChecklists.filter(checklist =>
    checklist.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checklist.inspector_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredChecklists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredChecklists.length / itemsPerPage);
  const emptyCards = Array(6 - currentItems.length).fill(null);

  // 검색어 변경시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="completed-checklist-container">
      <div className="checklist-complete-list-header">
        <h2>생성 완료된 AI 보고서 목록</h2>
        <div className="checklist-complete-list-search-box">
          <MdSearch className="checklist-complete-list-search-icon" />
          <input
            type="text"
            placeholder="주소 또는 점검자 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="completed-checklist-grid">
            {currentItems.map((checklist) => (
              <div key={checklist.inspection_id} className="checklist-complete-list-checklist-card">
                <div className="checklist-complete-list-card-header">
                  <span>ID: {checklist.inspection_id}</span>
                  <span>{checklist.inspection_date}</span>
                </div>
                <div className="checklist-complete-list-card-body">
                  <h3>{checklist.address}</h3>
                  <p className="inspector">점검자: {checklist.inspector_name}</p>
                  <div className="checklist-complete-list-defect-tags">
                    {checklist.defect_types?.map((defect, index) => (
                      <span key={index} className="checklist-complete-list-defect-tag">
                        {defect}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card-actions">
                  <button 
                    onClick={() => handleDownload(checklist.inspection_id)}
                    className="checklist-complete-list-action-btn download"
                  >
                    <MdDownload size={20} />
                    <span>보고서</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(checklist.inspection_id)}
                    className="checklist-complete-list-action-btn delete"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
            {emptyCards.map((_, index) => (
              <div key={`empty-${index}`} className="checklist-complete-list-checklist-card" style={{ visibility: 'hidden' }} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className="checklist-complete-list-page-btn"
              >
                <MdNavigateBefore size={24} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                className="checklist-complete-list-page-btn"
              >
                <MdNavigateNext size={24} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChecklistCompleteList;