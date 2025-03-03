import { React, useState } from 'react';
import '../ChecklistForm.css';
import RadioGroup from '../RadioGroup';
const DelaminationStep = ({ formData, handleInputChange, inspectionId }) => (
  <section className="checklist-section" data-step="delamination">
    <div className="checklist-header">
      <div className="checklist-header-content">
        <h2 className="checklist-section-title">2. 균열 항목 체크리스트</h2>
        <h3 className="checklist-subtitle">[4] 박리</h3>
      </div>
      <div className="inspection-id-display">
        점검 ID: {inspectionId}
      </div>
    </div>
    <div className="checklist-grid">
      <div className="checklist-input-group">
        <RadioGroup
          title="손상 범위"
          name="delamination_range"
          options={['소규모', '중규모', '대규모']}
          value={formData.delamination.delaminationRange}
          onChange={(value) => handleInputChange('delamination', 'delaminationRange', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="박리의 원인"
          name="delamination_cause"
          options={[
            '내부 압력 증가',
            '시공 불량',
            '외부 환경 요인',
            '구조적 문제'
          ]}
          value={formData.delamination.delaminationCause}
          onChange={(value) => handleInputChange('delamination', 'delaminationCause', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="구조적 안전성에 미치는 영향"
          name="delamination_stability_impact"
          options={['안전성에 영향 없음', '안전성에 영향 있음']}
          value={formData.delamination.stabilityImpact}
          onChange={(value) => handleInputChange('delamination', 'stabilityImpact', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="응급처치 필요 여부"
          name="delamination_emergency"
          options={['필요', '불필요']}
          value={formData.delamination.emergency}
          onChange={(value) => handleInputChange('delamination', 'emergency', value)}
        />
        {formData.delamination.emergency === '필요' && (
          <div className="emergency-action-input">
            <label>응급 조치 사항:
              <input 
                type="text"
                name="delamination_emergency_action"
                value={formData.delamination.emergencyAction}
                onChange={(e) => handleInputChange('delamination', 'emergencyAction', e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="수리 계획"
          name="delamination_repair_plan"
          options={[
            '패칭 보수',
            '표면 보수',
            '철근 보강 후 보수',
            '구조적 보강 및 보수'
          ]}
          value={formData.delamination.repairPlan}
          onChange={(value) => handleInputChange('delamination', 'repairPlan', value)}
        />
      </div>
    </div>
  </section>
);
export default DelaminationStep;