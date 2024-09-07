// Database format
export interface UserDB {
	user_id: string;
	member_id: number;
	username: string;
	password: string;
	display_name: string | null;
	is_active: boolean;
	created_date: string;
	last_login_date: string;
}

// Client-side format
export interface UserClient {
	userID: string;
	memberID: number;
	username: string;
	password: string;
	displayName: string | null;
	token: string | null;
	lastLoginDate: string;
	createdDate: string;
	isActive: boolean;
}

class UserNormalizer {
	#toDB(record: UserClient): UserDB {
		const dbRecord: UserDB = {
			user_id: record.userID,
			member_id: record.memberID,
			username: record.username,
			password: record.password,
			display_name: record.displayName,
			is_active: record.isActive,
			created_date: record.createdDate,
			last_login_date: record.lastLoginDate,
		};
		return dbRecord;
	}
	#toClient(record: UserDB): UserClient {
		const clientRecord: UserClient = {
			token: null,
			userID: record.user_id,
			memberID: record.member_id,
			username: record.username,
			password: record.password,
			displayName: record.display_name,
			isActive: record.is_active,
			createdDate: record.created_date,
			lastLoginDate: record.last_login_date,
		};
		return clientRecord;
	}

	public toDBOne(record: UserClient): UserDB {
		return this.#toDB(record);
	}
	public toClientOne(record: UserDB): UserClient {
		return this.#toClient(record);
	}

	public toDB(records: UserClient[]): UserDB[] {
		// iterate thru records & convert/normalize to database format
		if (!records || !records.length) return [];

		const dbRecords: UserDB[] = records.map(this.#toDB);

		return dbRecords;
	}

	public toClient(records: UserDB[]): UserClient[] {
		// iterate thru records & convert/normalize to database format
		if (!records || !records.length) return [];

		const dbRecords: UserClient[] = records.map(this.#toClient);

		return dbRecords;
	}
}

const userNormalizer = new UserNormalizer();

export { UserNormalizer, userNormalizer };
