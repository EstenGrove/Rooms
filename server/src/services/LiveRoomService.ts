import { Pool, QueryResult } from "pg";
import { SQLite3DB } from "../db/db";
import { RoomSvcResult } from "./RoomsService";
import { MemberSvcResult } from "./MemberService";

export interface RoomSessionSvcResult {
	session_id: number;
	room_id: number;
	session_start_date: string;
	session_end_date: string | null;
	created_date: string;
	last_alive_date: string;
	is_active: boolean;
	is_alive: boolean;
}

class LiveRoomService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	async start(
		userID: string,
		roomID: number
	): Promise<RoomSessionSvcResult | unknown> {
		try {
			const query = `SELECT * FROM start_live_room($1, $2);`;
			const results = (await this.#db.query(query, [
				userID,
				roomID,
			])) as QueryResult;
			const session = results?.rows?.[0] as RoomSessionSvcResult;
			return session;
		} catch (error) {
			return error;
		}
	}
	async stop(
		userID: string,
		roomID: number
	): Promise<RoomSessionSvcResult | unknown> {
		try {
			const query = `SELECT * FROM stop_live_room($1, $2);`;
			const results = (await this.#db.query(query, [
				userID,
				roomID,
			])) as QueryResult;
			const session = results?.rows?.[0] as RoomSessionSvcResult;
			return session;
		} catch (error) {
			return error;
		}
	}
	async isAlive(roomCode: string, roomID?: number): Promise<boolean | unknown> {
		if (!roomCode && !roomID) return false;
		try {
			const query = `SELECT * FROM is_room_alive($1, $2);`;
			const results = (await this.#db.query(query, [
				roomCode,
				roomID,
			])) as QueryResult;
			const isLive: boolean = results?.rows?.[0] as boolean;
			return isLive;
		} catch (error) {
			return error;
		}
	}
	async joinAsGuest(
		roomCode: string,
		memberName: string
	): Promise<MemberSvcResult | unknown> {
		try {
			const query = `SELECT * FROM join_room_as_guest($1, $2);`;
			const results = (await this.#db.query(query, [
				roomCode,
				memberName,
			])) as QueryResult;
			const member = results?.rows?.[0] as MemberSvcResult;
			return member;
		} catch (error) {
			return error;
		}
	}
}

export { LiveRoomService };
