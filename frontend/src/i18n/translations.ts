export type Locale = 'ko' | 'en';

export interface Translation {
  nav: {
    index: string;
    network: string;
    profiles: string;
    data: string;
    methodology: string;
    guide: string;
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
  };
}

const ko: Translation = {
  nav: {
    index: 'Index',
    network: '네트워크',
    profiles: '프로파일',
    data: '데이터',
    methodology: '방법론',
    guide: '가이드',
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
  },
};

const en: Translation = {
  nav: {
    index: 'Index',
    network: 'Network',
    profiles: 'Profiles',
    data: 'Data',
    methodology: 'Methodology',
    guide: 'Guide',
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
  },
};

export const translations: Record<Locale, Translation> = { ko, en };
