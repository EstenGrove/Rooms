import { Pool, QueryResult } from "pg";
import { SQLite3DB } from "../db/db";
import { getDiffInMins } from "../utils/utils_dates";

export interface SessionSvcResult {
	session_id: number;
	room_id: number;
	members: number[];
	is_alive: boolean;
	session_start_date: string;
	session_end_date: string;
	created_date: string;
	last_alive_date: string | null;
}

class SessionServiceSQLite {
	#db: SQLite3DB;
	constructor(db: SQLite3DB) {
		this.#db = db;
	}
	async isAlive(sessionID: number): Promise<boolean | unknown> {
		try {
			const query = `SELECT is_alive FROM sessions WHERE session_id = ?`;
			const results = (await this.#db.get(query, [sessionID])) as {
				is_alive: boolean;
			};
			const isAliveSession: boolean = Boolean(results?.is_alive);
			return isAliveSession;
		} catch (error) {
			console.log("Whoopsie:", error);
			return error;
		}
	}
	async getLength(sessionID: number): Promise<number> {
		try {
			const session = (await this.get(sessionID)) as SessionSvcResult;
			const sessionLength = this.#calculateLength(session);
			return sessionLength;
		} catch (error) {
			return 0.0;
		}
	}
	async getAllByStatus(
		isAlive: boolean = true
	): Promise<SessionSvcResult[] | unknown> {
		try {
			const query = `SELECT * FROM sessions WHERE is_alive = ?`;
			const results = (await this.#db.all(query, [
				isAlive,
			])) as SessionSvcResult[];
			return results;
		} catch (error) {
			return error;
		}
	}
	async get(sessionID: number): Promise<SessionSvcResult | unknown> {
		try {
			const query = `SELECT * FROM sessions WHERE session_id = ?`;
			const results = (await this.#db.get(query, [
				sessionID,
			])) as SessionSvcResult;
			return results as SessionSvcResult;
		} catch (error: unknown) {
			return error;
		}
	}
	async getByRoomID(roomID: number): Promise<SessionSvcResult[] | unknown> {
		try {
			const query = `SELECT * FROM sessions WHERE room_id = ?`;
			const results = (await this.#db.all(query, [
				roomID,
			])) as SessionSvcResult[];
			return results;
		} catch (error: unknown) {
			return error;
		}
	}
	async start(sessionID: number): Promise<SessionSvcResult | unknown> {
		try {
			const startTime = new Date().toUTCString();
			const query = `UPDATE sessions SET is_alive = ?, session_start_date = ? WHERE session_id = ?`;
			const results = await this.#db.run(query, [true, startTime, sessionID]);
			return results;
		} catch (error: unknown) {
			return error;
		}
	}
	async stop(sessionID: number): Promise<SessionSvcResult | unknown> {
		try {
			const endTime = new Date().toUTCString();
			const query = `UPDATE sessions SET is_alive = false, session_end_date = ?, last_alive_date = ? WHERE session_id = ?`;
			const results = await this.#db.run(query, [endTime, endTime, sessionID]);
			return results;
		} catch (error: unknown) {
			return error;
		}
	}
	async create(roomID: number, isAlive: boolean = false) {
		try {
			const createQuery = `INSERT INTO sessions (session_id, room_id, is_alive) VALUES (?, ?, ?)`;
			const results = await this.#db.run(createQuery, [null, roomID, isAlive]);
			const wasCreated: boolean = !!results;
			return wasCreated;
		} catch (error: unknown) {
			return error;
		}
	}
	async join(sessionID: number, memberID: number) {
		try {
			const beforeRow = (await this.get(sessionID)) as SessionSvcResult;
			const members: number[] = beforeRow.members;
			const query = `UPDATE sessions SET members = json_insert(?, '$[#]', ?) WHERE session_id = ?`;
			const results = await this.#db.run(query, [members, memberID, sessionID]);
			console.log("results", results);
			return results;
		} catch (error) {
			console.log("Whoops", error);
			return error;
		}
	}

	// we have to parse the date, since we cannot guarantee the format
	// - could be UTC DB timestamp, unix epoch etc
	// - we also want to make sure all relevant dates are in a shared format (eg. UTC or local time)
	#parseDate(date: string | null): string {
		if (!date) return "";

		const newDate: Date = new Date(date);
		const localDate: string = newDate.toString();
		console.log("Parsed(local):", localDate);
		return localDate;
	}
	#calculateLength(session: SessionSvcResult): number {
		const { session_start_date, session_end_date } = session;
		const startDate: string = this.#parseDate(session_start_date);
		const endDate: string = this.#parseDate(session_end_date);

		// session hasn't started yet
		if (!startDate) return 0.0;

		if (!endDate) {
			const now = new Date().toString();
			const diffInMins: number = getDiffInMins(startDate, now);
			return diffInMins;
		} else {
			const diffInMins: number = getDiffInMins(startDate, endDate);
			return diffInMins;
		}
	}
}

