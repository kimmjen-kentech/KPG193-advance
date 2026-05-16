import { useState } from 'react';
import { Terminal } from 'lucide-react';
import { cn } from '../lib/cn';
import { useI18n } from '../hooks/useI18n';
import type { Locale } from '../i18n/translations';

type Lang = 'julia' | 'python' | 'matlab';

const TABS: Array<{ id: Lang; label: string }> = [
  { id: 'julia', label: 'Julia' },
  { id: 'python', label: 'Python' },
  { id: 'matlab', label: 'MATLAB' },
];

interface LocalizedSnippet {
  title: { ko: string; en: string };
  body: { ko: string; en: string };
}

const SNIPPETS: Record<Lang, LocalizedSnippet[]> = {
  julia: [
    {
      title: { ko: '네트워크 로드 (MATPOWER)', en: 'Load Network (MATPOWER)' },
      body: {
        ko: `using MAT, DataFrames, CSV

mpc = matread("kpg193_v1_5/network/mat/KPG193_ver1_5.mat")["mpc"]

buses      = mpc["bus"]      # 193 × 13
generators = mpc["gen"]      # 122 × 21
branches   = mpc["branch"]   # 358 × 13
genfuel    = mpc["genthermal"]  # 연료 정보 포함

println("Loaded KPG 193 v1.5: \$(size(buses, 1)) buses")

# 버스 위치
locations = CSV.read("kpg193_v1_5/network/location/bus_location.csv", DataFrame)`,
        en: `using MAT, DataFrames, CSV

mpc = matread("kpg193_v1_5/network/mat/KPG193_ver1_5.mat")["mpc"]

buses      = mpc["bus"]      # 193 × 13
generators = mpc["gen"]      # 122 × 21
branches   = mpc["branch"]   # 358 × 13
genfuel    = mpc["genthermal"]  # fuel info embedded

println("Loaded KPG 193 v1.5: \$(size(buses, 1)) buses")

# Bus locations
locations = CSV.read("kpg193_v1_5/network/location/bus_location.csv", DataFrame)`,
      },
    },
    {
      title: { ko: '시간별 프로파일 (Day 1)', en: 'Hourly Profile (Day 1)' },
      body: {
        ko: `using CSV, DataFrames

day = 1
demand     = CSV.read("kpg193_v1_5/profile/demand/daily_demand_\$day.csv", DataFrame)
renewables = CSV.read("kpg193_v1_5/profile/renewables/renewables_\$day.csv", DataFrame)
weather    = CSV.read("kpg193_v1_5/profile/weather/weather_\$day.csv", DataFrame)

# 실제 태양광 출력 = 용량 × 프로파일 계수
solar_cap = CSV.read("kpg193_v1_5/renewables_capacity/solar_generators_2022.csv", DataFrame)
# solar_gen[bus, hour] = solar_cap[bus, :Pmax] * renewables[bus, hour, :pv_profile_ratio]`,
        en: `using CSV, DataFrames

day = 1
demand     = CSV.read("kpg193_v1_5/profile/demand/daily_demand_\$day.csv", DataFrame)
renewables = CSV.read("kpg193_v1_5/profile/renewables/renewables_\$day.csv", DataFrame)
weather    = CSV.read("kpg193_v1_5/profile/weather/weather_\$day.csv", DataFrame)

# Actual solar output = capacity × profile ratio
solar_cap = CSV.read("kpg193_v1_5/renewables_capacity/solar_generators_2022.csv", DataFrame)
# solar_gen[bus, hour] = solar_cap[bus, :Pmax] * renewables[bus, hour, :pv_profile_ratio]`,
      },
    },
    {
      title: { ko: '기준 UC 참조', en: 'Reference UC Solution' },
      body: {
        ko: `commit = CSV.read("kpg193_v1_5/profile/commitment_decision/commitment_decision_\$day.csv", DataFrame)
# columns: hour (1-24), generator_id (1-122), status (0=off, 1=on)
# 알고리즘 검증용 기준 UC 해 (tight MILP)`,
        en: `commit = CSV.read("kpg193_v1_5/profile/commitment_decision/commitment_decision_\$day.csv", DataFrame)
# columns: hour (1-24), generator_id (1-122), status (0=off, 1=on)
# Reference solution for algorithm validation (tight MILP)`,
      },
    },
  ],
  python: [
    {
      title: { ko: '네트워크 로드 (MATPOWER)', en: 'Load Network (MATPOWER)' },
      body: {
        ko: `import scipy.io
import pandas as pd

mat = scipy.io.loadmat("kpg193_v1_5/network/mat/KPG193_ver1_5.mat",
                      squeeze_me=True, struct_as_record=False)
mpc = mat["mpc"]

buses      = mpc.bus       # (193, 13)
generators = mpc.gen       # (122, 21)
branches   = mpc.branch    # (358, 13)

print(f"KPG 193 v1.5: {buses.shape[0]} 개 버스")

locations = pd.read_csv("kpg193_v1_5/network/location/bus_location.csv")`,
        en: `import scipy.io
import pandas as pd

mat = scipy.io.loadmat("kpg193_v1_5/network/mat/KPG193_ver1_5.mat",
                      squeeze_me=True, struct_as_record=False)
mpc = mat["mpc"]

buses      = mpc.bus       # (193, 13)
generators = mpc.gen       # (122, 21)
branches   = mpc.branch    # (358, 13)

print(f"KPG 193 v1.5: {buses.shape[0]} buses")

locations = pd.read_csv("kpg193_v1_5/network/location/bus_location.csv")`,
      },
    },
    {
      title: { ko: 'Parquet (정밀도 보존)', en: 'Parquet (precision preserved)' },
      body: {
        ko: `# 본 사이트가 제공하는 Parquet은 DECIMAL(28, 12)로 변환된 동일 데이터
import pyarrow.parquet as pq
import pandas as pd

buses    = pq.read_table("frontend/public/data/buses.parquet").to_pandas()
demand   = pq.read_table("frontend/public/data/profile_demand.parquet")
gens     = pq.read_table("frontend/public/data/generators.parquet").to_pandas()

# fuel별 용량
gens.groupby("fuel")["Pmax"].sum()`,
        en: `# The Parquet served here is the same data converted to DECIMAL(28, 12)
import pyarrow.parquet as pq
import pandas as pd

buses    = pq.read_table("frontend/public/data/buses.parquet").to_pandas()
demand   = pq.read_table("frontend/public/data/profile_demand.parquet")
gens     = pq.read_table("frontend/public/data/generators.parquet").to_pandas()

# Capacity by fuel
gens.groupby("fuel")["Pmax"].sum()`,
      },
    },
    {
      title: { ko: '시간별 프로파일 (Day 1)', en: 'Hourly Profile (Day 1)' },
      body: {
        ko: `day = 1
demand     = pd.read_csv(f"kpg193_v1_5/profile/demand/daily_demand_{day}.csv")
renewables = pd.read_csv(f"kpg193_v1_5/profile/renewables/renewables_{day}.csv")

# bus 10, hour 12의 실제 태양광 출력 계산
solar_cap = pd.read_csv("kpg193_v1_5/renewables_capacity/solar_generators_2022.csv")
cap_10  = solar_cap.loc[solar_cap["bus_ID"] == 10, "Pmax [MW]"].iloc[0]
ratio_h12 = renewables.query("bus_id == 10 and hour == 12")["pv_profile_ratio"].iloc[0]
solar_gen_10_12 = cap_10 * ratio_h12`,
        en: `day = 1
demand     = pd.read_csv(f"kpg193_v1_5/profile/demand/daily_demand_{day}.csv")
renewables = pd.read_csv(f"kpg193_v1_5/profile/renewables/renewables_{day}.csv")

# Actual solar output at bus 10, hour 12
solar_cap = pd.read_csv("kpg193_v1_5/renewables_capacity/solar_generators_2022.csv")
cap_10  = solar_cap.loc[solar_cap["bus_ID"] == 10, "Pmax [MW]"].iloc[0]
ratio_h12 = renewables.query("bus_id == 10 and hour == 12")["pv_profile_ratio"].iloc[0]
solar_gen_10_12 = cap_10 * ratio_h12`,
      },
    },
  ],
  matlab: [
    {
      title: { ko: '네트워크 로드 (MATPOWER)', en: 'Load Network (MATPOWER)' },
      body: {
        ko: `% MATPOWER이 PATH에 있어야 함
mpc = loadcase('kpg193_v1_5/network/m/KPG193_ver1_5.m');

fprintf('KPG 193 v1.5\\n');
fprintf('Buses:      %d\\n', size(mpc.bus, 1));
fprintf('Generators: %d\\n', size(mpc.gen, 1));
fprintf('Branches:   %d\\n', size(mpc.branch, 1));
fprintf('Base MVA:   %.1f\\n', mpc.baseMVA);

locations = readtable('kpg193_v1_5/network/location/bus_location.csv');`,
        en: `% MATPOWER must be on PATH
mpc = loadcase('kpg193_v1_5/network/m/KPG193_ver1_5.m');

fprintf('KPG 193 v1.5\\n');
fprintf('Buses:      %d\\n', size(mpc.bus, 1));
fprintf('Generators: %d\\n', size(mpc.gen, 1));
fprintf('Branches:   %d\\n', size(mpc.branch, 1));
fprintf('Base MVA:   %.1f\\n', mpc.baseMVA);

locations = readtable('kpg193_v1_5/network/location/bus_location.csv');`,
      },
    },
    {
      title: { ko: 'AC-OPF 실행', en: 'Run AC-OPF' },
      body: {
        ko: `results = runopf(mpc);

if results.success
    fprintf('총 비용: \\$%.2f\\n', results.f);
else
    error('OPF 수렴 실패');
end`,
        en: `results = runopf(mpc);

if results.success
    fprintf('Total cost: \\$%.2f\\n', results.f);
else
    error('OPF did not converge');
end`,
      },
    },
  ],
};

