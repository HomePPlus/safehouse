import { React, useState } from 'react';
import '../ChecklistForm.css';
import RadioGroup from '../RadioGroup';

const RebarExposureStep = ({ formData, handleInputChange, inspectionId }) => (
  <section className="checklist-section" data-step="rebar">
    <div className="checklist-header">
      <div className="checklist-header-content">
        <h2 className="checklist-section-title">2. 균열 항목 체크리스트</h2>
        <h3 className="checklist-subtitle">[5] 철근 노출</h3>
      </div>
      <div className="inspection-id-display">
        점검 ID: {inspectionId}
      </div>
    </div>
    <div className="checklist-grid">
      <div className="checklist-input-group">
        <RadioGroup
          title="노출 범위"
          name="rebar_exposure_range"
          options={['소규모', '중규모', '대규모']}
          value={formData.rebarExposure.exposureRange}
          onChange={(value) => handleInputChange('rebarExposure', 'exposureRange', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="노출된 철근 상태"
          name="rebar_exposure_condition"
          options={['부식 없음', '경미한 부식', '심각한 부식']}
          value={formData.rebarExposure.exposureCondition}
          onChange={(value) => handleInputChange('rebarExposure', 'exposureCondition', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="노출의 원인"
          name="rebar_exposure_cause"
          options={[
            '시공 불량',
            '재료적 문제',
            '환경 요인',
            '구조적 문제'
          ]}
          value={formData.rebarExposure.exposureCause}
          onChange={(value) => handleInputChange('rebarExposure', 'exposureCause', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="구조적 안전성에 미치는 영향"
          name="rebar_exposure_stability_impact"
          options={['안전성에 영향 없음', '안전성에 영향 있음']}
          value={formData.rebarExposure.stabilityImpact}
          onChange={(value) => handleInputChange('rebarExposure', 'stabilityImpact', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="응급처치 필요 여부"
          name="rebar_exposure_emergency"
          options={['필요', '불필요']}
          value={formData.rebarExposure.emergency}
          onChange={(value) => handleInputChange('rebarExposure', 'emergency', value)}
        />
        {formData.rebarExposure.emergency === '필요' && (
          <div className="emergency-action-input">
            <label>응급 조치 사항:
              <input 
                type="text"
                name="rebar_exposure_emergency_action"
                value={formData.rebarExposure.emergencyAction}
                onChange={(e) => handleInputChange('rebarExposure', 'emergencyAction', e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="수리 계획"
          name="rebar_exposure_repair_plan"
          options={[
            '철근 교체 및 추가 보강',
            '방청 처리',
            '보수 모르타르 충전',
            '표면 마감',
            'FRP 보강재 및 강판 보강 적용'
          ]}
          value={formData.rebarExposure.repairPlan}
          onChange={(value) => handleInputChange('rebarExposure', 'repairPlan', value)}
        />
      </div>
    </div>
  </section>
);
export default RebarExposureStep;
