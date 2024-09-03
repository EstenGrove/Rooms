import dotenv from "dotenv";
dotenv.config();
import { PoolConfig } from "pg";

export interface PgSQLConfig extends PoolConfig {
	user: string | undefined;
	password: string | undefined;
	host: string | undefined;
	database: string | undefined;
	port: number | undefined;
}

const DB_CONFIG: PgSQLConfig = {
	user: process.env.DB_USER,
	password: process.env.DB_USER_PWD,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	port: Number(process.env.DB_PORT),
};

export { DB_CONFIG as dbConfig };
