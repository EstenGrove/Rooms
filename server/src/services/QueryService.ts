import { readFile, writeFile } from "node:fs/promises";
import { SQLite3DB, SQLITE_DATABASE } from "../db/db";

class QueryServicePG {
	public db: null;

	constructor(db: null) {
		this.db = db;
	}
}

class QueryService {
	public db: SQLite3DB;

	constructor(db: SQLite3DB) {
		this.db = db;
	}
	async query<T>(queryStr: string): Promise<T | unknown> {
		try {
			const results = await this.db.all(queryStr);
			return results as T;
		} catch (error) {
			return error;
		}
	}
	async select<T>(query: string, params: Array<any> = []): Promise<T[]> {
		try {
			const results = (await this.db.all(query, params)) as T[];
			const rows: T[] = results?.length ? results : [];
			return rows;
		} catch (error: unknown) {
			console.log("Whoopsie!", error);
			return [];
		}
	}
	async insert(query: string, params: Array<any>): Promise<boolean | unknown> {
		try {
			const results = await this.db.run(query, params);
			const wasCreated: boolean = !!results;
			return wasCreated;
		} catch (error: unknown) {
			console.log("Whoopsie!", error);
			return error;
		}
	}
	async update(query: string, params: Array<any>): Promise<boolean | unknown> {
		try {
			const results = await this.db.run(query, params);
			const wasCreated: boolean = !!results;
			return wasCreated;
		} catch (error: unknown) {
			console.log("Whoopsie!", error);
			return error;
		}
	}
	async delete(query: string, params: Array<any>): Promise<boolean | unknown> {
		try {
			const results = await this.db.run(query, params);
			const wasDeleted: boolean = !!results;
			return wasDeleted;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
}

export interface DALConfig<T> {
	read: (file: string) => Promise<T>;
	write: (file: string, params: any) => Promise<T>;
}

class DataAccessConfig<T> {
	public dbSrc: string;
	public strategy: DALConfig<T>;

	constructor(dbSrc: string, config: DALConfig<T>) {
		this.dbSrc = dbSrc;
		this.strategy = config;
	}

	async read<R>(): Promise<R | unknown> {
		try {
			const result = (await this.strategy.read(this.dbSrc)) as Promise<R>;
			return result as R;
		} catch (error: unknown) {
			console.log("Whoopsie:", error);
			return error as unknown;
		}
	}
	async write<W>(params: any): Promise<W | unknown> {
		try {
			const result = (await this.strategy.write(
				this.dbSrc,
				params
			)) as Promise<W>;
			return result;
		} catch (error) {
			console.log("Whoopsie:", error);
			return error;
		}
	}
}

/**
 * Uses a local '.txt' file as a database to read/write etc
 */
const textFileStrat: DALConfig<Buffer | void> = {
	read: async (file: string) => {
		return await readFile(file);
	},
	write: async (file: string, data: any) => {
		return await writeFile(file, data);
	},
};

const main = async () => {
	const txtDB = new DataAccessConfig("./database.txt", textFileStrat);
	const data = await txtDB.read();
	txtDB.write("Some data to write");
};

export { QueryService, DataAccessConfig };
