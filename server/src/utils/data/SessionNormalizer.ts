export interface SessionDB {
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

export interface SessionClient {
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

class SessionNormalizer {
	#toDB(record: SessionClient): SessionDB {
		const dbRecord: SessionDB = {
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
	#toClient(record: SessionDB): SessionClient {
		const clientRecord: SessionClient = {
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

	public toDBOne(record: SessionClient): SessionDB {
		return this.#toDB(record);
	}
	public toClientOne(record: SessionDB): SessionClient {
		return this.#toClient(record);
	}

	public toDB(records: SessionClient[]): SessionDB[] {
		if (!records || !records.length) return [];

		const dbRecords: SessionDB[] = records.map(this.#toDB);

		return dbRecords;
	}
	public toClient(records: SessionDB[]): SessionClient[] {
		if (!records || !records.length) return [];

		const clientRecords: SessionClient[] = records.map(this.#toClient);

		return clientRecords;
	}
}

const sessionNormalizer = new SessionNormalizer();

export { SessionNormalizer, sessionNormalizer };
