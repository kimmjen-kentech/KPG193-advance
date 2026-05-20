export type Locale = 'ko' | 'en';

export interface Translation {
  nav: {
    index: string;
    network: string;
    profiles: string;
    data: string;
    methodology: string;
    guide: string;
    simulation: string;
  };
  pin: {
    title: string;
    sub: string;
    digitLabel: string;
    textLabel: string;
    errorMsg: string;
    submitLabel: string;
    submitLoading: string;
  };
  common: {
    loading: string;
    error: string;
    close: string;
    download: string;
    selectNode: string;
    selectBranch: string;
    all: string;
    system: string;
    voltage: string;
    rating: string;
    coordinates: string;
    branches: string;
    designation: string;
    dataLoadError: string;
  };
  overview: {
    label: string;
    title: string[];
    tagline: string;
    cta: { monitor: string; methodology: string };
    sections: { snapshot: string; mix: string; coverage: string };
    kpi: { buses: string; generators: string; ac: string; hvdc: string; profile: string; renewable: string };
    coverageCaption: string;
    topologyTitle: string;
    nodeDensity: string;
    frequency: string;
  };
  network: {
    sectionLabel: string;
    panelLabel: string;
    inspectorBranch: string;
    inspectorNode: string;
    terminalSub: string;
    legend: string;
    hvdc: string;
    generators: string;
    nuclear: string;
    coal: string;
    lng: string;
    solar: string;
    wind: string;
    hydro: string;
    fromLabel: string;
    toLabel: string;
    nodeIdentifier: string;
    branchIdentifier: string;
    connectedBranches: string;
    name: string;
    id: string;
    networkLive: string;
    loadingParquet: string;
    busList: string;
  };
  profiles: {
    label: string;
    title: string;
    tagline: string;
    scope: string;
    systemWide: string;
    allBuses: string;
    clearFilter: string;
    selectedDay: string;
    peak: string;
    systemDemand: string;
    renewableCF: string;
    thermalCommit: string;
    thermalCommitSystem: string;
    noCommitData: string;
    dataSource: string;
    weatherSection: string;
    temperature: string;
    windSpeed: string;
    noWeatherData: string;
    annualSection: string;
    annualDemandTitle: string;
    annualDemandCaption: string;
    annualRenewablesTitle: string;
    annualRenewablesCaption: string;
    annualPeakDay: string;
    annualMinDay: string;
    annualTotalEnergy: string;
    clickToFocus: string;
  };
  data: {
    label: string;
    title: string;
    tagline: string;
    files: string;
    totalRows: string;
    totalSize: string;
    license: string;
    datasets: string;
    columns: string;
    rows: string;
    pipelineTitle: string;
    pipelineBody: string;
  };
  methodology: {
    label: string;
    title: string;
    tagline: string;
    reference: string;
    pipelineTitle: string;
    pipeline: { dataCol: { t: string; b: string }; cluster: { t: string; b: string }; estimate: { t: string; b: string }; validate: { t: string; b: string } };
    specsTitle: string;
    specs: Array<{ label: string; value: string; note: string }>;
    sourcesTitle: string;
    sources: Array<{ name: string; purpose: string }>;
    citation: string;
    citationCaption: string;
  };
  guide: {
    label: string;
    title: string;
    tagline: string;
    referenceUcTitle: string;
    referenceUcBody: string;
    copy: string;
    copied: string;
  };
  footer: {
    license: string;
    paper: string;
    citeAs: string;
    fullCitation: string;
    repository: string;
  };
  simulation: {
    label: string;
    title: string;
    tagline: string;
    sections: {
      comparison: string;
      modeling: string;
      autoGrid: string;
      coSimTypes: string;
      scenarios: string;
      freqResponse: string;
      voltageResponse: string;
      architecture: string;
      results: string;
    };
    modeling: {
      intro: string;
      generator: {
        title: string;
        desc: string;
        avr: string;
        avrDesc: string;
        governor: string;
        governorDesc: string;
        pss: string;
        pssDesc: string;
      };
      ibr: {
        title: string;
        desc: string;
        mode: string;
        modeDesc: string;
        note: string;
      };
    };
    autoGrid: {
      title: string;
      desc: string;
      inputLabel: string;
      inputDesc: string;
      processLabel: string;
      processDesc: string;
      outputLabel: string;
      outputDesc: string;
      humanError: string;
      vpError: string;
      timeSaved: string;
      timeSavedValue: string;
    };
    scenarios: {
      title: string;
      intro: string;
      tripLabel: string;
      mwLabel: string;
      nadirLabel: string;
      rocofLabel: string;
      caption: string;
    };
    coSimTypes: {
      intro: string;
      itm: string;
      emtEmt: {
        name: string;
        partition: string;
        interface: string;
        case: string;
      };
      rmsRms: {
        name: string;
        partition: string;
        interface: string;
        case: string;
      };
      rmsEmt: {
        name: string;
        partition: string;
        interface: string;
        case: string;
        thisWork: string;
      };
      partitionLabel: string;
      interfaceLabel: string;
      caseLabel: string;
    };
    emt: {
      title: string;
      desc: string;
      timestep: string;
      scale: string;
      tool: string;
    };
    rms: {
      title: string;
      desc: string;
      timestep: string;
      scale: string;
      tool: string;
    };
    freqChartTitle: string;
    freqChartCaption: string;
    eventLabel: string;
    archTitle: string;
    archCaption: string;
    archRmsLabel: string;
    archEmtDesc: string;
    archIbrZone: string;
    voltageChartTitle: string;
    voltageChartCaption: string;
    kpi: {
      activePowerError: string;
      reactivePowerError: string;
      voltageError: string;
      phaseError: string;
      freqDrop: string;
      recovery: string;
    };
    resultsCaption: string;
  };
}

