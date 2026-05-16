#!/usr/bin/env python3
"""KPG 193 데이터셋 CSV/MAT → Parquet 변환.

Rule 5(소수점 절대 자르지 않는다) 준수: 모든 부동소수 컬럼은
DECIMAL(28, 12)로 저장하여 정밀도를 보존한다.

출력: frontend/public/data/*.parquet (zstd 최대 압축)
"""

import re
from pathlib import Path

import numpy as np
import pyarrow as pa
import pyarrow.csv as pcsv
import pyarrow.parquet as pq
import scipy.io

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "kpg193_v1_5"
DST = ROOT / "frontend" / "public" / "data"
DEC = pa.decimal128(28, 12)


def _to_decimal(table: pa.Table) -> pa.Table:
    arrays, fields = [], []
    for field in table.schema:
        col = table[field.name]
        if pa.types.is_floating(field.type):
            arrays.append(col.cast(DEC))
            fields.append(pa.field(field.name, DEC))
        else:
            arrays.append(col)
            fields.append(field)
    return pa.Table.from_arrays(arrays, schema=pa.schema(fields))


def _write(table: pa.Table, name: str) -> None:
    out = DST / f"{name}.parquet"
    out.parent.mkdir(parents=True, exist_ok=True)
    pq.write_table(table, out, compression="zstd", compression_level=15)
    size_kb = out.stat().st_size / 1024
    print(f"  {name:<24} {size_kb:>9.1f} KB  {table.num_rows:>8} rows")


def _read_csv(path: Path) -> pa.Table:
    return _to_decimal(pcsv.read_csv(path))


def convert_locations() -> None:
    print("• network/location")
    _write(_read_csv(SRC / "network" / "location" / "bus_location.csv"), "bus_location")


def convert_capacities() -> None:
    print("• renewables_capacity")
    for kind in ("solar", "wind", "hydro"):
        _write(_read_csv(SRC / "renewables_capacity" / f"{kind}_generators_2022.csv"),
               f"capacity_{kind}")


def convert_mustoff() -> None:
    print("• mustoff")
    _write(_read_csv(SRC / "mustoff" / "nuclear_mustoff.csv"), "nuclear_mustoff")


# MATPOWER column conventions (standard order)
BUS_COLS = ["bus_i", "type", "Pd", "Qd", "Gs", "Bs", "area", "Vm", "Va",
            "baseKV", "zone", "Vmax", "Vmin"]
GEN_COLS = ["bus", "Pg", "Qg", "Qmax", "Qmin", "Vg", "mBase", "status",
            "Pmax", "Pmin", "Pc1", "Pc2", "Qc1min", "Qc1max", "Qc2min",
            "Qc2max", "ramp_agc", "ramp_10", "ramp_30", "ramp_q", "apf"]
BRANCH_COLS = ["fbus", "tbus", "r", "x", "b", "rateA", "rateB", "rateC",
               "ratio", "angle", "status", "angmin", "angmax"]
DCLINE_COLS = ["fbus", "tbus", "status", "Pf", "Pt", "Qf", "Qt", "Vf", "Vt",
               "Pmin", "Pmax", "QminF", "QmaxF", "QminT", "QmaxT", "loss0",
               "loss1"]


def _mat_to_table(arr: np.ndarray, cols: list[str]) -> pa.Table:
    n = arr.shape[1]
    data = {col: arr[:, i] for i, col in enumerate(cols[:n])}
    return _to_decimal(pa.table(data))


def _extract_fuels(m_path: Path, section: str) -> list[str]:
    """`.m` 파일의 특정 섹션 (gen/gencost/genthermal) 끝에 붙은 fuel 주석 추출."""
    fuels: list[str] = []
    in_section = False
    pattern = re.compile(rf"mpc\.{section}\s*=\s*\[")
    fuel_re = re.compile(r"%\s*(Coal|LNG|Nuclear|Oil|Gas)", re.IGNORECASE)
    with m_path.open() as f:
        for line in f:
            if not in_section:
                if pattern.search(line):
                    in_section = True
                continue
            if "];" in line:
                break
            m = fuel_re.search(line)
            if m:
                fuels.append(m.group(1).lower())
    return fuels


def convert_matpower() -> None:
    print("• network/mat (MATPOWER)")
    mat = scipy.io.loadmat(SRC / "network" / "mat" / "KPG193_ver1_5.mat",
                           squeeze_me=True, struct_as_record=False)
    mpc = mat["mpc"]
    _write(_mat_to_table(mpc.bus, BUS_COLS), "buses")

    # gen + fuel 주석에서 추출한 fuel 컬럼 추가
    gen_table = _mat_to_table(mpc.gen, GEN_COLS)
    fuels = _extract_fuels(SRC / "network" / "m" / "KPG193_ver1_5.m", "genthermal")
    if len(fuels) == gen_table.num_rows:
        fuel_array = pa.array(fuels, type=pa.string())
        gen_table = gen_table.append_column("fuel", fuel_array)
    else:
        print(f"  WARN: fuel count {len(fuels)} != gen rows {gen_table.num_rows}, fuel 컬럼 생략")
    _write(gen_table, "generators")

    _write(_mat_to_table(mpc.branch, BRANCH_COLS), "branches")
    if hasattr(mpc, "dcline"):
        dcline = mpc.dcline
        if dcline.ndim == 1:
            dcline = dcline.reshape(1, -1)
        if dcline.size > 0:
            _write(_mat_to_table(dcline, DCLINE_COLS), "dc_lines")


def convert_daily_profile(subdir: str, prefix: str, name: str, days: int = 365) -> None:
    print(f"• profile/{subdir}")
    tables = []
    for day in range(1, days + 1):
        path = SRC / "profile" / subdir / f"{prefix}_{day}.csv"
        if not path.exists():
            print(f"  WARN: missing {path.name}")
            continue
        t = _read_csv(path)
        day_col = pa.array([day] * t.num_rows, type=pa.int16())
        t = t.add_column(0, pa.field("day", pa.int16()), day_col)
        tables.append(t)
    merged = pa.concat_tables(tables, promote_options="default")
    _write(merged, name)


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"원본 데이터셋이 없습니다: {SRC}")
    DST.mkdir(parents=True, exist_ok=True)
    print(f"출력 경로: {DST}\n")

    convert_matpower()
    convert_locations()
    convert_capacities()
    convert_mustoff()
    convert_daily_profile("demand", "daily_demand", "profile_demand")
    convert_daily_profile("renewables", "renewables", "profile_renewables")
    convert_daily_profile("weather", "weather", "profile_weather")
    convert_daily_profile("commitment_decision", "commitment_decision", "profile_commitment")

    total = sum(p.stat().st_size for p in DST.glob("*.parquet"))
    print(f"\n총 출력: {total / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
