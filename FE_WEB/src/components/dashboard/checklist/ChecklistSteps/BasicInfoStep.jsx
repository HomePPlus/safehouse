import { React, useState } from 'react';
import '../ChecklistForm.css';
import RadioGroup from '../RadioGroup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ReactDOM from 'react-dom';

const BasicInfoStep = ({ formData, handleInputChange, handleCheckboxChange, inspectionId }) => (
  <section className="checklist-section" data-step="basic">
    <div className="checklist-header">
      <div className="checklist-header-content">
        <h2 className="checklist-section-title">1. 기본 정보</h2>
      </div>
      <div className="inspection-id-display">
        점검 ID: {inspectionId}
      </div>
    </div>
    <div className="basic-info-grid">
      <div className="basic-info-left">
        <div className="checklist-input-group basic-info-input">
          <label>점검 번호:</label>
          <input 
            type="text" 
            name="inspection_id" 
            value={formData.basicInfo.inspectionId} 
            readOnly 
            className="readonly-input"
          />
        </div>
        <div className="checklist-input-group basic-info-input">
          <label>점검 일자:</label>
          <input 
            type="date" 
            name="inspection_date" 
            value={formData.basicInfo.inspectionDate} 
            onChange={(e) => handleInputChange('basicInfo', 'inspectionDate', e.target.value)} 
            required 
          />
        </div>
        <div className="checklist-input-group basic-info-input">
          <label>점검자 이름:</label>
          <input 
            type="text" 
            name="inspector_name" 
            value={formData.basicInfo.inspectorName} 
            onChange={(e) => handleInputChange('basicInfo', 'inspectorName', e.target.value)} 
            required 
          />
        </div>
        <div className="checklist-input-group basic-info-input">
          <label>점검자 연락처:</label>
          <input 
            type="text" 
            name="inspector_contact" 
            value={formData.basicInfo.inspectorContact} 
            onChange={(e) => handleInputChange('basicInfo', 'inspectorContact', e.target.value)} 
            required 
          />
        </div>
        <div className="checklist-input-group basic-info-input">
          <label>주소:</label>
          <input 
            type="text" 
            name="address" 
            value={formData.basicInfo.address} 
            readOnly 
            className="readonly-input"
          />
        </div>
      
      </div>
      
      <div className="basic-info-right">
        <div className="defect-selection">
          <h3 className="defect-selection-title">결함:</h3>
          <div className="defect-options">
            {[
              { label: '균열', type: 'crack' },
              { label: '누수/백태', type: 'leak' },
              { label: '강재 부식', type: 'steel' },
              { label: '박리', type: 'delamination' },
              { label: '철근 노출', type: 'rebar' },
              { label: '도장 손상', type: 'paint' }
            ].map(({ label, type }) => (
              <div key={type} className="checkbox-option" data-type={type}>
                <input
                  type="checkbox"
                  id={`defect-${type}`}
                  checked={formData.basicInfo.defectTypes.includes(label)}
                  onChange={(e) => {
                    const updatedDefects = e.target.checked
                      ? [...formData.basicInfo.defectTypes, label]
                      : formData.basicInfo.defectTypes.filter(t => t !== label);
                    handleInputChange('basicInfo', 'defectTypes', updatedDefects);
                  }}
                />
                <label htmlFor={`defect-${type}`}>{label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default BasicInfoStep;