const ko: Translation = {
  nav: {
    index: '개요',
    network: '네트워크',
    profiles: '프로파일',
    data: '데이터',
    methodology: '방법론',
    guide: '가이드',
    simulation: '시뮬레이션',
  },
  pin: {
    title: '접근 제한',
    sub: '액세스 코드를 입력하세요',
    digitLabel: '숫자 4자리',
    textLabel: '추가 코드 (문자)',
    errorMsg: '액세스 코드가 올바르지 않습니다',
    submitLabel: '확인',
    submitLoading: '확인 중…',
  },
  common: {
    loading: '불러오는 중',
    error: '오류',
    close: '닫기',
    download: '다운로드',
    selectNode: '노드 또는 브랜치를 선택하세요',
    selectBranch: '맵에서 다른 노드로 이동',
    all: '전체',
    system: '시스템 전체',
    voltage: '전압',
    rating: '정격',
    coordinates: '좌표',
    branches: '브랜치',
    designation: '명칭',
    dataLoadError: '데이터 로드 실패',
  },
  overview: {
    label: 'Kernel_Core_Access',
    title: ['합성', '한국 전력망', '테스트베드.'],
    tagline: '한국 전력망의 탈탄소화 시나리오와 그리드 안정성을 시뮬레이션하기 위한 고충실도 연구 프레임워크.',
    cta: { monitor: '모니터 시작', methodology: '방법론' },
    sections: { snapshot: '시스템 스냅샷', mix: '발전 믹스', coverage: '시간 범위' },
    kpi: {
      buses: '모선',
      generators: '발전기',
      ac: 'AC 송전선',
      hvdc: 'HVDC',
      profile: '프로파일',
      renewable: '재생에너지',
    },
    coverageCaption: '시간별 수요 · 365일 · 8,760시간',
    topologyTitle: 'Topology_Buffer',
    nodeDensity: '193 모선 // 5 클러스터 // 고립된 반도형',
    frequency: '주파수',
  },
  network: {
    sectionLabel: 'Network',
    panelLabel: 'Terminal',
    inspectorBranch: 'Branch_Inspector',
    inspectorNode: 'Node_Inspector',
    terminalSub: '맵 클릭으로 전환',
    legend: '범례',
    hvdc: 'HVDC',
    generators: '발전기',
    nuclear: '원자력',
    coal: '석탄',
    lng: 'LNG',
    solar: '태양광',
    wind: '풍력',
    hydro: '수력',
    fromLabel: 'From',
    toLabel: 'To',
    nodeIdentifier: '노드 식별자',
    branchIdentifier: '브랜치 식별자',
    connectedBranches: '연결된 브랜치',
    name: '이름',
    id: 'ID',
    networkLive: 'Network_Live',
    loadingParquet: 'parquet 로딩 …',
    busList: '모선 목록',
  },
  profiles: {
    label: 'Temporal_Profiles',
    title: '프로파일.',
    tagline: '8,760시간의 수요·재생에너지·단위 약정. 슬라이더로 임의의 24시간 구간을 검토하세요.',
    scope: '범위',
    systemWide: '시스템 전체 (193 모선)',
    allBuses: '— 전체 모선 합산 —',
    clearFilter: '필터 해제',
    selectedDay: '선택 일자',
    peak: '피크',
    systemDemand: '시스템 수요',
    renewableCF: '재생에너지 용량계수',
    thermalCommit: '화력 Commitment (Reference UC)',
    thermalCommitSystem: ' · 시스템 전체',
    noCommitData: '해당 일자의 약정 데이터 없음.',
    dataSource: '데이터 소스 · KPG 193 v1.5 · 8,760h / 365d × 24h × 193 buses',
    weatherSection: '날씨',
    temperature: '기온',
    windSpeed: '풍속',
    noWeatherData: '해당 일자의 날씨 데이터 없음.',
    annualSection: '연간 개요',
    annualDemandTitle: '일별 피크 수요 — 365일',
    annualDemandCaption: '각 일의 시간별 합산 중 최댓값. 여름·겨울 피크 패턴 확인.',
    annualRenewablesTitle: '일평균 재생에너지 용량계수 — 365일',
    annualRenewablesCaption: '버스별 평균 PV/풍력/수력 일평균 비율. 계절성 가시화.',
    annualPeakDay: '연중 최대 피크',
    annualMinDay: '연중 최저',
    annualTotalEnergy: '연간 총 에너지',
    clickToFocus: '차트의 일자를 클릭하면 해당 날짜로 이동',
  },
  data: {
    label: 'Data_Catalog',
    title: '데이터.',
    tagline: 'Parquet 13개 (zstd 압축, DECIMAL(28, 12) 정밀도 보존). 모두 ODbL 1.0 라이선스 하에 자유롭게 사용·재배포 가능.',
    files: '파일',
    totalRows: '총 행',
    totalSize: '총 용량',
    license: '라이선스',
    datasets: '데이터셋',
    columns: '컬럼',
    rows: '행',
    pipelineTitle: '변환 파이프라인',
    pipelineBody: '원본 CSV/MATPOWER (231 MB) → Python 스크립트 (pyarrow + scipy) → Parquet (70.7 MB, zstd-15).',
  },
  methodology: {
    label: 'Methodology',
    title: '방법론.',
    tagline: '공개 데이터만으로 구축한 한국 전력망 합성 테스트 시스템. 보안에 민감한 세부 정보는 공간 클러스터링으로 추상화하되, 수학적 충실도(UC / AC-OPF)는 유지.',
    reference: 'Reference',
    pipelineTitle: '구축 파이프라인',
    pipeline: {
      dataCol: { t: '데이터 수집', b: 'OpenStreetMap, KEPCO, KPX, 시·도 통계' },
      cluster: { t: '공간 클러스터링', b: 'KEPCO 사업소 단위 노드 집계 (보안 추상화)' },
      estimate: { t: '매개변수 추정', b: '발전기·송전선 매개변수, 재생에너지 프로파일' },
      validate: { t: '검증', b: '8,760 h 전체에 대한 UC + AC-OPF 수렴 검증' },
    },
    specsTitle: '시스템 사양',
    specs: [
      { label: '모선', value: '193', note: '변전소 + 부하 센터' },
      { label: '발전기', value: '122', note: '화력 (석탄/LNG/원자력)' },
      { label: 'AC 송전선', value: '358', note: '765 / 345 / 154 kV' },
      { label: 'DC 라인', value: '1', note: '500 kV HVDC' },
      { label: '전압 레벨', value: '4', note: 'AC: 765·345·154 / DC: 500' },
      { label: '지역', value: '5', note: 'KEPCO 사업소 클러스터' },
      { label: '시간 해상도', value: '1 h', note: '8,760 h / 년' },
      { label: '연도', value: '2022', note: '기준 기간' },
      { label: '라이선스', value: 'ODbL 1.0', note: '자유 + 공개' },
    ],
    sourcesTitle: '데이터 출처',
    sources: [
      { name: 'OpenStreetMap', purpose: '송전망 토폴로지 (ODbL)' },
      { name: 'KEPCO', purpose: '발전기·송전선 매개변수 (공개 통계)' },
      { name: 'KPX', purpose: '시간별 수요 패턴' },
      { name: 'LDAPS', purpose: '기상 데이터 (태양광·풍력 프로파일)' },
    ],
    citation: '인용',
    citationCaption: '연구에 본 시스템을 사용하실 경우 위 BibTeX로 인용 부탁드립니다.',
  },
  guide: {
    label: 'Implementation_Guide',
    title: '가이드.',
    tagline: '연구 환경에서 KPG 193 데이터셋을 빠르게 로드하기 위한 예제. 본 사이트의 Parquet 사본은 정밀도가 DECIMAL(28, 12)로 보존됨.',
    referenceUcTitle: 'Reference UC Solutions',
    referenceUcBody: '데이터셋에는 tight MILP 솔버로 계산된 Reference UC Solution이 포함됩니다. 본인의 최적화 알고리즘 결과와 비교하여 정확도·성능을 벤치마크할 수 있습니다.',
    copy: '복사',
    copied: '복사됨 ✓',
  },
  footer: {
    license: 'Open Database License (ODbL) v1.0',
    paper: '논문',
    citeAs: '인용',
    fullCitation: '전체 BibTeX는 방법론 페이지 참조',
    repository: '저장소',
  },
  simulation: {
    label: 'Realtime_Cosimulation',
    title: 'Co-simulation.',
    tagline: 'KPG-193 전국전력망을 멀티코어 실시간 시뮬레이터(SPEEDGOAT)에서 구동하기 위한 EMT·RMS 혼합 Co-simulation 구현 및 검증.',
    sections: {
      comparison: 'EMT vs RMS',
      modeling: '계통 모델링',
      autoGrid: 'AutoGrid 자동 생성',
      coSimTypes: 'Co-simulation 3종',
      scenarios: '시나리오 비교',
      freqResponse: '주파수 응답',
      voltageResponse: '전압 응답',
      architecture: 'Co-simulation 구조',
      results: '검증 결과',
    },
    modeling: {
      intro: '실제 장비를 Simulink의 수식 모델로 표현. EMT는 자세한 내부 자기장까지, RMS는 표준 GENROU 등 핵심 거동만.',
      generator: {
        title: '동기 발전기',
        desc: '화력·원자력·수력 발전소의 회전 기계. 자석이 회전하며 전기를 발생.',
        avr: 'AVR',
        avrDesc: '자동전압조정기 — 발전기 출력 전압이 흔들리면 자동 보정',
        governor: 'Governor',
        governorDesc: '발전기 회전 속도(주파수) 변동 시 연료 공급량 조절',
        pss: 'PSS',
        pssDesc: '계통 전체 진동 발생 시 발전기 출력으로 댐핑 보조',
      },
      ibr: {
        title: 'IBR (인버터 기반 자원)',
        desc: '태양광·풍력·배터리. 인버터를 통해 전기를 만들고 물리적 회전 관성 없음.',
        mode: 'Grid-Following',
        modeDesc: '계통 주파수·전압을 감지(PLL)하여 그에 맞춰 출력. 발전(+)·부하(-) 양방향 가능',
        note: '재생에너지 비중이 늘수록 IBR 정확 모델링이 핵심.',
      },
    },
    autoGrid: {
      title: 'MATPOWER → Simulink 자동 생성',
      desc: '193 모선·407 선로를 손으로 배치·연결하면 며칠 + 실수 다수. MATPOWER 표준 파일을 입력하면 모선 위치·타입(Slack/PV/PQ)·송전선 자동 배선.',
      inputLabel: 'Input',
      inputDesc: 'MATPOWER .m / .mat',
      processLabel: 'AutoGrid',
      processDesc: 'Parser · Topology Builder · Block Placer',
      outputLabel: 'Output',
      outputDesc: 'Simulink Model (EMT / RMS)',
      humanError: 'Human Error',
      vpError: 'V/P 오차',
      timeSaved: '작업 시간',
      timeSavedValue: '일 → 분',
    },
    scenarios: {
      title: '트립 크기별 주파수 응답',
      intro: '동일한 KPG-193 계통에서 발전원 탈락량만 바꿨을 때 주파수 응답 비교. 손실이 클수록 ROCOF 가팔라지고 nadir 깊어짐.',
      tripLabel: '탈락량',
      mwLabel: 'MW',
      nadirLabel: 'Nadir',
      rocofLabel: 'ROCOF',
      caption: 'Governor·관성 모델 동일, 트립 크기만 변경. nadir와 ROCOF는 손실량에 거의 선형.',
    },
    coSimTypes: {
      intro: '경계면에서 ITM (Ideal Transformer Model) 인터페이스로 데이터 교환. 양쪽 영역의 해석 방식에 따라 3가지 조합.',
      itm: 'ITM 인터페이스 — 한쪽이 전압(전위차) 전달 / 다른 쪽이 전류(흐름) 회신',
      emtEmt: {
        name: 'EMT-EMT',
        partition: '양쪽 모두 EMT',
        interface: '순시 파형 (V, I) 직접 교환 — 번역 불필요',
        case: '33-bus / 2-core 검증 — 단일 계통 결과와 모든 모선 전압 일치',
      },
      rmsRms: {
        name: 'RMS-RMS',
        partition: '양쪽 모두 RMS',
        interface: '페이저 (|V|∠θ, |I|∠θ) 교환 — 번역 불필요',
        case: 'IEEE 15-bus / 3-core 검증 — 전압·위상·조류 모두 일치',
      },
      rmsEmt: {
        name: 'RMS-EMT',
        partition: '혼합 (이 연구)',
        interface: 'EMT→RMS는 푸리에 변환, RMS→EMT는 파형 합성',
        case: 'IEEE 18-bus / 2-core 검증 → KPG-193 적용',
        thisWork: 'This Work',
      },
      partitionLabel: 'Partition',
      interfaceLabel: 'Interface',
      caseLabel: 'Validation',
    },
    emt: {
      title: 'EMT',
      desc: '전압·전류의 순간 파형을 시간 영역에서 직접 계산. 전력전자·스위칭·빠른 과도현상 해석에 적합.',
      timestep: '2 ~ 50 μs',
      scale: '100모선 이하',
      tool: 'PSCAD / EMTP',
    },
    rms: {
      title: 'RMS',
      desc: '기본파의 크기와 위상(페이저)만 계산. 빠른 속도로 대규모 계통 장시간 안정도 해석에 적합.',
      timestep: '50 ~ 200 ms',
      scale: '1,000모선 이상',
      tool: 'PSS/E / TSAT',
    },
    freqChartTitle: '발전기 탈락 시나리오 — 주파수 응답',
    freqChartCaption: '총 발전량 17,600 MW 중 270 MW(1.5%) 순시 탈락. 관성·Governor 응답으로 수초 내 회복.',
    eventLabel: 't=20s 발전원 탈락',
    archTitle: 'RMS-EMT Multi-core Co-simulation',
    archCaption: 'KPG-193을 서브 네트워크로 분할. Core 1(RMS, 2,000 μs)이 광역망을, Core 2(EMT, 50 μs)가 상세 해석 영역을 담당. 경계면에서 ITM 인터페이스로 실시간 데이터 교환.',
    archRmsLabel: 'KPG-193 광역망 (대부분)',
    archEmtDesc: '상세 해석 서브 계통',
    archIbrZone: 'IBR / 전력전자 집중 구역',
    voltageChartTitle: '발전기 탈락 시나리오 — 전압 응답',
    voltageChartCaption: 'EMT 구역(Core 2)은 스위칭 과도현상으로 초기 전압 강하 폭이 크고, RMS 구역(Core 1)은 페이저 근사로 완만하게 반응.',
    kpi: {
      activePowerError: '유효전력 오차',
      reactivePowerError: '무효전력 오차',
      voltageError: '전압 오차',
      phaseError: '위상각 오차',
      freqDrop: '최저 주파수',
      recovery: '회복 시간',
    },
    resultsCaption: 'KPG-193 전체 계통 SPEEDGOAT 실시간 시뮬레이션 검증 결과 (2026-05-19)',
  },
};

