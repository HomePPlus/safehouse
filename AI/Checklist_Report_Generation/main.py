import os
import pandas as pd
from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fpdf import FPDF
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_community.tools import DuckDuckGoSearchRun
from dotenv import load_dotenv
from typing import List
import re


# ✅ 환경 변수 로드
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ✅ FastAPI 앱 생성
app = FastAPI()

# ✅ 템플릿 설정
templates = Jinja2Templates(directory="templates")

# ✅ GPT-4 모델 설정
llm = ChatOpenAI(model="gpt-4", temperature=0, openai_api_key=OPENAI_API_KEY)

# ✅ DuckDuckGo 검색 엔진 (RAG)
search_tool = DuckDuckGoSearchRun()

# ✅ PDF 저장 폴더
PDF_OUTPUT_FOLDER = "C:/Users/User/Desktop/Report_pipeline/reports"
os.makedirs(PDF_OUTPUT_FOLDER, exist_ok=True)

# ✅ 나눔고딕 폰트 경로 설정
FONT_PATH_REGULAR = "C:/Users/User/Desktop/Report_pipeline/font/NotoSansKR-Regular.ttf"
FONT_PATH_BOLD = "C:/Users/User/Desktop/Report_pipeline/font/NotoSansKR-Bold.ttf"

# ✅ 전역 프롬프트 템플릿
REPORT_PROMPT = """
1. 기본 정보
■ 점검 번호: {점검 번호}
■ 점검 일자: {점검 일자}
■ 점검자: {점검자 이름}
■ 연락처: {점검자 연락처}
■ 주소: {주소}
■ 결함 형태: {결함 형태}

2. 점검 결과 분석
{점검 결과}

3. 응급 조치 및 수리 계획
{수리 계획}

4. 종합 평가 및 향후 계획
{종합 평가}

5. 추가 고려 사항
{추가 고려 사항}
---
### **요청 사항 (명령 추가)**
■ 요청 사항은 결과에 안나오게 하세요.
■ 이 보고서는 점검자가 감독자에게 제출하는 보고서 입니다.
■ 감독자가 점검 결과를 쉽게 이해할 수 있도록 **명확한 보고서 형식**을 유지하세요.
■ #### **점검 결과 분석**  이말은 안나오게 해라
■ **점검 결과 분석**에서 점검된 항목이 없을 경우 무작위의 점검 결과를 표기하고, 필요 시 "추가 점검 권장"을 명시하세요.
■ **응급 조치 및 수리 계획**에서는 현재 조치된 사항과 향후 계획을 나눠서 작성하세요.
■ **응급 조치 및 수리 계획**와 **종합 평가**에서 내용을 구체적으로 명시하세요
■ **종합 평가**에는 점검자의 의견이 포함되어야 하며, 감독자가 이해하기 쉬운 **명확한 조치**를 제시하세요.
■ 모든 항목은 **간결하고 핵심만 포함**하도록 작성하세요.
■ **응급 조치 및 수리 계획**에서 수리 계획을 좀 더 자세하게 풀어서 구체적으로 명시하세요
■ **종합 평가**에서 향후 계획을 좀 더 구체적으로 풀어서 자세하게 명시하세요
■ **수리 계획**, **종합 평가**, **향후 계획**은 간결하게 명시할 필요가 없다. 내용을 꼭 자세하고 구체적이게 명시하세요
■ 수리 계획이 필요 없는 경우, "즉시 조치 필요 없음"이라고 명확히 기재하세요.
■ **5. 추가 고려 사항**에서 이 균열에 대하여 수리나 관리 함에 필요한 정보들을 최대한 많이 그리고 간결하게 명시하세요
■ 전문가가 작성하는 보고서 이기에 균열에 대한 기본 정보나 다른 전문가와 상의하는 내용은 없어야 한다
■ **수리 계획**, **종합 평가**, **향후 계획**은 점검 결과에서 나온 내용을 바탕으로 더 구체적으로 명시하세요
---
"""

# ✅ 홈 페이지
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# ✅ 균열 유형별 데이터 정리
def get_section(fields, title, row, defect_type=None, index=None):
    info = [f"- {field.replace('_', ' ')}: {row.get(field, '정보 없음')}" 
            for field in fields if row.get(field)]
    
    # 결함 형태별 소제목 추가
    if defect_type and info:
        if index:  # ✅ 인덱스가 있을 때만 번호 표시
            return f"\n### **2-{index} {defect_type}**\n" + "\n".join(info)
        else:
            return f"\n### **{defect_type}**\n" + "\n".join(info)

    return f"\n#### **{title}**\n" + "\n".join(info) if info else "해당 없음"

