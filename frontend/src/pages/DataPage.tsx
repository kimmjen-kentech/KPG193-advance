import { Database, Download, FileText } from 'lucide-react';

interface Column {
  name: string;
  type: string;
  note?: string;
}

interface Dataset {
  file: string;
  rows: number;
  description: string;
  columns: Column[];
}

const DATASETS: Dataset[] = [
  {
    file: 'buses',
    rows: 193,
    description: 'MATPOWER bus matrix — 모선 매개변수 (전압, 부하, 영역)',
    columns: [
      { name: 'bus_i', type: 'DECIMAL', note: 'bus ID 1-193' },
      { name: 'type', type: 'DECIMAL', note: '1=PQ, 2=PV, 3=slack' },
      { name: 'Pd', type: 'DECIMAL', note: 'active demand MW' },
      { name: 'Qd', type: 'DECIMAL', note: 'reactive demand MVAr' },
      { name: 'baseKV', type: 'DECIMAL', note: '154 / 345 / 765' },
      { name: 'area', type: 'DECIMAL', note: '1-5 지역 클러스터' },
      { name: 'Vm / Va', type: 'DECIMAL', note: '전압 크기·위상' },
      { name: 'Vmax / Vmin', type: 'DECIMAL', note: '허용 범위' },
    ],
  },
  {
    file: 'bus_location',
    rows: 193,
    description: '버스 위치 (좌표 + 한·영 명칭)',
    columns: [
      { name: 'bus_id', type: 'INT64' },
      { name: 'Latitude', type: 'DECIMAL', note: '위도' },
      { name: 'Longitude', type: 'DECIMAL', note: '경도' },
      { name: 'name_Korean', type: 'STRING' },
      { name: 'name_English', type: 'STRING' },
    ],
  },
  {
    file: 'generators',
    rows: 122,
    description: 'MATPOWER gen matrix + fuel 컬럼 (.m 주석에서 추출)',
    columns: [
      { name: 'bus', type: 'DECIMAL', note: '연결 모선' },
      { name: 'Pmax / Pmin', type: 'DECIMAL', note: '용량 MW' },
      { name: 'Qmax / Qmin', type: 'DECIMAL' },
      { name: 'ramp_*', type: 'DECIMAL', note: '램프 제약' },
      { name: 'fuel', type: 'STRING', note: 'coal / lng / nuclear' },
    ],
  },
  {
    file: 'branches',
    rows: 358,
    description: 'AC 송전선 (R, X, B, 정격)',
    columns: [
      { name: 'fbus / tbus', type: 'DECIMAL' },
      { name: 'r / x / b', type: 'DECIMAL', note: '임피던스 pu' },
      { name: 'rateA / B / C', type: 'DECIMAL', note: '정상/단기/응급 MVA' },
      { name: 'status', type: 'DECIMAL', note: '0=open, 1=closed' },
    ],
  },
  {
    file: 'dc_lines',
    rows: 1,
    description: 'HVDC 라인 (500 kV)',
    columns: [
      { name: 'fbus / tbus', type: 'DECIMAL' },
      { name: 'Pmax', type: 'DECIMAL', note: '전송 한도' },
    ],
  },
  {
    file: 'capacity_solar',
    rows: 193,
    description: '버스별 태양광 설비용량',
    columns: [
      { name: 'bus_ID', type: 'INT64' },
      { name: 'Type', type: 'STRING' },
      { name: 'Pmax [MW]', type: 'DECIMAL' },
      { name: 'Pmin [MW]', type: 'INT64' },
    ],
  },
  {
    file: 'capacity_wind',
    rows: 193,
    description: '버스별 풍력 설비용량',
    columns: [
      { name: 'bus_ID', type: 'INT64' },
      { name: 'Pmax [MW]', type: 'DECIMAL' },
    ],
  },
  {
    file: 'capacity_hydro',
    rows: 193,
    description: '버스별 수력 설비용량',
    columns: [
      { name: 'bus_ID', type: 'INT64' },
      { name: 'Pmax [MW]', type: 'DECIMAL' },
    ],
  },
  {
    file: 'nuclear_mustoff',
    rows: 22,
    description: '원전 계획예방정비 일정 (must-off)',
    columns: [
      { name: 'generator_id', type: 'INT64' },
      { name: 'start / end', type: 'INT64', note: 'day-of-year' },
    ],
  },
  {
    file: 'profile_demand',
    rows: 1_690_680,
    description: '시간별 수요 (day × hour × bus × 193) — 365 × 24 × 193',
    columns: [
      { name: 'day', type: 'INT16', note: '1-365' },
      { name: 'hour', type: 'INT64', note: '1-24' },
      { name: 'bus_id', type: 'INT64' },
      { name: 'demandP', type: 'DECIMAL', note: 'MW' },
      { name: 'demandQ', type: 'DECIMAL', note: 'MVAr' },
    ],
  },
  {
    file: 'profile_renewables',
    rows: 1_690_680,
    description: '재생에너지 시간별 용량계수 (0-1)',
    columns: [
      { name: 'day / hour / bus_id', type: 'INT' },
      { name: 'pv_profile_ratio', type: 'DECIMAL' },
      { name: 'wind_profile_ratio', type: 'DECIMAL' },
      { name: 'hydro_profile_ratio', type: 'DECIMAL' },
    ],
  },
  {
    file: 'profile_weather',
    rows: 1_690_680,
    description: 'LDAPS 기상 데이터 (장파복사, 기온, 풍속)',
    columns: [
      { name: 'day / hour / bus_id', type: 'INT' },
      { name: 'net_downward_longwave_flux_W/m^2', type: 'DECIMAL' },
      { name: 'temperature_2m_K', type: 'DECIMAL' },
      { name: 'wind_u_93m_m/s', type: 'DECIMAL' },
      { name: 'wind_v_93m_m/s', type: 'DECIMAL' },
      { name: 'wind_speed_93m_m/s', type: 'DECIMAL' },
    ],
  },
  {
    file: 'profile_commitment',
    rows: 1_068_720,
    description: '참조 UC 해 (단위 약정 결정)',
    columns: [
      { name: 'day / hour', type: 'INT' },
      { name: 'generator_id', type: 'INT64', note: '1-122' },
      { name: 'status', type: 'INT64', note: '0=off, 1=on' },
    ],
  },
];

