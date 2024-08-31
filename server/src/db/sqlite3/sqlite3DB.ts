import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Saved to: './db/rooms.db'
const __dirname = import.meta.dirname;
const dbFileName: string = "rooms.db";

export type SQLite3DB = Database<sqlite3.Database, sqlite3.Statement>;

const DB_FILE: string = path.join(__dirname, dbFileName);

const createDatabase = async (dbFile: string = DB_FILE): Promise<SQLite3DB> => {
	// checks if database file exists & creates it, otherwise opens a connection to it
	const db: SQLite3DB = await open({
		filename: dbFile,
		driver: sqlite3.Database,
	});
	return db;
};

// const SQLITE_DATABASE: SQLite3DB = await createDatabase(DB_FILE);

export {
	// SQLITE_DATABASE,
	createDatabase,
};
