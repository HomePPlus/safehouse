import { React, useState } from 'react';
import '../ChecklistForm.css';
import RadioGroup from '../RadioGroup';
const ConcreteCrackStep = ({ formData, handleInputChange, inspectionId }) => (
  <section className="checklist-section" data-step="crack">
    <div className="checklist-header">
      <div className="checklist-header-content">
        <h2 className="checklist-section-title">2. 균열 항목 체크리스트</h2>
        <h3 className="checklist-subtitle">[1] 콘크리트 균열</h3>
      </div>
      <div className="inspection-id-display">
        점검 ID: {inspectionId}
      </div>
    </div>
    <div className="checklist-grid">
      <div className="checklist-input-group">
        <RadioGroup
          title="균열의 형태"
          name="concrete_crack_type"
          options={['수평', '수직', '경사', '대각선']}
          value={formData.concreteCrack.crackType}
          onChange={(value) => handleInputChange('concreteCrack', 'crackType', value)}
        />
      </div>
      <div className="checklist-input-group crack-measurements-group">
        <div className="crack-measurements">
          <div className="crack-measurement-item">
            <label>균열의 길이:</label>
            <input 
              type="text" 
              name="concrete_crack_length_cm" 
              value={formData.concreteCrack.length} 
              onChange={(e) => handleInputChange('concreteCrack', 'length', e.target.value)} 
            />
            <span>(단위: cm)</span>
          </div>
          <div className="crack-measurement-item">
            <label>균열의 폭:</label>
            <input 
              type="text" 
              name="concrete_crack_width_mm" 
              value={formData.concreteCrack.width} 
              onChange={(e) => handleInputChange('concreteCrack', 'width', e.target.value)} 
            />
            <span>(단위: mm)</span>
          </div>
          <div className="crack-measurement-item">
            <label>균열의 깊이:</label>
            <input 
              type="text" 
              name="concrete_crack_depth_mm" 
              value={formData.concreteCrack.depth} 
              onChange={(e) => handleInputChange('concreteCrack', 'depth', e.target.value)} 
            />
            <span>(단위: mm)</span>
          </div>
        </div>
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="누수 여부"
          name="concrete_crack_leakage"
          options={['예', '아니오']}
          value={formData.concreteCrack.leakage}
          onChange={(value) => handleInputChange('concreteCrack', 'leakage', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="균열의 이동성"
          name="concrete_crack_movement"
          options={['이동 중', '고정됨']}
          value={formData.concreteCrack.movement}
          onChange={(value) => handleInputChange('concreteCrack', 'movement', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="균열의 변화 여부"
          name="concrete_crack_change"
          options={['확대 됨', '변화 없음']}
          value={formData.concreteCrack.change}
          onChange={(value) => handleInputChange('concreteCrack', 'change', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="건전성 평가"
          name="concrete_crack_condition"
          options={['위험 있음', '위험 없음']}
          value={formData.concreteCrack.condition}
          onChange={(value) => handleInputChange('concreteCrack', 'condition', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="응급처치 필요 여부"
          name="concrete_crack_emergency"
          options={['필요', '불필요']}
          value={formData.concreteCrack.emergency}
          onChange={(value) => handleInputChange('concreteCrack', 'emergency', value)}
        />
        {formData.concreteCrack.emergency === '필요' && (
          <div className="emergency-action-input">
            <label>응급 조치 사항:
              <input 
                type="text"
                name="concrete_crack_emergency_action"
                value={formData.concreteCrack.emergencyAction}
                onChange={(e) => handleInputChange('concreteCrack', 'emergencyAction', e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="수리 계획"
          name="concrete_crack_repair_plan"
          options={[
            '주입식 수리',
            '보강 작업',
            'V-컷 및 패칭',
            '표면 그라우팅',
            '스티칭',
            '균열 절단 및 재시공'
          ]}
          value={formData.concreteCrack.repairPlan}
          onChange={(value) => handleInputChange('concreteCrack', 'repairPlan', value)}
        />
      </div>
    </div>
  </section>
);
export default ConcreteCrackStep;