const fmt = (n: number) => n.toLocaleString('en-US');

export const DataPage = () => (
  <div className="space-y-12">
    <header className="space-y-3">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
        Data_Catalog
      </span>
      <h1 className="font-serif text-5xl italic leading-none tracking-tight text-fg">
        Data.
      </h1>
      <p className="max-w-2xl border-l-2 border-fg pl-4 font-serif text-base italic text-fg-muted">
        Parquet 13개 (zstd 압축, DECIMAL(28, 12) 정밀도 보존). 모두 ODbL 1.0
        라이선스 하에 자유롭게 사용·재배포 가능.
      </p>
    </header>

    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ['Files', '13'],
        ['Total Rows', '~6.1M'],
        ['Total Size', '70.7 MB'],
        ['License', 'ODbL 1.0'],
      ].map(([label, value]) => (
        <div key={label} className="border border-border bg-bg-elev p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            {label}
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-fg">
            {value}
          </div>
        </div>
      ))}
    </section>

    <section className="space-y-4">
      <h2 className="flex items-center gap-3 font-serif text-2xl italic text-fg">
        <Database size={18} />
        Datasets
      </h2>

      <div className="space-y-3">
        {DATASETS.map((ds) => (
          <article key={ds.file} className="border border-border bg-bg-elev">
            <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-baseline gap-3">
                <FileText size={14} className="text-fg-subtle" />
                <span className="font-mono text-sm font-bold text-fg">
                  {ds.file}.parquet
                </span>
                <span className="font-mono text-[10px] tabular-nums text-fg-subtle">
                  {fmt(ds.rows)} rows
                </span>
              </div>
              <a
                href={`${import.meta.env.BASE_URL}data/${ds.file}.parquet`}
                download
                className="inline-flex items-center gap-2 border border-fg bg-bg px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg transition-colors hover:bg-fg hover:text-bg"
              >
                <Download size={11} />
                Download
              </a>
            </header>
            <div className="px-5 py-3">
              <p className="font-serif text-sm italic text-fg-muted">{ds.description}</p>
            </div>
            <div className="border-t border-border bg-bg-subtle px-5 py-3">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
                Columns
              </div>
              <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {ds.columns.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-baseline gap-2 font-mono text-[11px]"
                  >
                    <span className="text-fg">{c.name}</span>
                    <span className="text-fg-subtle">{c.type}</span>
                    {c.note && (
                      <span className="ml-auto truncate text-fg-muted">{c.note}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="border border-border bg-bg-elev p-6">
      <h3 className="mb-3 font-serif text-xl italic text-fg">Conversion Pipeline</h3>
      <p className="mb-3 font-mono text-[11px] text-fg-muted">
        Original CSV/MATPOWER (231 MB) → Python script (pyarrow + scipy) → Parquet
        (70.7 MB, zstd-15).
      </p>
      <pre className="overflow-x-auto bg-bg p-4 font-mono text-[11px] leading-relaxed text-fg">
{`# scripts/convert_to_parquet.py
# - DECIMAL(28, 12)로 모든 부동소수 컬럼 정밀도 보존
# - MATPOWER .mat → buses / generators / branches / dc_lines
# - .m 주석에서 fuel 추출 (coal / lng / nuclear)
# - 365 일별 CSV → day 컬럼 추가 후 concat
python scripts/convert_to_parquet.py`}
      </pre>
    </section>
  </div>
);
