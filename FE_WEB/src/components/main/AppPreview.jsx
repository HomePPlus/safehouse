import React from 'react';
import AppCardComponent from './AppCardComponent';
import './AppPreview.css';

const AppPreview = () => {
  const sections = [
    {
      id: 1,
      title: "신고하기",
      description: "실시간 AI 결함 진단으로 빠르고 정확한 신고가 가능합니다",
      screens: [
        {
          id: 'report_1',
          imageUrl: require('../../assets/images/app/report_1.jpg')
        },
        {
          id: 'report_2',
          imageUrl: require('../../assets/images/app/report_2.png')
        },
        {
          id: 'report_3',
          imageUrl: require('../../assets/images/app/report_3.png')
        },
        {
          id: 'report_4',
          imageUrl: require('../../assets/images/app/report_4.png')
        },
        {
          id: 'report_5',
          imageUrl: require('../../assets/images/app/report_5.png')
        }
      ]
    },
    {
      id: 2,
      title: "대시보드",
      description: "한눈에 보는 결함 통계와 관리 현황",
      screens: [
        {
          id: 'dashboard_1',
          imageUrl: require('../../assets/images/app/dashboard_1.png')
        },
        {
          id: 'dashboard_2',
          imageUrl: require('../../assets/images/app/dashboard_2.png')
        },
        {
          id: 'dashboard_3',
          imageUrl: require('../../assets/images/app/dashboard_3.png')
        },
        {
          id: 'dashboard_4',
          imageUrl: require('../../assets/images/app/dashboard_4.png')
        },
        {
          id: 'dashboard_5',
          imageUrl: require('../../assets/images/app/dashboard_5.png')
        }
      ]
    },
    {
      id: 3,
      title: "체크리스트",
      description: "체계적인 점검과 보고서 자동 생성",
      screens: [
        {
          id: 'checklist_1',
          imageUrl: require('../../assets/images/app/checklist_1.png')
        },
        {
          id: 'checklist_2',
          imageUrl: require('../../assets/images/app/checklist_2.jpg')
        },
        {
          id: 'checklist_3',
          imageUrl: require('../../assets/images/app/checklist_3.png')
        },
        {
            id: 'checklist_4',
            imageUrl: require('../../assets/images/app/checklist_4.png')
          },
        {
            id: 'checklist_5',
            imageUrl: require('../../assets/images/app/checklist_5.jpg')
          },
        
        {
          id: 'checklist_6',
          imageUrl: require('../../assets/images/app/checklist_6.png')
        }
      ]
    }
  ];

  return (
    <div className="appcard-container">
      <h2 className="appcard-title">안주 앱 화면 미리보기</h2>
      <div className="appcard-sections">
        {sections.map((section) => (
          <div 
            key={section.id} 
            className={`appcard-section ${
              section.title === "대시보드" ? 'preview-dashboard-section' : ''
            }`}
          >
            <div className="section-header">
              <h3 className="section-title">{section.title}</h3>
              <p className="section-description">{section.description}</p>
            </div>
            <div className="section-screens">
              {section.screens.map((screen) => (
                <div key={screen.id} className="appcard-item">
                  <AppCardComponent
                    imageUrl={screen.imageUrl}
                    isPreview={true}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppPreview; 