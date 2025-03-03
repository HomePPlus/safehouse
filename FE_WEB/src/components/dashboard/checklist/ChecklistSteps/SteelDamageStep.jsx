import { React, useState } from 'react';
import '../ChecklistForm.css';
import RadioGroup from '../RadioGroup';

const SteelDamageStep = ({ formData, handleInputChange, inspectionId }) => (
  <section className="checklist-section" data-step="steel">
    <div className="checklist-header">
      <div className="checklist-header-content">
        <h2 className="checklist-section-title">2. 균열 항목 체크리스트</h2>
        <h3 className="checklist-subtitle">[3] 강재 부식</h3>
      </div>
      <div className="inspection-id-display">
        점검 ID: {inspectionId}
      </div>
    </div>
    <div className="checklist-grid">
      <div className="checklist-input-group">
        <RadioGroup
          title="손상상 범위"
          name="steel_damage_range"
          options={['소규모', '중규모', '대규모']}
          value={formData.steelDamage.damageRange}
          onChange={(value) => handleInputChange('steelDamage', 'damageRange', value)}
        />
      </div>
      <div className="checklist-input-group">
        <RadioGroup
                    title="손상 정도"
                    name="steel_damage_severity"
                    options={['부식', '찌그러짐', '파손']}
                    value={formData.steelDamage.damageSeverity}
                    onChange={(value) => handleInputChange('steelDamage', 'damageSeverity', value)}
                  />
                </div>
                <div className="checklist-input-group">
                  <RadioGroup
                    title="손상의 원인"
                    name="steel_damage_cause"
                    options={[
                      '시공 및 제작 결함',
                      '피로 및 반복 하중',
                      '열적 영향 및 온도 변화',
                      '구조적 문제',
                      '충격 및 외부 요인'
                    ]}
                    value={formData.steelDamage.damageCause}
                    onChange={(value) => handleInputChange('steelDamage', 'damageCause', value)}
                  />
                </div>
                <div className="checklist-input-group">
                  <RadioGroup
                    title="구조적 안전성에 미치는 영향"
                    name="steel_damage_stability_impact"
                    options={['안전성에 영향 없음', '안전성에 영향 있음']}
                    value={formData.steelDamage.stabilityImpact}
                    onChange={(value) => handleInputChange('steelDamage', 'stabilityImpact', value)}
                  
      />
                    </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="응급처치 필요 여부"
          name="steel_damage_emergency"
          options={['필요', '불필요']}
          value={formData.steelDamage.emergency}
          onChange={(value) => handleInputChange('steelDamage', 'emergency', value)}
        />
        {formData.steelDamage.emergency === '필요' && (
          <div className="emergency-action-input">
            <label>응급 조치 사항:
              <input 
                type="text"
                name="steel_damage_emergency_action"
                value={formData.steelDamage.emergencyAction}
                onChange={(e) => handleInputChange('steelDamage', 'emergencyAction', e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
      <div className="checklist-input-group">
        <RadioGroup
          title="수리 계획"
          name="steel_damage_repair_plan"
          options={[
            '방청 처리',
            '강재 교체',
            '보강 작업',
            '표면 처리'
          ]}
          value={formData.steelDamage.repairPlan}
          onChange={(value) => handleInputChange('steelDamage', 'repairPlan', value)}
        />
      </div>
    </div>
  </section>
);

export default SteelDamageStep;