const pick = <T extends { ko: string; en: string }>(s: T, locale: Locale) => s[locale];

export const GuidePage = () => {
  const { t, locale } = useI18n();
  const [active, setActive] = useState<Lang>('python');
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          {t.guide.label}
        </span>
        <h1 className="font-serif text-4xl italic leading-none tracking-tight text-fg sm:text-5xl">
          {t.guide.title}
        </h1>
        <p className="max-w-2xl border-l-2 border-fg pl-4 font-serif text-base italic text-fg-muted">
          {t.guide.tagline}
        </p>
      </header>

      <section className="border border-border bg-bg-elev">
        <div className="flex border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'border-r border-border px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors',
                active === tab.id
                  ? 'bg-bg text-fg border-b-2 border-b-accent'
                  : 'text-fg-subtle hover:bg-bg-subtle hover:text-fg',
              )}
            >
              <Terminal size={11} className="mr-2 inline-block align-middle" />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {SNIPPETS[active].map((snip, i) => (
        <section key={pick(snip.title, locale)} className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center bg-fg font-mono text-[10px] font-bold text-bg">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-serif text-xl italic text-fg">{pick(snip.title, locale)}</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => copy(`${active}-${i}`, pick(snip.body, locale))}
              className="absolute right-3 top-3 z-10 border border-border bg-bg-elev px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted transition-colors hover:bg-fg hover:text-bg"
            >
              {copied === `${active}-${i}` ? t.guide.copied : t.guide.copy}
            </button>
            <pre className="overflow-x-auto border border-border bg-bg p-5 pr-24 font-mono text-[12px] leading-relaxed text-fg">
              {pick(snip.body, locale)}
            </pre>
          </div>
        </section>
      ))}

      <section className="border border-border bg-bg-elev p-6">
        <h3 className="mb-2 font-serif text-xl italic text-fg">{t.guide.referenceUcTitle}</h3>
        <p className="font-serif text-sm italic text-fg-muted">
          {t.guide.referenceUcBody}
        </p>
      </section>
    </div>
  );
};
