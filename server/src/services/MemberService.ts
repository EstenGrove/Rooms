import { Pool, QueryResult } from "pg";
import { SQLite3DB } from "../db/db";
import { RoomSvcResult } from "./RoomsService";

export interface MemberSvcResult {
	room_id: number;
	member_id: number;
	member_name: string;
	is_active: boolean;
	is_alive: boolean;
	created_date: string;
	last_alive_date: string | null;
}

class MemberServiceSQLite {
	#db: SQLite3DB;
	constructor(db: SQLite3DB) {
		this.#db = db;
	}

	async getByName(memberName: string): Promise<MemberSvcResult | unknown> {
		try {
			const query = `SELECT * FROM members WHERE member_name = ?`;
			const results = (await this.#db.get(query, [
				memberName,
			])) as MemberSvcResult;
			return results;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async getByID(memberID: number): Promise<MemberSvcResult | unknown> {
		try {
			const query = `SELECT * FROM members WHERE member_id = ?`;
			const results = (await this.#db.get(query, [
				memberID,
			])) as MemberSvcResult;
			return results;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async create(
		memberName: string,
		roomID: number = 4, // defaults to '----UNASSIGNED----' room
		isAlive: boolean = false
	): Promise<MemberSvcResult | unknown> {
		try {
			const query = `
				INSERT INTO members (member_id, room_id, member_name, is_alive, is_active)
				VALUES ($1, $2, $3, $4, $5)`;
			const results = await this.#db.run(query, [
				null,
				roomID,
				memberName,
				isAlive,
				true,
			]);
			const newMember = (await this.getByID(
				results.lastID as number
			)) as MemberSvcResult;
			return newMember as MemberSvcResult;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async update(
		memberID: number,
		isAlive: boolean = false
	): Promise<boolean | unknown> {
		try {
			const query = `UPDATE members SET is_alive = ? WHERE member_id = ?`;
			const results = await this.#db.run(query, [isAlive, memberID]);
			const wasUpdated: boolean = !!results;
			return wasUpdated;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async getRooms(memberID: number): Promise<RoomSvcResult[] | unknown> {
		try {
			const query = `SELECT rooms.* FROM rooms INNER JOIN members ON rooms.room_id = members.room_id AND members.member_id = ?`;
			const results = (await this.#db.all(query, [
				memberID,
			])) as RoomSvcResult[];
			return results;
		} catch (error: unknown) {
			console.log("Whoopie:", error);
			return error;
		}
	}
	// soft delete (is_active flag set to 'false')
	async delete(memberID: number): Promise<boolean | unknown> {
		try {
			const query = `UPDATE members SET is_active = false WHERE member_id = ?`;
			const results = await this.#db.run(query, [memberID]);
			const wasDeleted: boolean = !!results;
			return wasDeleted;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
}

class MemberService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}

	async getByName(memberName: string): Promise<MemberSvcResult | unknown> {
		try {
			const query = `SELECT * FROM members WHERE member_name = $1`;
			const results = (await this.#db.query(query, [
				memberName,
			])) as QueryResult;
			const row = results?.rows?.[0] as MemberSvcResult;
			return row as MemberSvcResult;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async getByID(memberID: number): Promise<MemberSvcResult | unknown> {
		try {
			const query = `SELECT * FROM members WHERE member_id = $1`;
			const results = (await this.#db.query(query, [memberID])) as QueryResult;
			const row = results?.rows?.[0] as MemberSvcResult;
			return row as MemberSvcResult;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async create(
		memberName: string,
		roomID: number = 4, // defaults to '----UNASSIGNED----' room
		isAlive: boolean = false
	): Promise<MemberSvcResult | unknown> {
		try {
			const query = `
				INSERT INTO members (room_id, member_name, is_alive, is_active)
				VALUES ($1, $2, $3, $4) RETURNING *`;
			const results = await this.#db.query(query, [
				roomID,
				memberName,
				isAlive,
				true,
			]);

			const newMember = results?.rows?.[0] as MemberSvcResult;

			return newMember as MemberSvcResult;
		} catch (error: unknown) {
			console.log("Whoops:", error);
			return error;
		}
	}
	async update(memberID: number, isAlive: boolean = true) {
		try {
			const query = `
				UPDATE members
				SET is_alive = $1
				WHERE member_id = $2
				RETURNING *`;
			const results = (await this.#db.query(query, [
				isAlive,
				memberID,
			])) as QueryResult;
			const row = results?.rows?.[0] as MemberSvcResult;
			return row;
		} catch (error) {
			return error;
		}
	}
}

export { MemberService };
