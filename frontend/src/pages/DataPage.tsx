import { Database, Download, FileText } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import type { Locale } from '../i18n/translations';

interface LocalizedString {
  ko: string;
  en: string;
}

interface Column {
  name: string;
  type: string;
  note?: LocalizedString;
}

interface Dataset {
  file: string;
  rows: number;
  description: LocalizedString;
  columns: Column[];
}

const ds = (file: string, rows: number, descKo: string, descEn: string, columns: Column[]): Dataset => ({
  file,
  rows,
  description: { ko: descKo, en: descEn },
  columns,
});

const note = (ko: string, en: string): LocalizedString => ({ ko, en });

const DATASETS: Dataset[] = [
  ds('buses', 193, 'MATPOWER bus matrix — 모선 매개변수 (전압, 부하, 영역)', 'MATPOWER bus matrix — bus parameters (voltage, load, area)', [
    { name: 'bus_i', type: 'DECIMAL', note: note('bus ID 1-193', 'bus ID 1-193') },
    { name: 'type', type: 'DECIMAL', note: note('1=PQ, 2=PV, 3=slack', '1=PQ, 2=PV, 3=slack') },
    { name: 'Pd', type: 'DECIMAL', note: note('유효 부하 MW', 'active demand MW') },
    { name: 'Qd', type: 'DECIMAL', note: note('무효 부하 MVAr', 'reactive demand MVAr') },
    { name: 'baseKV', type: 'DECIMAL', note: note('154 / 345 / 765', '154 / 345 / 765') },
    { name: 'area', type: 'DECIMAL', note: note('1-5 지역 클러스터', '1-5 regional cluster') },
    { name: 'Vm / Va', type: 'DECIMAL', note: note('전압 크기·위상', 'voltage magnitude · angle') },
    { name: 'Vmax / Vmin', type: 'DECIMAL', note: note('허용 범위', 'allowed range') },
  ]),
  ds('bus_location', 193, '버스 위치 (좌표 + 한·영 명칭)', 'Bus locations (coordinates + KR/EN names)', [
    { name: 'bus_id', type: 'INT64' },
    { name: 'Latitude', type: 'DECIMAL', note: note('위도', 'latitude') },
    { name: 'Longitude', type: 'DECIMAL', note: note('경도', 'longitude') },
    { name: 'name_Korean', type: 'STRING' },
    { name: 'name_English', type: 'STRING' },
  ]),
  ds('generators', 122, 'MATPOWER gen matrix + fuel 컬럼 (.m 주석에서 추출)', 'MATPOWER gen matrix + fuel column (extracted from .m comments)', [
    { name: 'bus', type: 'DECIMAL', note: note('연결 모선', 'connected bus') },
    { name: 'Pmax / Pmin', type: 'DECIMAL', note: note('용량 MW', 'capacity MW') },
    { name: 'Qmax / Qmin', type: 'DECIMAL' },
    { name: 'ramp_*', type: 'DECIMAL', note: note('램프 제약', 'ramp limits') },
    { name: 'fuel', type: 'STRING', note: note('coal / lng / nuclear', 'coal / lng / nuclear') },
  ]),
  ds('branches', 358, 'AC 송전선 (R, X, B, 정격)', 'AC transmission lines (R, X, B, rating)', [
    { name: 'fbus / tbus', type: 'DECIMAL' },
    { name: 'r / x / b', type: 'DECIMAL', note: note('임피던스 pu', 'impedance pu') },
    { name: 'rateA / B / C', type: 'DECIMAL', note: note('정상/단기/응급 MVA', 'normal/short/emergency MVA') },
    { name: 'status', type: 'DECIMAL', note: note('0=open, 1=closed', '0=open, 1=closed') },
  ]),
  ds('dc_lines', 1, 'HVDC 라인 (500 kV)', 'HVDC line (500 kV)', [
    { name: 'fbus / tbus', type: 'DECIMAL' },
    { name: 'Pmax', type: 'DECIMAL', note: note('전송 한도', 'transfer limit') },
  ]),
  ds('capacity_solar', 193, '버스별 태양광 설비용량', 'Solar capacity per bus', [
    { name: 'bus_ID', type: 'INT64' },
    { name: 'Type', type: 'STRING' },
    { name: 'Pmax [MW]', type: 'DECIMAL' },
    { name: 'Pmin [MW]', type: 'INT64' },
  ]),
  ds('capacity_wind', 193, '버스별 풍력 설비용량', 'Wind capacity per bus', [
    { name: 'bus_ID', type: 'INT64' },
    { name: 'Pmax [MW]', type: 'DECIMAL' },
  ]),
  ds('capacity_hydro', 193, '버스별 수력 설비용량', 'Hydro capacity per bus', [
    { name: 'bus_ID', type: 'INT64' },
    { name: 'Pmax [MW]', type: 'DECIMAL' },
  ]),
  ds('nuclear_mustoff', 22, '원전 계획예방정비 일정 (must-off)', 'Nuclear maintenance schedule (must-off)', [
    { name: 'generator_id', type: 'INT64' },
    { name: 'start / end', type: 'INT64', note: note('연중 일수', 'day-of-year') },
  ]),
  ds('profile_demand', 1_690_680, '시간별 수요 (day × hour × bus × 193) — 365 × 24 × 193', 'Hourly demand (day × hour × bus × 193) — 365 × 24 × 193', [
    { name: 'day', type: 'INT16', note: note('1-365', '1-365') },
    { name: 'hour', type: 'INT64', note: note('1-24', '1-24') },
    { name: 'bus_id', type: 'INT64' },
    { name: 'demandP', type: 'DECIMAL', note: note('MW', 'MW') },
    { name: 'demandQ', type: 'DECIMAL', note: note('MVAr', 'MVAr') },
  ]),
  ds('profile_renewables', 1_690_680, '재생에너지 시간별 용량계수 (0-1)', 'Hourly renewable capacity factor (0-1)', [
    { name: 'day / hour / bus_id', type: 'INT' },
    { name: 'pv_profile_ratio', type: 'DECIMAL' },
    { name: 'wind_profile_ratio', type: 'DECIMAL' },
    { name: 'hydro_profile_ratio', type: 'DECIMAL' },
  ]),
  ds('profile_weather', 1_690_680, 'LDAPS 기상 데이터 (장파복사, 기온, 풍속)', 'LDAPS weather data (longwave flux, temperature, wind speed)', [
    { name: 'day / hour / bus_id', type: 'INT' },
    { name: 'net_downward_longwave_flux_W/m^2', type: 'DECIMAL' },
    { name: 'temperature_2m_K', type: 'DECIMAL' },
    { name: 'wind_u_93m_m/s', type: 'DECIMAL' },
    { name: 'wind_v_93m_m/s', type: 'DECIMAL' },
    { name: 'wind_speed_93m_m/s', type: 'DECIMAL' },
  ]),
  ds('profile_commitment', 1_068_720, '참조 UC 해 (단위 약정 결정)', 'Reference UC solution (unit commitment decisions)', [
    { name: 'day / hour', type: 'INT' },
    { name: 'generator_id', type: 'INT64', note: note('1-122', '1-122') },
    { name: 'status', type: 'INT64', note: note('0=off, 1=on', '0=off, 1=on') },
  ]),
];

