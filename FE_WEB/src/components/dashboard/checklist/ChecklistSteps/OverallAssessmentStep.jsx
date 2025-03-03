import { React } from 'react';
import '../ChecklistForm.css';
import RadioGroup from '../RadioGroup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';

const OverallAssessmentStep = ({ formData, handleInputChange, inspectionId }) => {
  // 날짜 선택 핸들러
  const handleDateChange = (date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    console.log(`handleInputChange called: {section: 'overallAssessment', field: 'nextInspectionDate', value: '${formattedDate}'}`); // 로깅 추가
    handleInputChange('overallAssessment', 'nextInspectionDate', formattedDate);
  };

  // 문자열 날짜를 Date 객체로 변환
  const selectedDate = formData.overallAssessment.nextInspectionDate 
    ? new Date(formData.overallAssessment.nextInspectionDate) 
    : new Date(); // 기본값으로 현재 날짜 설정

  console.log(`선택된 날짜: ${selectedDate}`); // 로깅 추가

  return (
    <section className="checklist-section">
      <div className="checklist-header">
        <div className="checklist-header-content">
          <h2 className="checklist-section-title">3. 종합 평가</h2>
        </div>
        <div className="inspection-id-display">
          점검 ID: {inspectionId}
        </div>
      </div>
      <div className="checklist-grid">
        <div className="checklist-input-group">
          <RadioGroup
            title="전체 점검 결과"
            name="overall_result"
            options={[
              '안전성에 문제 없음',
              '구조적 문제 발생 가능성 있음'
            ]}
            value={formData.overallAssessment.overallResult}
            onChange={(value) => handleInputChange('overallAssessment', 'overallResult', value)}
            required
          />
        </div>
        <div className="checklist-input-group">
          <RadioGroup
            title="모니터링 필요 여부"
            name="monitoring_required"
            options={['필요', '불필요']}
            value={formData.overallAssessment.monitoringRequired}
            onChange={(value) => handleInputChange('overallAssessment', 'monitoringRequired', value)}
          />
        </div>
        <div className="checklist-input-group">
          <div className="basic-info-input">
            <label>다음 점검 일정:</label>
            <DatePicker
              selected={selectedDate} // 올바른 날짜 선택
              onChange={handleDateChange} // 날짜 선택 핸들러
              dateFormat="yyyy-MM-dd"
              locale={ko}
              className="date-picker-input"
              placeholderText="날짜를 선택하세요"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverallAssessmentStep;
