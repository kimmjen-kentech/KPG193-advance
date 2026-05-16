import * as duckdb from '@duckdb/duckdb-wasm';

let dbPromise: Promise<duckdb.AsyncDuckDB> | null = null;

const initDB = async (): Promise<duckdb.AsyncDuckDB> => {
  const bundles = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(bundles);
  const workerScript = `importScripts("${bundle.mainWorker!}");`;
  const workerUrl = URL.createObjectURL(new Blob([workerScript], { type: 'text/javascript' }));
  const worker = new Worker(workerUrl);
  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(workerUrl);
  return db;
};

export const getDB = (): Promise<duckdb.AsyncDuckDB> => {
  if (!dbPromise) dbPromise = initDB();
  return dbPromise;
};

export const resetDB = (): void => {
  dbPromise = null;
};

export type Row = Record<string, unknown>;

export const query = async <T = Row>(sql: string): Promise<T[]> => {
  const db = await getDB();
  const conn = await db.connect();
  try {
    const result = await conn.query(sql);
    return result.toArray().map((r) => r.toJSON()) as T[];
  } finally {
    await conn.close();
  }
};

const PARQUET_BASE = `${import.meta.env.BASE_URL}data`;

export const parquetUrl = (name: string): string => `${PARQUET_BASE}/${name}.parquet`;
