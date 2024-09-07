export interface MemberDB {
	room_id: number;
	member_id: number;
	member_name: string;
	is_active: boolean;
	is_alive: boolean;
	created_date: string;
	last_alive_date: string | null;
}

export interface MemberClient {
	memberID: number;
	roomID: number;
	memberName: string;
	isActive: boolean;
	isAlive: boolean;
	createdDate: string;
	lastAliveDate: string | null;
}

class MemberNormalizer {
	#toDB(record: MemberClient): MemberDB {
		const dbRecord: MemberDB = {
			room_id: record.roomID,
			member_id: record.memberID,
			member_name: record.memberName,
			is_active: record.isActive,
			is_alive: record.isAlive,
			created_date: record.createdDate,
			last_alive_date: record.lastAliveDate,
		};
		return dbRecord;
	}
	#toClient(record: MemberDB): MemberClient {
		console.log("record", record);
		const clientRecord: MemberClient = {
			roomID: record.room_id,
			memberID: record.member_id,
			memberName: record.member_name,
			isActive: record.is_active,
			isAlive: record.is_alive,
			createdDate: record.created_date,
			lastAliveDate: record.last_alive_date,
		};
		return clientRecord;
	}

	public toDBOne(record: MemberClient): MemberDB {
		return this.#toDB(record);
	}
	public toClientOne(record: MemberDB): MemberClient {
		return this.#toClient(record);
	}

	public toDB(records: MemberClient[]): MemberDB[] {
		// iterate thru records & convert/normalize to database format
		if (!records || !records.length) return [];

		const dbRecords: MemberDB[] = records.map(this.#toDB);

		return dbRecords;
	}

	public toClient(records: MemberDB[]): MemberClient[] {
		// iterate thru records & convert/normalize to database format
		if (!records || !records.length) return [];

		const dbRecords: MemberClient[] = records.map(this.#toClient);

		return dbRecords;
	}
}

const memberNormalizer = new MemberNormalizer();

export { MemberNormalizer, memberNormalizer };
