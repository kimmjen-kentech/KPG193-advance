# KPG-193 실시간 Multi-core Co-simulation 연구 정리

**출처:** 전국전력망 축약계통(KPG-193)의 실시간 시뮬레이션을 위한 Multi-core Co-simulation 구현  
**발표일:** 2026-05-19 · GML, 중앙대학교 에너지시스템공학부

---

## 1. KPG-193 시스템 개요

| 항목 | 내용 |
|------|------|
| 모선(Bus) | 193개 |
| 송전선(Branch) | 407개 |
| 발전기 | 122개 |
| 갱신일 | 2025-12-16 |

- 한국 전력계통 상세 정보 공개 제한 → 공개 데이터 기반 합성 계통(synthetic test system)
- 한전 지역 사무소 기준으로 부하 배치, 수도권 집중
- 서남부 재생에너지 집중, 해안가 발전단지
- 논문: Song & Kim, "KPG 193: A Synthetic Korean Power Grid Test System for Decarbonization Studies," arXiv:2411.14756, 2024

---

## 2. 실시간 시뮬레이션 (HIL)

### 개념
- 시뮬레이션 시간 = 실제 시간 (1:1 동기)
- 각 Time-step마다 계통 상태 계산 → 다음 step 전에 완료 필수
- **Over-run**: 연산이 time-step 내 완료 못 할 때 실시간성 붕괴

### 플랫폼: SPEEDGOAT Performance
- 멀티코어 프로세서 → 각 코어에 독립 Task 할당 (Over-run 방지)
- MATLAB/Simulink/Simscape 연동
- 실시간 I/O로 외부 하드웨어 연동 가능

---

## 3. EMT vs RMS 시뮬레이션

| 구분 | EMT | RMS |
|------|-----|-----|
| 해석 방식 | 순시값(instantaneous waveform) | 페이저(Magnitude & Phase) |
| Time-step | 2~50 μs | 50~200 ms |
| 규모 | 100모선 이하 소규모 | 1000모선 이상 대규모 |
| 장점 | 과도현상·전력전자 상세 해석 | 빠른 속도, 장시간 가능 |
| 단점 | 느림, 대규모 한계 | 파형 수준 현상 표현 불가 |
| 주파수 범위 | 0~3 kHz | 공칭 주파수 기준 |
| 툴 | PSCAD, EMTP | PSS/E, TSAT, ePHASORsim |

---

## 4. EMT 모델링

### 동기 발전기
- AVR(자동전압조정), PSS(전력계통안정화장치), Governor/Droop 제어
- d-q축 자속 동특성 반영
- IEEE 15-계통 검증: 부하 변동 시 주파수·기계적 출력 응답 확인

### 송전선로·변압기
- 집중정수 파이(π)형 모델 (R, L, C)
- 변압기-선로 일체형 등가 모델
- IEEE 14-계통 검증: Multi-basekV 전압·위상각 동일값 확인

### IBR (Inverter-Based Resources) — Grid-Following (GFL)
- 재생에너지(태양광·풍력), ESS 등 전류원 방식
- PQ 지령 추종, IBL(부하) / IBG(발전) 전환 가능
- IEEE 15-계통 검증: MATPOWER 지령값 추종 확인

### 통합 검증 결과
- 평균 전압 오차: 7.8×10⁻⁵ pu (IEEE 14), 1.18×10⁻⁵ pu (IEEE 15)
- 평균 전력 오차: 2.52×10⁻¹² MW/MVar

---

## 5. RMS 모델링

### 동기 발전기 — GENROU 모델
- 원통형 회전자 동기발전기 동적 거동
- d-q축 과도/차과도 시상수 수학적 표현
- 전자기 과도현상(dΨ/dt)을 대수 방정식으로 처리 → 연산 효율화
- IEEE 141-계통 검증 완료

### IBR (DER_A 기반 단순화 모델)
- WECC DER_A 모델 참고 (REPC/REEC/REGC 플랜트 모델의 축약형)
- IEEE 15-계통 검증: 지령값 추종 확인

### 통합 검증 결과
- 평균 전압 오차: 3.67×10⁻⁵ pu, 4.56×10⁻⁷ pu
- 평균 전력 오차: 3.84×10⁻⁷ MW/MVar

---

## 6. AutoGrid — 자동 계통 모델링

