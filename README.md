# 🏡 AI가 만드는 편안한 안식처 - "안주"

> **노후 주택 안전 AI 프로젝트** - KT AIVLE School 6기 빅프로젝트  
> 노후 건축물 안전점검을 위한 AI 기반 결함 탐지 및 자동 보고 시스템

![poster](https://github.com/user-attachments/assets/1f62d13f-e62d-45e5-9a6d-efd08fc9d8ee)

📅 **개발 기간**: 2025년 1월 2일 ~ 2월 17일

---

## 🌟 프로젝트 소개
**안주**는 건물의 구조적 결함을 신속하게 탐지하고, 이를 자동으로 문서화하여 보고서를 생성하는 AI 솔루션 서비스입니다.  
노후 건축물의 유지보수를 돕고, 입주민의 안전 보장과 점검자의 업무 효율성을 높이는 것을 목표로 합니다.

<img width="700" alt="image" src="https://github.com/user-attachments/assets/361cc837-947f-4b16-ad69-7ccb5c313400" />


### 🔍 주요 서비스 내용
1. 입주민 서비스
- AI 결함 모델 체험 : 입주민이 AI 결함 모델을 체험함으로써 그에 대한 정보를 얻고, 노후주택 관리에 대한 관심과 자발적 참여 유도.
- AI 결함 탐지 및 신고 : AI 기술을 활용하여 건축물의 균열, 박리, 철근 노출 등의 결함을 자동으로 탐지하고, 입주민이 이를 확인하고 신고할 수 있는 시스템을 제공.

2. 점검자 서비스
- 신고에 대한 분석 결과 저장 및 위험 점수 표기 : 점검자가 결함 분석 시 AI 분석 결과를 참고하여 더욱 정확한 분석 가능. 위험 점수를 확인하여 결함 위험도 파악.
- 대시보드 및 실시간 현황 관리 시스템 : 웹 및 모바일 대시보드를 통해 점검 예약과 보고서를 자동화. 결함 통계와 예약 일정 등을 시각적으로 제공하며 지도와 연동하여 위치 기반 점검 관리 지원.
- LangChain 기반 AI 자동 보고서 생성 : 점검자가 작성한 점검 체크리스트를 기반으로 보고서를 생성하여 문서 업무 부담을 줄이고 효율성을 높임.
  
### 🎯 활용 데이터  
노후 건물 결함 이미지 데이터 (**[AIHub 건물 균열 탐지 이미지](https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=&topMenu=&aihubDataSe=data&dataSetSn=162)**, **[AIHub 건물 균열 탐지 이미지(고도화)](https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=&topMenu=&aihubDataSe=data&dataSetSn=71769)**), 점검 체크리스트 데이터  


---

## 🛠️ Tech Stack

| Category      | Tech Stack |
|--------------|--------------------------------|
| **CV (Defect Detection)** | ![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white) ![YOLO](https://img.shields.io/badge/YOLO-00FFFF?style=flat&logo=opencv&logoColor=white) |
| **LLM & RAG (Document Processing & Search)** | ![ChatGPT-4](https://img.shields.io/badge/ChatGPT--4-412991?style=flat&logo=openai&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-ffb703?style=flat&logo=python&logoColor=white) ![OpenAI API](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white) |
| **Data Processing & Analysis** | ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat&logo=pandas&logoColor=white) ![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white) |
| **Data Visualization & Image Processing** | ![Matplotlib](https://img.shields.io/badge/Matplotlib-3776AB?style=flat&logo=python&logoColor=white) ![Pillow](https://img.shields.io/badge/Pillow-FFC0CB?style=flat&logo=python&logoColor=white) |
| **Report Automation** | ![FPDF](https://img.shields.io/badge/FPDF-FF6F00?style=flat&logo=adobeacrobatreader&logoColor=white) |
| **Backend**   | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) ![Java](https://img.shields.io/badge/Java-007396?style=flat&logo=openjdk&logoColor=white) ![Spring](https://img.shields.io/badge/Spring-6DB33F?style=flat&logo=spring&logoColor=white) |
| **Frontend**  | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white) ![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat&logo=react&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white) |
| **Database**  | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) |
| **DevOps**    | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) ![Azure](https://img.shields.io/badge/Azure-0078D4?style=flat&logo=microsoft-azure&logoColor=white) |
| **Security**  | ![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat&logo=spring&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white) |
| **Tools**  | ![Notion](https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white) ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat&logo=figma&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white) ![ERDCloud](https://img.shields.io/badge/ERDCloud-0080FF?style=flat&logoColor=white) |

---

## 🏗️ System Architecture

![architecture](https://github.com/user-attachments/assets/7550dc0d-ba7c-4910-9701-3e8381c641d6)


---

## 📖 Documentation

📌 **Notion**: [Project Documentation](https://scarce-sweatshirt-fdb.notion.site/19db1ca2aef380a58b14e2b04e3dc611?pvs=4)

📌 **Project Review**: [Testimonials](https://drive.google.com/file/d/1k76NBAO6u8DexW48oakvgDsmSix5Zx90/view)

📌 **PPT**: [Slides](https://drive.google.com/file/d/1H_tA5ZEzs_UweFeldMJ2lhI6RDpdx3oW/view)

---

## 🤝 Team Members

<table align="center">
  <tr>
    <th style="text-align:center"> </th>
    <th style="text-align:center">이건호</th>
    <th style="text-align:center">김경훈</th>
    <th style="text-align:center">남지윤</th>
    <th style="text-align:center">문소연</th>
    <th style="text-align:center">이예찬</th>
  </tr>
  <tr>
    <td></td>
    <td align="center"><img src="https://github.com/gh-56.png" width="120"></td>
    <td align="center"><img src="https://github.com/KK-Hoon.png" width="120"></td>
    <td align="center"><img src="https://github.com/jiva-z.png" width="120"></td>
    <td align="center"><img src="https://github.com/dotz0ver.png" width="120"></td>
    <td align="center"><img src="https://github.com/yechan47.png" width="120"></td>
  </tr>
  <tr>
    <td><strong>담당</strong></td>
    <td align="center"><strong>PM / DevOps</strong></td>
    <td align="center"><strong>Backend Lead</strong></td>
    <td align="center"><strong>PL / Tech Lead</strong></td>
    <td align="center"><strong>Co-AI Lead</strong></td>
    <td align="center"><strong>Co-AI Lead</strong></td>
  </tr>
  <tr>
    <td><strong>역할</strong></td>
    <td align="center">
      - 애플리케이션 컨테이너화 및 배포 <br>
      - CORS 설정으로 요청 문제 해결 <br>
      - 클라우드 환경에 DB와 저장소 구축 <br>
      - Docker와 Azure Webhooks로 CI/CD 구현 <br>
      - 네이버/구글 지도 API를 통한 결함 위치 시각화
    </td>
    <td align="center">
      - FastAPI 기반 RESTful API 구현 및 통합 <br>
      - Azure Storage Container에 데이터 업로드 및 다운로드 기능 구현 <br>
      - CRUD 작업을 위한 엔드포인트 구현 및 최적화 <br>
      - 점검자 체크리스트 DB 설계 및 생성 <br>
      - 입주민/점검자 커뮤니티 API 구현 <br>
      - 웹 에러페이지 개발 및 CSS 스타일링 최적화
    </td>
    <td align="center">
      - 결함 탐지 모델 성능 개선 (튜닝, 최적화) <br>
      - RESTful API 설계 및 JPA를 활용한 DB 최적화 <br>
      - JWT 기반 인증 및 RBAC 구현 <br>
      - FastAPI 기반 결함 탐지 및 신고 기능 API 구현 <br>
      - 대시보드 통계 및 일정 관리 API 구현 <br>
      - React, GSAP, Three.js 사용한 실시간 대시보드 및 애니메이션 UI 설계 및 구현
    </td>
    <td align="center">
      - 건축물 결함 탐지 AI 모델 개발 (YOLO) <br>
      - 이미지 전처리 및 데이터셋 구축 <br>
      - 결함 탐지 모델 성능 개선 (튜닝, 최적화) <br>
      - LangChain을 활용한 보고서 구성 <br>
      - FastAPI를 활용한 CV 모델 배포
    </td>
    <td align="center">
      - LLM 기반 보고서 자동 생성 (GPT-4, LangChain) <br>
      - 데이터 검색 및 RAG (Retrieval-Augmented Generation) 구현 <br>
      - 결함 탐지 모델 성능 개선 (튜닝, 최적화) <br>
      - LangChain을 활용한 문서 요약 및 보고서 구성 <br>
      - LLM 프롬프트 최적화 및 성능 개선
    </td>
  </tr>
  <tr>
    <td><strong>GitHub</strong></td>
    <td align="center"><a href="https://github.com/gh-56">GitHub</a></td>
    <td align="center"><a href="https://github.com/KK-Hoon">GitHub</a></td>
    <td align="center"><a href="https://github.com/jiva-z">GitHub</a></td>
    <td align="center"><a href="https://github.com/dotz0ver">GitHub</a></td>
    <td align="center"><a href="https://github.com/yechan47">GitHub</a></td>
  </tr>
</table>



---