# ✅ 최신 수리 방법 검색 (RAG 적용)
def search_external_info(defect_type):
    search_query = f"{defect_type} 안전 기준 및 수리 방법"
    return search_tool.run(search_query)

# ✅ 보고서 생성
def generate_report(row):
    print("\n📌 [디버깅] generate_report()에서 받은 데이터:", row)

    # ✅ 균열 형태가 리스트일 경우, 문자열로 변환해서 저장
    if isinstance(row["결함 형태"], list):
        row["결함 형태"] = ", ".join(row["결함 형태"])  # 리스트 → 문자열 변환
    
    print("\n📌 [디버깅] 변환된 결함 형태 값:", row["결함 형태"])

    defect_types = {
        "콘크리트 균열": [
        "콘크리트 균열_균열 형태",
        "콘크리트 균열_균열 길이(cm)",
        "콘크리트 균열_균열 폭(mm)",
        "콘크리트 균열_균열 깊이(mm)",
        "콘크리트 균열_누수 여부",
        "콘크리트 균열_균열 이동성",
        "콘크리트 균열_균열 변화 여부",
        "콘크리트 균열_건전성 평가",
        "콘크리트 균열_응급 처치 필요 여부",
        "콘크리트 균열_응급 조치 사항",
        "콘크리트 균열_수리 계획"
    ],
 
    # ✅ 누수/백태
    "누수/백태": [
        "누수/백태_누수 발생 범위",
        "누수/백태_누수 원인",
        "누수/백태_백태 발생 여부",
        "누수/백태_누수 및 백태의 영향",
        "누수/백태_응급처치 필요 여부",
        "누수/백태_응급 조치 사항",
        "누수/백태_수리 계획"
    ],
 
    # ✅ 강재 손상
    "강재 손상": [
        "강재 손상_손상 범위",
        "강재 손상_손상 정도",
        "강재 손상_손상 원인",
        "강재 손상_구조적 안전성에 미치는 영향",
        "강재 손상_응급처치 필요 여부",
        "강재 손상_응급 조치 사항",
        "강재 손상_수리 계획"
    ],
 
    # ✅ 박리
    "박리": [
        "박리_박리 범위",
        "박리_박리 원인",
        "박리_구조적 안전성에 미치는 영향",
        "박리_응급처치 필요 여부",
        "박리_응급 조치 사항",
        "박리_수리 계획"
    ],
 
    # ✅ 철근 노출
    "철근 노출": [
        "철근 노출_노출 범위",
        "철근 노출_노출된 철근 상태",
        "철근 노출_노출 원인",
        "철근 노출_구조적 안전성에 미치는 영향",
        "철근 노출_응급처치 필요 여부",
        "철근 노출_응급 조치 사항",
        "철근 노출_수리 계획"
    ],
 
    # ✅ 도장 손상
    "도장 손상": [
        "도장 손상_손상 범위",
        "도장 손상_손상 원인",
        "도장 손상_손상 상태",
        "도장 손상_응급처치 필요 여부",
        "도장 손상_응급 조치 사항",
        "도장 손상_수리 계획"
    ]
    }

    점검_결과 = "## 2. 점검 결과 분석\n\n"  # 제목 추가 및 초기화!
    for idx, defect_type in enumerate(row["결함 형태"].split(", "), start=1):
        section_keys = defect_types.get(defect_type, [])
        
        # ✅ 소제목 형식 유지: "2-1. 콘크리트 균열"
        점검_결과 += f"### 2-{idx}. {defect_type}\n\n"  # 마크다운 (h3)
        점검_결과 += get_section(section_keys, "점검 결과 분석", row, defect_type)  # idx 제거
        점검_결과 += "\n\n"  # 여백 추가
        
    external_info = search_external_info(row["결함 형태"])

    수리_계획 = get_section(["응급처치_필요_여부", "수리_계획"], "응급 조치 및 수리 계획", row)
    if external_info:
        수리_계획 += f"\n\n**✅ 최신 전문가 권장 사항:**\n{external_info}"

    종합_평가 = get_section(["종합_평가"], "종합 평가 및 향후 계획", row)
    if external_info:
        종합_평가 += f"\n\n**📌 추가 고려 사항:**\n{external_info}"
        
    data = {
        "점검 번호": row["점검 번호"],
        "점검 일자": row["점검 일자"],
        "점검자 이름": row["점검자 이름"],
        "점검자 연락처": row["점검자 연락처"],
        "주소": row["주소"],
        "결함 형태": row["결함 형태"],
        "점검 결과": 점검_결과,
        "수리 계획": 수리_계획,
        "종합 평가": 종합_평가,
        "추가 고려 사항": external_info
    }

    report_text = REPORT_PROMPT.format(**data)
    report_message = llm.invoke(report_text)
    return report_message.content if hasattr(report_message, "content") else str(report_message)

