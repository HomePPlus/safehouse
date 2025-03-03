import { React, useState } from 'react';
import '../ChecklistForm.css';
import RadioGroup from '../RadioGroup';
const PaintDamageStep = ({ formData, handleInputChange, inspectionId }) => (
  <section className="checklist-section" data-step="paint">
    <div className="checklist-header">
      <div className="checklist-header-content">
        <h2 className="checklist-section-title">2. 균열 항목 체크리스트</h2>
        <h3 className="checklist-subtitle">[6] 도장 손상</h3>
      </div>
      <div className="inspection-id-display">
        점검 ID: {inspectionId}
      </div>
    </div>
    <div className="checklist-grid">
      <div className="checklist-input-group">
        <RadioGroup
          title="손상 범위"
          name="paint_damage_range"
          options={['소규모', '중규모', '대규모']}
          value={formData.paintDamage.damageRange}
          onChange={(value) => handleInputChange('paintDamage', 'damageRange', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="손상의 원인"
          name="paint_damage_cause"
          options={[
            '재료적 원인',
            '시공 불량',
            '환경적 원인',
            '구조적 요인'
          ]}
          value={formData.paintDamage.damageCause}
          onChange={(value) => handleInputChange('paintDamage', 'damageCause', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="손상의 상태"
          name="paint_damage_condition"
          options={['표면 손상', '깊은 손상']}
          value={formData.paintDamage.damageCondition}
          onChange={(value) => handleInputChange('paintDamage', 'damageCondition', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="응급처치 필요 여부"
          name="paint_damage_emergency"
          options={['필요', '불필요']}
          value={formData.paintDamage.emergency}
          onChange={(value) => handleInputChange('paintDamage', 'emergency', value)}
        />
        {formData.paintDamage.emergency === '필요' && (
          <div className="emergency-action-input">
            <label>응급 조치 사항:
              <input 
                type="text"
                name="paint_damage_emergency_action"
                value={formData.paintDamage.emergencyAction}
                onChange={(e) => handleInputChange('paintDamage', 'emergencyAction', e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="수리 계획"
          name="paint_damage_repair_plan"
          options={[
            '균열 수리',
            '박리 및 들뜸 수리',
            '기포 및 블리스터 수리',
            '분말화 수리',
            '변색 및 오염 수리'
          ]}
          value={formData.paintDamage.repairPlan}
          onChange={(value) => handleInputChange('paintDamage', 'repairPlan', value)}
        />
      </div>
    </div>
  </section>
);
export default PaintDamageStep;
