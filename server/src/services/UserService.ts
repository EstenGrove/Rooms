import { Pool, QueryResult, QueryResultRow } from "pg";
import PostgresDB from "../db/postgres/postgresDB";
import {
	InvalidCredsError,
	isError,
	UserNotFoundError,
} from "../utils/utils_errors";

// Table: 'users'
export interface UserSvcResult {
	user_id: string;
	member_id: number;
	username: string;
	password: string;
	display_name: string | null;
	is_active: boolean;
	created_date: string;
	last_login_date: string;
}
// Table: 'user_logins'
export interface UserLoginSvcResult {
	user_login_id: number;
	user_id: string;
	security_token: string | null;
	is_active: boolean;
	login_date: string;
	logout_date: string | null;
}
// Combined data including 'users' record, 'user_logins' record & any possible errors as a string
export interface UserLoginResponse {
	user: UserSvcResult | null;
	login: UserLoginSvcResult | null;
}

export interface UserDetails {
	User: UserSvcResult;
	Session: UserLoginSvcResult;
}

class UserService {
	#db: Pool;

	constructor(db: Pool) {
		this.#db = db;
	}

	async getByID(userID: string, isActive: boolean = true) {
		try {
			const query: string = `SELECT * FROM users WHERE is_active = $1 AND user_id = $2`;
			const resp = await this.#db.query(query, [isActive, userID]);
			return resp;
		} catch (error) {
			console.log("error", error);
			return error;
		}
	}
	async getByUsername(
		username: string,
		isActive: boolean = true
	): Promise<UserSvcResult | unknown> {
		try {
			const query: string = `SELECT * FROM users WHERE is_active = $1 AND username = $2`;
			const results = (await this.#db.query(query, [
				isActive,
				username,
			])) as QueryResult;
			const row = results?.rows?.[0] as UserSvcResult | undefined;
			return row as UserSvcResult;
		} catch (error) {
			console.log("error", error);
			return error;
		}
	}
	// NOTE: creating a user will auto-insert a user_logins row afterwards!!!
	async create(
		username: string,
		password: string
	): Promise<QueryResultRow[] | unknown> {
		try {
			const query = `INSERT INTO users (username, password) VALUES ($1, $2)`;
			const results = await this.#db.query(query, [username, password]);
			const rows = results.rows as QueryResultRow[];
			return rows;
		} catch (error: unknown) {
			return error;
		}
	}
	async authenticate(
		userID: string,
		token: string | null = null
	): Promise<UserLoginSvcResult | unknown> {
		try {
			const query = `INSERT INTO user_logins (user_id, security_token) VALUES ($1, $2) RETURNING *`;
			const results = (await this.#db.query(query, [
				userID,
				token,
			])) as QueryResult;
			const row = results.rows?.[0] as UserLoginSvcResult;
			return row;
		} catch (error: unknown) {
			return error;
		}
	}
	async deauthenticate(userID: string): Promise<UserLoginSvcResult | unknown> {
		try {
			const query = `UPDATE user_logins SET is_active = false, logout_date = CURRENT_TIMESTAMP WHERE user_id = ? AND is_active = true RETURNING *`;
			const results = (await this.#db.query(query, [userID])) as QueryResult;
			const row = results.rows?.[0] as UserLoginSvcResult;
			return row;
		} catch (error: unknown) {
			return error;
		}
	}
	async reactivate(userID: string): Promise<UserSvcResult | unknown> {
		try {
			const query = `UPDATE users SET is_active = true WHERE user_id = $1 RETURNING *`;
			const updatedUser = (await this.#db.query(query, [
				userID,
			])) as QueryResult;
			const row = updatedUser?.rows?.[0] as UserSvcResult;
			return row;
		} catch (error) {
			return error;
		}
	}
	async deactivate(userID: string): Promise<UserSvcResult | unknown> {
		try {
			const query = `UPDATE users SET is_active = false WHERE user_id = $1 RETURNING *`;
			const updatedUser = (await this.#db.query(query, [
				userID,
			])) as QueryResult;
			const row = updatedUser?.rows?.[0] as UserSvcResult;
			return row;
		} catch (error) {
			return error;
		}
	}
	// NOTE: When a 'user_logins' record is inserted a trigger will update the 'users.last_login_date' field automatically
	async login(
		username: string,
		password: string
	): Promise<UserLoginResponse | Error> {
		try {
			const existingUser = (await this.getByUsername(
				username
			)) as UserSvcResult;
			const hasValidCreds: boolean = this.#isValidAuth(
				username,
				password,
				existingUser
			);

			// ##TODOS
			// - REMOVE THESE 'throw new XXXX()' CUZ IT'S SHIT!!!
			// user doesn't exist
			if (!existingUser) {
				throw new UserNotFoundError() as Error;
			}

			// invalid credentials
			if (!hasValidCreds) {
				throw new InvalidCredsError();
			}

			// user exists & has valid credentials, create a user_login record
			const loginRecord = (await this.authenticate(
				existingUser.user_id,
				null
			)) as UserLoginSvcResult;

			return {
				user: existingUser,
				login: loginRecord,
			};
		} catch (error: unknown) {
			return error as Error;
		}
	}

	async logout(userID: string): Promise<UserLoginSvcResult | unknown> {
		try {
			const row = (await this.deauthenticate(userID)) as UserLoginSvcResult;
			return row as UserLoginSvcResult;
		} catch (error) {
			return error;
		}
	}

	// Check user's credentials
	#isValidAuth(
		username: string,
		password: string,
		userRecord: UserSvcResult
	): boolean {
		if (!username || !password) return false;
		if (!userRecord?.username || !userRecord?.password) return false;

		const validUser: boolean = username === userRecord.username;
		const validPwd: boolean = password === userRecord.password;
		const isValid: boolean = validUser && validPwd;
		return isValid;
	}
}

export { UserService };