const en: Translation = {
  nav: {
    index: 'Overview',
    network: 'Network',
    profiles: 'Profiles',
    data: 'Data',
    methodology: 'Methodology',
    guide: 'Guide',
    simulation: 'Simulation',
  },
  pin: {
    title: 'Private Preview',
    sub: 'Enter the access code',
    digitLabel: '4 digits',
    textLabel: 'Additional code (text)',
    errorMsg: 'Invalid access code',
    submitLabel: 'Enter',
    submitLoading: 'Verifying…',
  },
  common: {
    loading: 'loading',
    error: 'error',
    close: 'close',
    download: 'Download',
    selectNode: 'select node or branch',
    selectBranch: 'tap map to switch',
    all: 'all',
    system: 'System-wide',
    voltage: 'Voltage',
    rating: 'Rating',
    coordinates: 'Coordinates',
    branches: 'Branches',
    designation: 'Designation',
    dataLoadError: 'Failed to load data',
  },
  overview: {
    label: 'Kernel_Core_Access',
    title: ['Synthetic', 'Korean Grid', 'Testbed.'],
    tagline:
      'A high-fidelity research framework for the Korean power grid, engineered to simulate deep decarbonization scenarios and modern grid stability.',
    cta: { monitor: 'Initialize Monitor', methodology: 'Methodology' },
    sections: { snapshot: 'System Snapshot', mix: 'Generation Mix', coverage: 'Temporal Coverage' },
    kpi: {
      buses: 'Buses',
      generators: 'Generators',
      ac: 'AC Branches',
      hvdc: 'HVDC Links',
      profile: 'Profile',
      renewable: 'Renewable',
    },
    coverageCaption: 'Hourly demand · 365 days · 8,760 hours',
    topologyTitle: 'Topology_Buffer',
    nodeDensity: '193 nodes // 5 clusters // isolated peninsula',
    frequency: 'Frequency',
  },
  network: {
    sectionLabel: 'Network',
    panelLabel: 'Terminal',
    inspectorBranch: 'Branch_Inspector',
    inspectorNode: 'Node_Inspector',
    terminalSub: 'tap map to switch',
    legend: 'Legend',
    hvdc: 'HVDC',
    generators: 'Generators',
    nuclear: 'Nuclear',
    coal: 'Coal',
    lng: 'LNG',
    solar: 'Solar',
    wind: 'Wind',
    hydro: 'Hydro',
    fromLabel: 'From',
    toLabel: 'To',
    nodeIdentifier: 'Node_Identifier',
    branchIdentifier: 'Branch_Identifier',
    connectedBranches: 'Connected Branches',
    name: 'Name',
    id: 'ID',
    networkLive: 'Network_Live',
    loadingParquet: 'loading parquet …',
    busList: 'Bus List',
  },
  profiles: {
    label: 'Temporal_Profiles',
    title: 'Profiles.',
    tagline:
      '8,760 hours of demand, renewables, and unit commitment. Scrub the day slider to inspect any 24-hour window.',
    scope: 'Scope',
    systemWide: 'System-wide (193 buses)',
    allBuses: '— all buses (sum) —',
    clearFilter: 'Clear filter',
    selectedDay: 'Selected_Day',
    peak: 'Peak',
    systemDemand: 'System Demand',
    renewableCF: 'Renewable Capacity Factor',
    thermalCommit: 'Thermal Commitment (Reference UC)',
    thermalCommitSystem: ' · system-wide',
    noCommitData: 'No commitment data for this day.',
    dataSource: 'Data source · KPG 193 v1.5 · 8,760 h / 365 d × 24 h × 193 buses',
    weatherSection: 'Weather',
    temperature: 'Temperature',
    windSpeed: 'Wind Speed',
    noWeatherData: 'No weather data for this day.',
    annualSection: 'Annual Overview',
    annualDemandTitle: 'Daily Peak Demand — 365 days',
    annualDemandCaption: 'Maximum hourly system demand per day. Reveals summer / winter peak patterns.',
    annualRenewablesTitle: 'Daily Average Renewable Capacity Factor — 365 days',
    annualRenewablesCaption: 'System-wide mean PV / wind / hydro daily capacity factor. Highlights seasonal swings.',
    annualPeakDay: 'Annual Peak',
    annualMinDay: 'Annual Low',
    annualTotalEnergy: 'Annual Total Energy',
    clickToFocus: 'Click a day in the chart to jump to that date below',
  },
  data: {
    label: 'Data_Catalog',
    title: 'Data.',
    tagline:
      '13 Parquet files (zstd compression, DECIMAL(28, 12) precision preserved). All released under ODbL 1.0 — free to use, modify, and redistribute.',
    files: 'Files',
    totalRows: 'Total Rows',
    totalSize: 'Total Size',
    license: 'License',
    datasets: 'Datasets',
    columns: 'Columns',
    rows: 'rows',
    pipelineTitle: 'Conversion Pipeline',
    pipelineBody:
      'Original CSV/MATPOWER (231 MB) → Python script (pyarrow + scipy) → Parquet (70.7 MB, zstd-15).',
  },
  methodology: {
    label: 'Methodology',
    title: 'Methodology.',
    tagline:
      'A synthetic Korean power grid built from open-source data only. Security-sensitive details are abstracted via spatial clustering while preserving mathematical fidelity (UC / AC-OPF).',
    reference: 'Reference',
    pipelineTitle: 'Construction Pipeline',
    pipeline: {
      dataCol: { t: 'Data Collection', b: 'OpenStreetMap, KEPCO, KPX, municipal statistics' },
      cluster: { t: 'Spatial Clustering', b: 'Aggregation by KEPCO regional offices (security abstraction)' },
      estimate: { t: 'Parameter Estimation', b: 'Generator and line parameters, renewable profiles' },
      validate: { t: 'Validation', b: 'Full 8,760 h UC + AC-OPF convergence' },
    },
    specsTitle: 'System Specifications',
    specs: [
      { label: 'Buses', value: '193', note: 'substations + load centers' },
      { label: 'Generators', value: '122', note: 'thermal (coal/lng/nuclear)' },
      { label: 'AC Branches', value: '358', note: '765 / 345 / 154 kV' },
      { label: 'DC Lines', value: '1', note: '500 kV HVDC' },
      { label: 'Voltage Levels', value: '4', note: 'AC: 765·345·154 / DC: 500' },
      { label: 'Regions', value: '5', note: 'KEPCO office clusters' },
      { label: 'Time Resolution', value: '1 h', note: '8,760 h / year' },
      { label: 'Year', value: '2022', note: 'reference period' },
      { label: 'License', value: 'ODbL 1.0', note: 'free + open' },
    ],
    sourcesTitle: 'Data Sources',
    sources: [
      { name: 'OpenStreetMap', purpose: 'Transmission topology (ODbL)' },
      { name: 'KEPCO', purpose: 'Generator and line parameters (public statistics)' },
      { name: 'KPX', purpose: 'Hourly demand patterns' },
      { name: 'LDAPS', purpose: 'Meteorological data (solar/wind profiles)' },
    ],
    citation: 'Citation',
    citationCaption: 'Please cite via the BibTeX above when using this system in research.',
  },
  guide: {
    label: 'Implementation_Guide',
    title: 'Guide.',
    tagline:
      'Examples for quickly loading the KPG 193 dataset in your research environment. The Parquet copies served here preserve precision at DECIMAL(28, 12).',
    referenceUcTitle: 'Reference UC Solutions',
    referenceUcBody:
      'The dataset includes reference UC decisions computed via a tight MILP solver. Use them to benchmark the accuracy and performance of your own optimization algorithm.',
    copy: 'copy',
    copied: 'copied ✓',
  },
  footer: {
    license: 'Open Database License (ODbL) v1.0',
    paper: 'Paper',
    citeAs: 'Cite as',
    fullCitation: 'Full BibTeX on methodology page',
    repository: 'Repository',
  },
  simulation: {
    label: 'Realtime_Cosimulation',
    title: 'Co-simulation.',
    tagline: 'Multi-core real-time co-simulation of the KPG-193 national grid on SPEEDGOAT, combining EMT and RMS solvers across distributed cores.',
    sections: {
      comparison: 'EMT vs RMS',
      modeling: 'Grid Modeling',
      autoGrid: 'AutoGrid Pipeline',
      coSimTypes: 'Co-simulation Types',
      scenarios: 'Scenario Comparison',
      freqResponse: 'Frequency Response',
      voltageResponse: 'Voltage Response',
      architecture: 'Co-simulation Architecture',
      results: 'Validation Results',
    },
    modeling: {
      intro: 'Physical devices represented as Simulink equations. EMT models internal magnetic fields in detail; RMS uses standard reduced models (e.g., GENROU).',
      generator: {
        title: 'Synchronous Generator',
        desc: 'Rotating mass found in thermal, nuclear, and hydro plants. Magnets spin to generate electricity.',
        avr: 'AVR',
        avrDesc: 'Automatic Voltage Regulator — corrects output voltage deviations',
        governor: 'Governor',
        governorDesc: 'Adjusts fuel input when rotor speed (frequency) drifts',
        pss: 'PSS',
        pssDesc: 'Power System Stabilizer — damps inter-area oscillations via generator output',
      },
      ibr: {
        title: 'IBR (Inverter-Based Resources)',
        desc: 'Solar PV, wind, batteries. Power produced via inverters with no physical rotational inertia.',
        mode: 'Grid-Following',
        modeDesc: 'Senses grid frequency/voltage (PLL) and tracks setpoints. Bidirectional (generation + consumption)',
        note: 'Accurate IBR modeling is critical as renewable penetration grows.',
      },
    },
    autoGrid: {
      title: 'MATPOWER → Simulink Automation',
      desc: 'Manually placing 193 buses and 407 lines takes days and risks human errors. AutoGrid ingests MATPOWER and emits a wired Simulink model — bus typing (Slack/PV/PQ), line routing, all automated.',
      inputLabel: 'Input',
      inputDesc: 'MATPOWER .m / .mat',
      processLabel: 'AutoGrid',
      processDesc: 'Parser · Topology Builder · Block Placer',
      outputLabel: 'Output',
      outputDesc: 'Simulink Model (EMT / RMS)',
      humanError: 'Human Error',
      vpError: 'V/P Error',
      timeSaved: 'Time Saved',
      timeSavedValue: 'Days → Minutes',
    },
    scenarios: {
      title: 'Frequency Response vs Trip Size',
      intro: 'Same KPG-193 grid, only the lost generation changes. Larger losses steepen ROCOF and deepen the nadir.',
      tripLabel: 'Trip',
      mwLabel: 'MW',
      nadirLabel: 'Nadir',
      rocofLabel: 'ROCOF',
      caption: 'Identical governor and inertia models — only the trip size varies. Nadir and ROCOF scale roughly linearly with loss.',
    },
    coSimTypes: {
      intro: 'Boundary data exchanged via ITM (Ideal Transformer Model). Three combinations based on the solver type of each partition.',
      itm: 'ITM interface — one side sends voltage (potential), the other returns current (flow)',
      emtEmt: {
        name: 'EMT-EMT',
        partition: 'Both sides EMT',
        interface: 'Instantaneous waveforms (V, I) — no translation needed',
        case: 'Verified on 33-bus / 2 cores — bus voltages match single-system result',
      },
      rmsRms: {
        name: 'RMS-RMS',
        partition: 'Both sides RMS',
        interface: 'Phasors (|V|∠θ, |I|∠θ) — no translation needed',
        case: 'Verified on IEEE 15-bus / 3 cores — voltage, phase, and flow match',
      },
      rmsEmt: {
        name: 'RMS-EMT',
        partition: 'Mixed (this work)',
        interface: 'EMT→RMS via Fourier transform; RMS→EMT via waveform synthesis',
        case: 'Verified on IEEE 18-bus / 2 cores → applied to KPG-193',
        thisWork: 'This Work',
      },
      partitionLabel: 'Partition',
      interfaceLabel: 'Interface',
      caseLabel: 'Validation',
    },
    emt: {
      title: 'EMT',
      desc: 'Computes instantaneous voltage and current waveforms in the time domain. Suited for power electronics, switching, and fast electromagnetic transients.',
      timestep: '2 ~ 50 μs',
      scale: '< 100 buses',
      tool: 'PSCAD / EMTP',
    },
    rms: {
      title: 'RMS',
      desc: 'Computes only the magnitude and phase (phasor) of the fundamental. Enables fast, large-scale stability analysis over long horizons.',
      timestep: '50 ~ 200 ms',
      scale: '> 1,000 buses',
      tool: 'PSS/E / TSAT',
    },
    freqChartTitle: 'Generator Trip Scenario — Frequency Response',
    freqChartCaption: '270 MW instant trip from 17,600 MW total generation (1.5%). Frequency recovered within seconds via inertia and governor response.',
    eventLabel: 't=20s generator trip',
    archTitle: 'RMS-EMT Multi-core Co-simulation',
    archCaption: 'KPG-193 partitioned into sub-networks. Core 1 (RMS, 2,000 μs) covers the wide-area grid; Core 2 (EMT, 50 μs) handles the detailed subsystem. Boundary data exchanged in real-time via ITM interface.',
    archRmsLabel: 'KPG-193 bulk network (most buses)',
    archEmtDesc: 'Detailed EMT sub-network',
    archIbrZone: 'IBR / power electronics zone',
    voltageChartTitle: 'Generator Trip Scenario — Voltage Response',
    voltageChartCaption: 'EMT zone (Core 2) exhibits sharper initial voltage dip due to switching transients; RMS zone (Core 1) responds gradually via phasor approximation.',
    kpi: {
      activePowerError: 'Active Power Error',
      reactivePowerError: 'Reactive Power Error',
      voltageError: 'Voltage Error',
      phaseError: 'Phase Angle Error',
      freqDrop: 'Frequency Nadir',
      recovery: 'Recovery Time',
    },
    resultsCaption: 'KPG-193 full-system SPEEDGOAT real-time simulation validation (2026-05-19)',
  },
};

export const translations: Record<Locale, Translation> = { ko, en };