# ✅ PDF 저장
def save_to_pdf(report_text, report_id):
    class PDF(FPDF):
        def header(self):
            self.set_font("NotoSansKR", 'B', 18)
            self.cell(0, 12, "점검 보고서", ln=True, align="C")
            self.ln(5)
 
        def footer(self):
            self.set_y(-15)
            self.set_font("NotoSansKR", '', 10)
            self.set_text_color(128, 128, 128)
            self.cell(0, 10, f"Page {self.page_no()}", 0, 0, "C")
 
        def add_main_table(self, data):
            col_widths = [25, 70, 25, 70]  # 4컬럼 구조
            row_height = 10
           
            self.set_font("NotoSansKR", 'B', 12)
           
           # ✅ 배경색 추가 (연한 회색)
            self.set_fill_color(220, 220, 220)
            self.cell(0, 12, "1. 기본 정보", ln=True, border="B", fill=True)  # ⬅ 배경 적용
            self.ln(2)
            
            self.set_font("NotoSansKR", '', 12)
            self.set_fill_color(255, 255, 255)  # 본문은 흰색 유지
            
            if len(data) % 2 == 1:
                data.append("")  # 홀수 개일 경우 빈 셀 추가
           
            for i in range(0, len(data), 2):
                row_data = data[i:i + 2]
                key1, value1 = row_data[0].replace('■', '').strip().split(": ", 1) if ": " in row_data[0] else (row_data[0], "")
                key2, value2 = row_data[1].replace('■', '').strip().split(": ", 1) if len(row_data) > 1 and ": " in row_data[1] else (row_data[1], "")

                # ✅ 현재 위치 저장
                x_start = self.get_x()
                y_start = self.get_y()
                
                # ✅ 각 셀의 높이 계산 (주소와 결함 형태가 늘어날 때 함께 늘어나도록)
                lines1 = len(value1) // 25 + 1 if key1 == "주소" else 1
                lines2 = len(value2) // 25 + 1 if key2 == "결함 형태" else 1
                max_lines = max(lines1, lines2)
                cell_height = row_height * max_lines
                
                # ✅ 첫 번째 인덱스 셀
                self.set_xy(x_start, y_start)
                self.cell(col_widths[0], cell_height, key1, border=1, align="C")
                
                # ✅ 첫 번째 값 셀 (주소 등)
                self.set_xy(x_start + col_widths[0], y_start)
                self.multi_cell(col_widths[1], row_height, value1, border=1)
                
                # ✅ 두 번째 인덱스 셀
                self.set_xy(x_start + col_widths[0] + col_widths[1], y_start)
                self.cell(col_widths[0], cell_height, key2, border=1, align="C")

                # ✅ 두 번째 값 셀 (결함 형태 등)
                self.set_xy(x_start + col_widths[0] * 2 + col_widths[1], y_start)
                self.multi_cell(col_widths[1], row_height, value2, border=1)

                # ✅ 다음 줄로 이동
                self.set_y(y_start + cell_height)
 
       
        def add_section(self, title, content):
            self.set_fill_color(220, 220, 220)  # 연한 회색 배경
            self.set_text_color(0, 0, 0)  # 텍스트 검은색
            self.set_font("NotoSansKR", 'B', 12)
            
            self.cell(0, 10, title, border="B", ln=True, align="L", fill=True)  # ⬅ 밑줄 추가 & 배경 적용
            self.ln(2)
            
            self.set_fill_color(255, 255, 255)  # 본문은 흰색 유지
            self.set_text_color(0, 0, 0)  # 본문 텍스트도 검은색 유지
            self.set_font("NotoSansKR", '', 12)
            
            lines = content.split("\n")  # 본문을 줄 단위로 나누기

            for line in lines:
                line = line.strip()
                if not line:
                    continue  # 빈 줄 무시

                if line.startswith("###"):  # 🔥 "###"로 시작하는 제목 감지
                    line = line.replace("###", "").strip()  # "###" 제거
                    self.set_font("NotoSansKR", 'B', 14)  # 🔥 글자 크기 키우기 (기존 12 -> 14)
                    self.cell(0, 10, line, ln=True)  # 제목 출력
                    self.ln(2)
                    self.set_font("NotoSansKR", '', 12)  # 본문 크기로 복귀
                
                elif line.startswith("- "):  # 🔥 목록 항목 감지 (들여쓰기 적용)
                    indent = 10  # 들여쓰기 크기 설정 (10pt)
                    self.set_x(self.get_x() + indent)  # 들여쓰기 적용
                    self.multi_cell(0, 8, line, border=0)  # 목록 출력
                    self.set_x(self.get_x() - indent)  # 들여쓰기 해제
                    self.ln(1)  # 간격 추가    
                    
                else:
                    self.multi_cell(0, 8, line, border=0)  # 본문 출력 (테두리 제거)
                    self.ln(1)  # 간격 추가
        
   
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
 
    # ✅ 폰트 등록 (오류 방지)
    try:
        pdf.add_font('NotoSansKR', '', FONT_PATH_REGULAR, uni=True)
        pdf.add_font('NotoSansKR', 'B', FONT_PATH_BOLD, uni=True)
    except RuntimeError:
        pass  # 오류 발생해도 실행 계속
 
    pdf.set_font('NotoSansKR', '', 12)
    pdf.add_page()
 
    # ✅ 1. 기본 정보 추출 (표 형태로 만들기)
    lines = report_text.split("\n")
    basic_info = []
    remaining_text = []
    in_basic_info = True
    defect_sections = {}
    current_defect = ""
 
    for line in lines:
        line = line.strip()
        if not line:  # 빈 줄 무시
            continue

        if in_basic_info:
            if line.startswith("1. 기본 정보"):
                continue
            elif re.match(r"^2\.", line):  # ✅ "2." 형식 감지 (ex. "2. 점검 결과")
                in_basic_info = False
                remaining_text.append(line)  # ✅ "2." 섹션을 `remaining_text`에 추가
            else:
                basic_info.append(line)
            continue  # ✅ 기본 정보 처리 후 다음 줄로 이동

        if re.match(r"^2-\d+\.", line):  # ✅ "2-XX." 형식 감지 (ex. "2-1. 콘크리트 균열 형태")
            remaining_text.append(line)
            current_defect = line
            defect_sections[current_defect] = []
            continue  # ✅ "2-XX."는 `remaining_text`에 추가하지 않음

        elif current_defect:  # ✅ "2-XX."의 세부 항목 저장
            defect_sections[current_defect].append(line)
        
        else:
            remaining_text.append(line)  # ✅ "2.", "3.", "4.", "5." 등의 일반 텍스트 저장


    # ✅ 기본 정보 표로 추가
    if basic_info:
        pdf.add_main_table(basic_info)
        pdf.ln(5)
 
    # ✅ 점검 결과 데이터 출력
    if defect_sections:
        for defect, details in defect_sections.items():
            pdf.add_section(defect, "\n".join(details))
    
    # ✅ 3. 점검 결과, 수리 계획, 종합 평가 등 추가
    current_content = []
    current_title = ""
    processed_sections = set()
 
    for section in remaining_text:
        section = section.strip()

        if section:
            # ✅ "1.", "2.", "3.", "4.", "5." 형식의 일반 섹션 감지 → 개별 섹션으로 인식
            if re.match(r"^\d+\.", section) or re.match(r"^2-\d+\.", section):  # "2-"도 감지!
                if current_content and current_title and current_title not in processed_sections:
                    pdf.add_section(current_title, "\n".join(current_content))
                    processed_sections.add(current_title)
                current_content = []
                current_title = section  # 새 섹션 제목 설정

            else:
                current_content.append(section)  # 내용 추가

    # 마지막 섹션 추가
    if current_content and current_title and current_title not in processed_sections:
        pdf.add_section(current_title, "\n".join(current_content))
        processed_sections.add(current_title)  # 중복 방지

    # ✅ 5. 저장 폴더 확인 후 PDF 저장
    os.makedirs(PDF_OUTPUT_FOLDER, exist_ok=True)
    pdf_filename = f"{PDF_OUTPUT_FOLDER}/inspection_report_{report_id}.pdf"
    pdf.output(pdf_filename)
   
    return pdf_filename