class SessionService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async get(sessionID: number): Promise<SessionSvcResult | unknown> {
		try {
			const query = `SELECT * FROM sessions WHERE session_id = ?`;
			const results = (await this.#db.query(query, [sessionID])) as QueryResult;
			const row = results?.rows?.[0] as SessionSvcResult;
			return row as SessionSvcResult;
		} catch (error: unknown) {
			return error;
		}
	}
	async isAlive(sessionID: number): Promise<boolean | unknown> {
		try {
			const query = `SELECT is_alive FROM sessions WHERE session_id = ?`;
			const results = (await this.#db.query(query, [sessionID])) as QueryResult;
			const row = results?.rows?.[0] as SessionSvcResult;
			const isAliveSession: boolean = Boolean(row?.is_alive);
			return isAliveSession;
		} catch (error) {
			console.log("Whoopsie:", error);
			return error;
		}
	}
	async getLength(sessionID: number): Promise<number> {
		try {
			const session = (await this.get(sessionID)) as SessionSvcResult;
			const sessionLength = this.#calculateLength(session);
			return sessionLength;
		} catch (error) {
			return 0.0;
		}
	}
	async getAllByStatus(
		isAlive: boolean = true
	): Promise<SessionSvcResult[] | unknown> {
		try {
			const query = `SELECT * FROM sessions WHERE is_alive = ?`;
			const results = (await this.#db.query(query, [isAlive])) as QueryResult;
			const rows = results?.rows as SessionSvcResult[];
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getByRoomID(roomID: number): Promise<SessionSvcResult[] | unknown> {
		try {
			const query = `SELECT * FROM sessions WHERE room_id = ?`;
			const results = (await this.#db.query(query, [roomID])) as QueryResult;
			const row = results?.rows?.[0] as SessionSvcResult;
			return row;
		} catch (error: unknown) {
			return error;
		}
	}
	async start(sessionID: number): Promise<SessionSvcResult | unknown> {
		try {
			const startTime = new Date().toUTCString();
			const query = `UPDATE sessions SET is_alive = ?, session_start_date = ? WHERE session_id = ?`;
			const results = (await this.#db.query(query, [
				true,
				startTime,
				sessionID,
			])) as QueryResult;
			const row = results?.rows?.[0] as SessionSvcResult;
			return row;
		} catch (error: unknown) {
			return error;
		}
	}
	async stop(sessionID: number): Promise<SessionSvcResult | unknown> {
		try {
			const endTime = new Date().toUTCString();
			const query = `UPDATE sessions SET is_alive = false, session_end_date = $1, last_alive_date = $2 WHERE session_id = $3`;
			const results = (await this.#db.query(query, [
				endTime,
				endTime,
				sessionID,
			])) as QueryResult;
			const row = results?.rows?.[0] as SessionSvcResult;
			return row;
		} catch (error: unknown) {
			return error;
		}
	}
	async create(
		roomID: number,
		isAlive: boolean = false
	): Promise<SessionSvcResult | unknown> {
		try {
			const createQuery = `
				INSERT INTO sessions (session_id, room_id, is_alive)
				VALUES ($1, $1, $1)
				RETURNING *`;
			const results = (await this.#db.query(createQuery, [
				null,
				roomID,
				isAlive,
			])) as QueryResult;
			const row = results?.rows?.[0] as SessionSvcResult;
			return row;
		} catch (error: unknown) {
			return error;
		}
	}
	async join(
		sessionID: number,
		memberID: number
	): Promise<SessionSvcResult | unknown> {
		try {
			const query = `
			UPDATE sessions
			SET member_ids = array_append(member_ids, $1)
			WHERE session_id = $4
			RETURNING *`;
			const results = (await this.#db.query(query, [
				memberID,
				sessionID,
			])) as QueryResult;
			console.log("results", results);
			const row = results?.rows?.[0] as SessionSvcResult;
			return row;
		} catch (error) {
			console.log("Whoops", error);
			return error;
		}
	}
	#parseDate(date: string | null): string {
		if (!date) return "";

		const newDate: Date = new Date(date);
		const localDate: string = newDate.toString();
		console.log("Parsed(local):", localDate);
		return localDate;
	}
	#calculateLength(session: SessionSvcResult): number {
		const { session_start_date, session_end_date } = session;
		const startDate: string = this.#parseDate(session_start_date);
		const endDate: string = this.#parseDate(session_end_date);

		// session hasn't started yet
		if (!startDate) return 0.0;

		if (!endDate) {
			const now = new Date().toString();
			const diffInMins: number = getDiffInMins(startDate, now);
			return diffInMins;
		} else {
			const diffInMins: number = getDiffInMins(startDate, endDate);
			return diffInMins;
		}
	}
}

export { SessionService };