const fmt = (n: number) => n.toLocaleString('en-US');
const pick = (s: LocalizedString | undefined, locale: Locale) => (s ? s[locale] : '');

const PIPELINE_CODE_KO = `# scripts/convert_to_parquet.py
# - DECIMAL(28, 12)로 모든 부동소수 컬럼 정밀도 보존
# - MATPOWER .mat → buses / generators / branches / dc_lines
# - .m 주석에서 fuel 추출 (coal / lng / nuclear)
# - 365 일별 CSV → day 컬럼 추가 후 concat
python scripts/convert_to_parquet.py`;

const PIPELINE_CODE_EN = `# scripts/convert_to_parquet.py
# - DECIMAL(28, 12) preserves precision for all float columns
# - MATPOWER .mat → buses / generators / branches / dc_lines
# - fuel extracted from .m comments (coal / lng / nuclear)
# - 365 daily CSVs → concat with added day column
python scripts/convert_to_parquet.py`;

export const DataPage = () => {
  const { t, locale } = useI18n();
  return (
  <div className="space-y-12">
    <header className="space-y-3">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
        {t.data.label}
      </span>
      <h1 className="font-serif text-4xl italic leading-none tracking-tight text-fg sm:text-5xl">
        {t.data.title}
      </h1>
      <p className="max-w-2xl border-l-2 border-fg pl-4 font-serif text-base italic text-fg-muted">
        {t.data.tagline}
      </p>
    </header>

    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        [t.data.files, '13'],
        [t.data.totalRows, '~6.1M'],
        [t.data.totalSize, '70.7 MB'],
        [t.data.license, 'ODbL 1.0'],
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
        {t.data.datasets}
      </h2>

      <div className="space-y-3">
        {DATASETS.map((d) => (
          <article key={d.file} className="border border-border bg-bg-elev">
            <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-5 py-4">
              <div className="flex items-baseline gap-3">
                <FileText size={14} className="text-fg-subtle" />
                <span className="font-mono text-sm font-bold text-fg">
                  {d.file}.parquet
                </span>
                <span className="font-mono text-[10px] tabular-nums text-fg-subtle">
                  {fmt(d.rows)} {t.data.rows}
                </span>
              </div>
              <a
                href={`${import.meta.env.BASE_URL}data/${d.file}.parquet`}
                download
                className="inline-flex items-center gap-2 border border-fg bg-bg px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg transition-colors hover:bg-fg hover:text-bg"
              >
                <Download size={11} />
                {t.common.download}
              </a>
            </header>
            <div className="px-5 py-3">
              <p className="font-serif text-sm italic text-fg-muted">{d.description[locale]}</p>
            </div>
            <div className="border-t border-border bg-bg-subtle px-5 py-3">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-fg-subtle">
                {t.data.columns}
              </div>
              <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {d.columns.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-baseline gap-2 font-mono text-[11px]"
                  >
                    <span className="text-fg">{c.name}</span>
                    <span className="text-fg-subtle">{c.type}</span>
                    {c.note && (
                      <span className="ml-auto truncate text-fg-muted">{pick(c.note, locale)}</span>
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
      <h3 className="mb-3 font-serif text-xl italic text-fg">{t.data.pipelineTitle}</h3>
      <p className="mb-3 font-mono text-[11px] text-fg-muted">
        {t.data.pipelineBody}
      </p>
      <pre className="overflow-x-auto bg-bg p-4 font-mono text-[11px] leading-relaxed text-fg">
{locale === 'ko' ? PIPELINE_CODE_KO : PIPELINE_CODE_EN}
      </pre>
    </section>
  </div>
  );
};
