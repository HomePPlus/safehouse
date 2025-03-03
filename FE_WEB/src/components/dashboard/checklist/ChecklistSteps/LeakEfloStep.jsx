import { React, useState } from 'react';
import '../ChecklistForm.css';
import RadioGroup from '../RadioGroup';

const LeakEfloStep = ({ formData, handleInputChange, inspectionId }) => (
  <section className="checklist-section" data-step="leak">
    <div className="checklist-header">
      <div className="checklist-header-content">
        <h2 className="checklist-section-title">2. 균열 항목 체크리스트</h2>
        <h3 className="checklist-subtitle">[2] 누수/백태</h3>
      </div>
      <div className="inspection-id-display">
        점검 ID: {inspectionId}
      </div>
    </div>
    <div className="checklist-grid">
      <div className="checklist-input-group">
        <RadioGroup
          title="손상 범위"
          name="leak_eflo_range"
          options={['소규모', '중규모', '대규모']}
          value={formData.leakEflo.damageRange}
          onChange={(value) => handleInputChange('leakEflo', 'damageRange', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="누수의 원인"
          name="leak_eflo_cause"
          options={[
            '기온 변화',
            '습도 변화',
            '시공 결함',
            '재료적 원인',
            '배수 및 통풍 문제'
          ]}
          value={formData.leakEflo.cause}
          onChange={(value) => handleInputChange('leakEflo', 'cause', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="응급처치 필요 여부"
          name="leak_eflo_emergency"
          options={['필요', '불필요']}
          value={formData.leakEflo.emergency}
          onChange={(value) => handleInputChange('leakEflo', 'emergency', value)}
        />
        {formData.leakEflo.emergency === '필요' && (
          <div className="emergency-action-input">
            <label>응급 조치 사항:
              <input 
                type="text"
                name="leak_eflo_emergency_action"
                value={formData.leakEflo.emergencyAction}
                onChange={(e) => handleInputChange('leakEflo', 'emergencyAction', e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="수리 계획"
          name="leak_eflo_repair_plan"
          options={[
            '방수 처리',
            '배수 시스템 점검',
            '균열 보수',
            '표면 복원 작업',
            '내부 압력 차단',
            '그라우팅 주입',
            '구조적 개선'
          ]}
          value={formData.leakEflo.repairPlan}
          onChange={(value) => handleInputChange('leakEflo', 'repairPlan', value)}
        />
      </div>
    </div>
  </section>
);

export default LeakEfloStep;
