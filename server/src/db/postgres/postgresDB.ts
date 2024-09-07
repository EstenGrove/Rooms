import pg from "pg";
import type { Pool as PGPool, QueryResultRow } from "pg";
import { dbConfig } from "../../configs/postgres";
// PostgreSQL Database Pool
// - A pool of database connections

const { Pool } = pg;

export type TQueryRow<T extends QueryResultRow> = T;

const pool: PGPool = new Pool(dbConfig);

export default pool;
