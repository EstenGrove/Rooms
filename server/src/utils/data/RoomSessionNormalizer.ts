export interface RoomSessionDB {
	session_id: number;
	room_id: number;
	member_ids: number[];
	is_active: boolean;
	is_alive: boolean;
	session_start_date: string | null;
	session_end_date: string | null;
	created_date: string;
	last_alive_date: string | null;
}

export interface RoomSessionClient {
	sessionID: number;
	roomID: number;
	memberIDs: number[];
	isActive: boolean;
	isAlive: boolean;
	sessionStartDate: string | null;
	sessionEndDate: string | null;
	createdDate: string;
	lastAliveDate: string | null;
}

class RoomSessionNormalizer {
	#toDB(record: RoomSessionClient): RoomSessionDB {
		const dbRecord: RoomSessionDB = {
			session_id: record.sessionID,
			room_id: record.roomID,
			member_ids: record.memberIDs,
			is_active: record.isActive,
			is_alive: record.isAlive,
			session_start_date: record.sessionStartDate,
			session_end_date: record.sessionEndDate,
			created_date: record.createdDate,
			last_alive_date: record.lastAliveDate,
		};
		return dbRecord;
	}
	#toClient(record: RoomSessionDB): RoomSessionClient {
		const clientRecord: RoomSessionClient = {
			sessionID: record.session_id,
			roomID: record.room_id,
			memberIDs: record.member_ids,
			isActive: record.is_active,
			isAlive: record.is_alive,
			createdDate: record.created_date,
			lastAliveDate: record.last_alive_date,
			sessionStartDate: record.session_start_date,
			sessionEndDate: record.session_end_date,
		};

		return clientRecord;
	}

	public toDBOne(record: RoomSessionClient): RoomSessionDB {
		return this.#toDB(record);
	}
	public toClientOne(record: RoomSessionDB): RoomSessionClient {
		return this.#toClient(record);
	}

	public toDB(records: RoomSessionClient[]): RoomSessionDB[] {
		if (!records || !records.length) return [];

		const dbRecords: RoomSessionDB[] = records.map(this.#toDB);

		return dbRecords;
	}
	public toClient(records: RoomSessionDB[]): RoomSessionClient[] {
		if (!records || !records.length) return [];

		const clientRecords: RoomSessionClient[] = records.map(this.#toClient);

		return clientRecords;
	}
}

const roomSessionNormalizer = new RoomSessionNormalizer();

export { RoomSessionNormalizer, roomSessionNormalizer };
