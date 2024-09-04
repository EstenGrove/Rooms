// Table: 'user_logins'
export interface UserLoginDB {
	user_login_id: number;
	user_id: string;
	security_token: string | null;
	is_active: boolean;
	login_date: string;
	logout_date: string | null;
}
// Client-side format
export interface UserLoginClient {
	userLoginID: number;
	userID: string;
	token: string | null;
	isActive: boolean;
	loginDate: string;
	logoutDate: string | null;
}

class UserLoginNormalizer {
	#toDB(record: UserLoginClient): UserLoginDB {
		const dbRecord: UserLoginDB = {
			user_login_id: record.userLoginID,
			user_id: record.userID,
			security_token: record.token,
			is_active: record.isActive,
			login_date: record.loginDate,
			logout_date: record.logoutDate,
		};

		return dbRecord;
	}

	#toClient(record: UserLoginDB): UserLoginClient {
		const clientRecord: UserLoginClient = {
			userLoginID: record.user_login_id,
			userID: record.user_id,
			token: record.security_token,
			isActive: record.is_active,
			loginDate: record.login_date,
			logoutDate: record.logout_date,
		};

		return clientRecord;
	}

	// performs just a single conversion: to DB-format
	public toDBOne(record: UserLoginClient): UserLoginDB {
		return this.#toDB(record);
	}
	// performs just a single conversion: to Client-side
	public toClientOne(record: UserLoginDB): UserLoginClient {
		return this.#toClient(record);
	}

	public toDB(records: UserLoginClient[]): UserLoginDB[] {
		const dbRecords: UserLoginDB[] = records.map(this.#toDB);

		return dbRecords;
	}
	public toClient(records: UserLoginDB[]): UserLoginClient[] {
		const clientRecords: UserLoginClient[] = records.map(this.#toClient);

		return clientRecords;
	}
}

const userLoginNormalizer = new UserLoginNormalizer();

export { UserLoginNormalizer, userLoginNormalizer };