# ✅ 폼 데이터 수신 및 CSV 저장 API     //Form(...) : 필수, Form(None) : 선택
@app.post("/submit_checklist/", response_class=HTMLResponse)
async def submit_checklist(
    request: Request,
    # 1. 기본정보
    inspection_id: str = Form(...),
    inspection_date: str = Form(...),
    inspector_name: str = Form(...),
    inspector_contact: str = Form(...),
    address: str = Form(...),
    

    # 2. 균열 항목 체크리스트
    # [1] 콘크리트 균열
    concrete_crack_type: str = Form(None),
    concrete_crack_length_cm: str = Form(None),
    concrete_crack_width_mm: str = Form(None),
    concrete_crack_depth_mm: str = Form(None),
    concrete_crack_leakage: str = Form(None),
    concrete_crack_movement: str = Form(None),
    concrete_crack_change: str = Form(None),
    concrete_crack_condition: str = Form(None),
    concrete_crack_emergency: str = Form(None),
    concrete_crack_emergency_action: str = Form(None),
    concrete_crack_repair_plan: str = Form(None),
    # [2] 누수/백태
    leak_eflo_leakage_range: str = Form(None),
    leak_eflo_leakage_cause: str = Form(None),
    leak_eflo_eflorescence: str = Form(None),
    leak_eflo_impact: str = Form(None),
    leak_eflo_emergency: str = Form(None),
    leak_eflo_emergency_action: str = Form(None),
    leak_eflo_repair_plan: str = Form(None),
    # [3] 강재 손상
    steel_damage_range: str = Form(None),
    steel_damage_severity: str = Form(None),
    steel_damage_cause: str = Form(None),
    steel_damage_stability_impact: str = Form(None),
    steel_damage_emergency: str = Form(None),
    steel_damage_emergency_action: str = Form(None),
    steel_damage_repair_plan: str = Form(None),
    # [4] 박리
    delamination_range: str = Form(None),
    delamination_cause: str = Form(None),
    delamination_stability_impact: str = Form(None),
    delamination_emergency: str = Form(None),
    delamination_emergency_action: str = Form(None),
    delamination_repair_plan: str = Form(None),
    # [5] 철근 노출
    rebar_exposure_range: str = Form(None),
    rebar_exposure_condition: str = Form(None),
    rebar_exposure_cause: str = Form(None),
    rebar_exposure_stability_impact: str = Form(None),
    rebar_exposure_emergency: str = Form(None),
    rebar_exposure_emergency_action: str = Form(None),
    rebar_exposure_repair_plan: str = Form(None),
    # [6] 도장 손상
    paint_damage_range: str = Form(None),
    paint_damage_cause: str = Form(None),
    paint_damage_condition: str = Form(None),
    paint_damage_emergency: str = Form(None),
    paint_damage_emergency_action: str = Form(None),
    paint_damage_repair_plan: str = Form(None),

    # 3. 종합 평가
    overall_result: str = Form(...),
    monitoring_required: str = Form(...),
    next_inspection_date: str = Form(None)
):
    try:
        form_data = await request.form()
        
        defect_type_list = []
        for key in form_data.keys():
            if "defect_type" in key:
                defect_type_list.extend(form_data.getlist(key))


        # 폼 데이터 수집    //왼쪽 칼럼, 오른쪽 name 
        form_data = {
            # 1. 기본정보
            "점검 번호": inspection_id,
            "점검 일자": inspection_date,
            "점검자 이름": inspector_name,
            "점검자 연락처": inspector_contact,
            "주소": address,
            "결함 형태": ", ".join(defect_type_list),

            # 2. 균열 항목 체크리스트
            # [1] 콘크리트 균열
            "콘크리트 균열_균열 형태": concrete_crack_type or "",
            "콘크리트 균열_균열 길이(cm)": concrete_crack_length_cm or "",
            "콘크리트 균열_균열 폭(mm)": concrete_crack_width_mm or "",
            "콘크리트 균열_균열 깊이(mm)": concrete_crack_depth_mm or "",
            "콘크리트 균열_누수 여부": concrete_crack_leakage or "",
            "콘크리트 균열_균열 이동성": concrete_crack_movement or "",
            "콘크리트 균열_균열 변화 여부": concrete_crack_change or "",
            "콘크리트 균열_건전성 평가": concrete_crack_condition or "",
            "콘크리트 균열_응급 처치 필요 여부": concrete_crack_emergency or "",
            "콘크리트 균열_응급 조치 사항": concrete_crack_emergency_action or "",
            "콘크리트 균열_수리 계획": concrete_crack_repair_plan or "",
            # [2] 누수/백태
            "누수/백태_누수 발생 범위": leak_eflo_leakage_range or "",
            "누수/백태_누수 원인": leak_eflo_leakage_cause or "",
            "누수/백태_백태 발생 여부": leak_eflo_eflorescence or "",
            "누수/백태_누수 및 백태의 영행": leak_eflo_impact or "",
            "누수/백태_응급처치 필요 여부": leak_eflo_emergency or "",
            "누수/백태_응급 조치 사항": leak_eflo_emergency_action or "",
            "누수/백태_수리 계획": leak_eflo_repair_plan,
            # [3] 강재 손상
            "강재 손상_손상 범위": steel_damage_range or "",
            "강재 손상_손상 정도": steel_damage_severity or "",
            "강재 손상_손상 원인": steel_damage_cause or "",
            "강재 손상_구조적 안전성에 미치는 영행": steel_damage_stability_impact or "",
            "강재 손상_응급처치 필요 여부": steel_damage_emergency or "",
            "강재 손상_응급 조치 사항": steel_damage_emergency_action or "",
            "강재 손상_수리 계획": steel_damage_repair_plan or "",
            # [4] 박리
            "박리_박리 범위": delamination_range or "",
            "박리_박리 원인": delamination_cause or "",
            "박리_구조적 안전성에 미치는 영향": delamination_stability_impact or "",
            "박리_응급처치 필요 여부": delamination_emergency or "",
            "박리_응급 조치 사항": delamination_emergency_action or "",
            "박리_수리 계획": delamination_repair_plan or "",
            # [5] 철근 노출
            "철근 노출_노출 범위": rebar_exposure_range or "",
            "철근 노출_노출된 철근 상태": rebar_exposure_condition or "",
            "철근 노출_노출 원인": rebar_exposure_cause or "",
            "철근 노출_구조적 안전성에 미치는 영향": rebar_exposure_stability_impact or "",
            "철근 노출_응급처치 필요 여부": rebar_exposure_emergency or "",
            "철근 노출_응급 조치 사항": rebar_exposure_emergency_action or "",
            "철근 노출_수리 계획": rebar_exposure_repair_plan or "",
            # [6] 도장 손상
            "도장 손상_손상 범위": paint_damage_range or "",
            "도장 손상_손상 원인": paint_damage_cause or "",
            "도장 손상_손상 상태": paint_damage_condition or "",
            "도장 손상_응급처치 필요 여부": paint_damage_emergency or "",
            "도장 손상_응급 조치 사항": paint_damage_emergency_action or "",
            "도장 손상_수리 계획": paint_damage_repair_plan or "",

            # 3. 종합 평가
            "전체 점검 결과": overall_result,
            "모니터링 필요 여부": monitoring_required,
            "다음 점검 일정": next_inspection_date or ""
        }

        # ✅ CSV로 저장
        csv_path = "C:/Users/User/Desktop/Report_pipeline/processed_checklists.csv"
        df = pd.DataFrame([form_data])

        if os.path.exists(csv_path):
            df.to_csv(csv_path, mode='a', index=False, header=False, encoding='utf-8-sig')
        else:
            df.to_csv(csv_path, index=False)

        # ✅ 보고서 생성 및 저장
        report_text = generate_report(form_data)
        pdf_filename = save_to_pdf(report_text, inspection_id)

        return templates.TemplateResponse("report_result.html", {"request": request, "reports": [{"점검 번호": inspection_id, "PDF 경로": pdf_filename}]})

    except Exception as e:
        return templates.TemplateResponse("error.html", {"request": request, "error_message": str(e)})
from fastapi.responses import FileResponse

# PDF 다운로드 API 추가
@app.get("/download/{report_id}", response_class=FileResponse)
async def download_pdf(report_id: str):
    pdf_path = f"{PDF_OUTPUT_FOLDER}/inspection_report_{report_id}.pdf"
    if os.path.exists(pdf_path):
        return FileResponse(path=pdf_path, filename=f"inspection_report_{report_id}.pdf", media_type='application/pdf')
    else:
        return {"error": "파일을 찾을 수 없습니다."}

# ✅ FastAPI 서버 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)