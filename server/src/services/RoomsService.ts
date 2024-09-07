import { Pool, Query, QueryResult } from "pg";
import { SQLITE_DATABASE as db, type SQLite3DB } from "../db/db";
import { MemberSvcResult } from "./MemberService";

export interface RoomSvcResult {
	room_id: number;
	room_name: string;
	room_code: string;
	is_active: boolean;
	is_alive: boolean;
	created_date: string;
	last_alive_date: string | null;
}
class RoomsServiceSQLite {
	#db: SQLite3DB;
	constructor(db: SQLite3DB) {
		this.#db = db;
	}
	async get(idOrCode: string | number) {
		if (typeof idOrCode === "number") {
			return await this.getByID(idOrCode);
		} else {
			return await this.getByCode(idOrCode);
		}
	}
	async getByName(roomName: string): Promise<RoomSvcResult | unknown> {
		try {
			const query = `SELECT * FROM rooms WHERE room_name = ?`;
			const results = (await this.#db.get(query, [roomName])) as RoomSvcResult;
			console.log("results", results);
			return results;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async getByID(roomID: number): Promise<RoomSvcResult | unknown> {
		try {
			const query = `SELECT * FROM rooms WHERE room_id = ?`;
			const results = (await this.#db.get(query, [roomID])) as RoomSvcResult;
			return results;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async getByCode(roomCode: string): Promise<RoomSvcResult | unknown> {
		try {
			const query = `SELECT * FROM rooms WHERE room_code = ?`;
			const results = (await this.#db.get(query, [roomCode])) as RoomSvcResult;
			return results;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async create(
		roomName: string,
		isAlive: boolean = false
	): Promise<RoomSvcResult | unknown> {
		try {
			const roomCode: string = crypto.randomUUID();
			const query = `INSERT INTO rooms (room_id, room_name, room_code, is_active, is_alive) VALUES (?, ?, ?, ?, ?)`;
			const results = await this.#db.run(query, [
				null,
				roomName,
				roomCode,
				true,
				isAlive,
			]);
			const newRoom = (await this.getByID(
				results.lastID as number
			)) as Promise<RoomSvcResult>;
			return (await newRoom) as RoomSvcResult;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	// ##TODO
	// - Expand this to support more fields to be updated!
	async update(
		roomID: number,
		isAlive: boolean = false
	): Promise<boolean | unknown> {
		try {
			const query = `UPDATE rooms SET is_alive = ? WHERE room_id = ?`;
			const results = await this.#db.run(query, [isAlive, roomID]);
			const wasUpdated: boolean = !!results;
			return wasUpdated;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async updateStatus(
		roomID: number,
		isAlive: boolean
	): Promise<boolean | unknown> {
		try {
			const query = `UPDATE rooms SET is_alive = ? WHERE room_id = ?`;
			const results = await this.#db.run(query, [isAlive, roomID]);
			const wasUpdated: boolean = !!results;
			return wasUpdated;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async getMembers(roomID: number): Promise<MemberSvcResult[] | unknown> {
		try {
			const query = `SELECT * FROM members WHERE room_id = ?`;
			const results = (await this.#db.all(query, [
				roomID,
			])) as MemberSvcResult[];
			return results;
		} catch (error: unknown) {
			console.log("Whoopie:", error);
			return error;
		}
	}
	// soft delete (is_active flag set to 'false')
	async delete(roomID: number): Promise<boolean | unknown> {
		try {
			const query = `UPDATE rooms SET is_active = false WHERE room_id = ?`;
			const results = await this.#db.run(query, [roomID]);
			const wasDeleted: boolean = !!results;
			return wasDeleted;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
}

class RoomsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	async get(idOrCode: string | number) {
		if (typeof idOrCode === "number") {
			return await this.getByID(idOrCode);
		} else {
			return await this.getByCode(idOrCode);
		}
	}
	async getByName(roomName: string): Promise<RoomSvcResult | unknown> {
		try {
			const query = `SELECT * FROM rooms WHERE room_name = $1`;
			const results = (await this.#db.query(query, [roomName])) as QueryResult;
			const row = results?.rows?.[0] as RoomSvcResult;
			return row;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async getByID(roomID: number): Promise<RoomSvcResult | unknown> {
		try {
			const query = `SELECT * FROM rooms WHERE room_id = $1`;
			const results = (await this.#db.query(query, [roomID])) as QueryResult;
			const row = results?.rows?.[0] as RoomSvcResult;
			return row;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async getByCode(roomCode: string): Promise<RoomSvcResult | unknown> {
		try {
			const query = `SELECT * FROM rooms WHERE room_code = $1`;
			const results = (await this.#db.query(query, [roomCode])) as QueryResult;
			const row = results?.rows?.[0] as RoomSvcResult;
			return row;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async join(memberID: number, roomID: number) {
		try {
			const memberRoomsQuery = `
				INSERT INTO member_rooms (member_id, room_id)
				VALUES ($1, $2)
				ON CONFLICT (member_id, room_id)
				DO UPDATE SET
				room_id = $2
				RETURNING *
			`;
			// add to member_rooms
			const memberQuery = `
				UPDATE members
				SET room_id = $1, is_alive = true
				WHERE member_id = $2
				RETURNING *`;
			const mResult = (await this.#db.query(memberQuery, [
				roomID,
				memberID,
			])) as QueryResult;
			const mrResult = (await this.#db.query(memberRoomsQuery, [
				memberID,
				roomID,
			])) as QueryResult;

			const memberRoom = mrResult?.rows?.[0];
			const member = mResult.rows?.[0] as MemberSvcResult;

			return member;
		} catch (error) {
			return error;
		}
	}
	async create(
		roomName: string,
		isAlive: boolean = false
	): Promise<RoomSvcResult | unknown> {
		try {
			const roomCode: string = crypto.randomUUID();
			const query = `INSERT INTO rooms (room_id, room_name, room_code, is_active, is_alive) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
			const results = await this.#db.query(query, [
				null,
				roomName,
				roomCode,
				true,
				isAlive,
			]);
			const row = results?.rows?.[0] as RoomSvcResult;
			return row;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async getMembers(roomID: number): Promise<MemberSvcResult[] | unknown> {
		try {
			const query = `SELECT * FROM members WHERE room_id = $1 AND is_active = true`;
			const results = (await this.#db.query(query, [roomID])) as QueryResult;
			const rows = results?.rows as MemberSvcResult[];
			return rows;
		} catch (error) {}
	}
	async delete(roomID: number): Promise<boolean | unknown> {
		try {
			const query = `UPDATE rooms SET is_active = false WHERE room_id = $1 RETURNING *`;
			const results = (await this.#db.query(query, [roomID])) as QueryResult;
			const row = results?.rows?.[0] as RoomSvcResult;
			return row;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
}

export { RoomsService };