- **입력**: MATPOWER 표준 데이터 (.mat)
- **출력**: Simulink 자동 구성 모델 (EMT 또는 RMS 선택)
- 버스 자동 배치 → 타입별(Slack/PV/PQ) 구성요소 연결 → 선로 모델링
- **효과**: Human Error 0%, 모선 전압·전력 오차 0.1% 이내

---

## 7. Co-Simulation

### 필요성
1. 단일 코어 한계: EMT로 약 10개 모선만 실시간 해석 가능 → 분할 필요
2. KPG-193 전체 6코어 사용해도 단일 EMT 실시간 구현 불가
3. 대규모 계통(RMS) + 관심 영역(EMT) 혼합 해석 필요

### 인터페이싱: ITM (Ideal Transformer Model)
- **전압형 ITM**: 전압 전달, 전류 측정
- **전류형 ITM**: 전류 전달, 전압 측정
- 분할 지점 양쪽에 전압형·전류형 쌍으로 배치

### EMT-EMT Co-Simulation
- 동일 시간 영역 → 도메인 변환 불필요
- 전압·전류 순시값 직접 교환
- IEEE 15-계통 3코어, case33bw(33모선) 검증
- 단일 계통 결과와 비교 → 정확도 확인 완료

### RMS-RMS Co-Simulation
- 동일 페이저 영역 → 도메인 변환 불필요
- 전압 크기·위상각 직접 교환
- IEEE 15-계통 3코어 검증 완료

### RMS-EMT Co-Simulation
- **서로 다른 해석 영역** → 데이터 변환 필수
- EMT → RMS: 순시값 → 푸리에 변환으로 크기·위상 추출
- RMS → EMT: 페이저 → cos(ωt + φ) 3상 순시값 복원
- IEEE 18-계통 2코어 검증 완료

---

## 8. KPG-193 적용 결과

### 단독 시뮬레이션 (SPEEDGOAT)
- 270MW 발전원 순시 탈락 (전체 17,600MW의 약 1.5%) 모의
- 주파수: 59.64Hz까지 하락 후 수초 내 회복
- 평균 유효전력 오차: 3.12×10⁻⁵ MW
- 평균 무효전력 오차: 7.72×10⁻⁵ MVar
- 평균 전압 오차: 4.75×10⁻⁵ pu
- 평균 위상각 오차: 0.012°

### RMS-EMT Multi-core Co-Simulation
- KPG-193을 서브 네트워크로 분할 → RMS(Core 1, 2000μs) + EMT(Core 2, 50μs)
- 전체 모선 전압 변동 패턴 유사 일치
- 수치적 대수 루프 문제 극복 → 정상상태 수렴 해 도출
- 이종 솔버 간 데이터 동기화 알고리즘 유효성 검증

---

## 9. 현재 프로젝트(KPG193-advance) 적용 방향

현재 프로젝트는 **KPG-193 데이터셋의 웹 기반 시각화 도구**이고,  
이 연구는 **KPG-193으로 수행한 실시간 시뮬레이션 연구**다.  
연결고리: 같은 계통 데이터 → 연구 결과를 시각화로 보여주는 확장

### 적용 가능 항목

| 우선순위 | 항목 | 내용 |
|----------|------|------|
| 높음 | NetworkPage 서브넷 레이어 | Co-simulation 분할 영역(EMT/RMS) 지도 위에 색상 레이어로 표시 |
| 높음 | MethodologyPage 확장 | Co-simulation 절(Section) 추가: EMT/RMS 비교표, 인터페이싱 개념 |
| 중간 | SimulationPage 신설 | 주파수 응답 차트(발전기 탈락 시나리오), 전압 프로파일 시각화 |
| 중간 | NetworkPage IBR 필터 | 현재 coal/lng/nuclear만 표시 → solar/wind IBR 레이어 추가 |
| 낮음 | GuidePage | Co-simulation 개념(EMT vs RMS, Over-run, ITM) 설명 추가 |

### 가장 임팩트 있는 1순위: NetworkPage 서브넷 레이어
- 데이터: 어느 버스가 EMT 영역인지 RMS 영역인지 구분하는 정적 JSON
- 시각화: 지도 위에 반투명 영역 폴리곤 or 버스 색상 변경
- 사용자 가치: "이 연구가 계통을 어떻게 나눴는지" 지도로 직관적 확인
