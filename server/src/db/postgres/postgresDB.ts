import { Pool, PoolConfig, QueryResult } from "pg";
import { dbConfig } from "../../configs/postgres";
// PostgreSQL Database Pool
// - A pool of database connections

const pool: Pool = new Pool(dbConfig);

export default pool;
