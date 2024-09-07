export interface RoomDB {
	room_id: number;
	room_name: string;
	room_code: string; // guid
	is_active: boolean;
	is_alive: boolean;
	created_date: string;
	last_alive_date: string | null;
}

export interface RoomClient {
	roomID: number;
	roomName: string;
	roomCode: string;
	isActive: boolean;
	isAlive: boolean;
	createdDate: string;
	lastAliveDate: string | null;
}

class RoomNormalizer {
	#toDB(record: RoomClient): RoomDB {
		const dbRecord: RoomDB = {
			room_id: record.roomID,
			room_name: record.roomName,
			room_code: record.roomCode,
			is_active: record.isActive,
			is_alive: record.isAlive,
			created_date: record.createdDate,
			last_alive_date: record.lastAliveDate,
		};
		return dbRecord;
	}
	#toClient(record: RoomDB): RoomClient {
		const clientRecord: RoomClient = {
			roomID: record.room_id,
			roomName: record.room_name,
			roomCode: record.room_code,
			isActive: record.is_active,
			isAlive: record.is_alive,
			createdDate: record.created_date,
			lastAliveDate: record.last_alive_date,
		};
		return clientRecord;
	}

	public toDBOne(record: RoomClient): RoomDB {
		return this.#toDB(record);
	}
	public toClientOne(record: RoomDB): RoomClient {
		return this.#toClient(record);
	}

	public toDB(records: RoomClient[]): RoomDB[] {
		const dbRecords: RoomDB[] = records.map(this.#toDB);

		return dbRecords;
	}
	public toClient(records: RoomDB[]): RoomClient[] {
		const clientRecords: RoomClient[] = records.map(this.#toClient);

		return clientRecords;
	}
}

const roomNormalizer = new RoomNormalizer();

export { RoomNormalizer, roomNormalizer };
