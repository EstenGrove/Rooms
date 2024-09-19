import { Pool, Query, QueryResult, QueryResultRow } from "pg";
import PostgresDB from "../db/postgres/postgresDB";

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
	last_refreshed_date: string | null;
	expiry: string;
}
// Combined data including 'users' record, 'user_logins' record & any possible errors as a string
export interface UserLoginResponse {
	user: UserSvcResult | null;
	login: UserLoginSvcResult | null;
	error?: string | Error;
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

	async getByID(
		userID: string,
		isActive: boolean = true
	): Promise<UserSvcResult | unknown> {
		try {
			const query: string = `SELECT * FROM users WHERE user_id = $1 AND  is_active = $2`;
			const resp = (await this.#db.query(query, [
				userID,
				isActive,
			])) as QueryResult;
			const row = resp?.rows?.[0] as UserSvcResult;
			return row;
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
	async signup(
		username: string,
		password: string,
		displayName: string,
		isAlive: boolean = false
	): Promise<UserSvcResult | unknown> {
		try {
			const query = `SELECT * FROM user_signup($1, $2, $3, $4)`;
			const results = (await this.#db.query(query, [
				username,
				password,
				displayName,
				isAlive,
			])) as QueryResult;
			const newUser = results?.rows?.[0] as UserSvcResult;
			return newUser;
		} catch (error) {
			return error;
		}
	}
	// NOTE: creating a user will auto-insert a user_logins row afterwards!!!
	// - We're also setting the 'display_name' to the username temporarily.
	async create(
		username: string,
		password: string
	): Promise<QueryResultRow[] | unknown> {
		try {
			const query = `
				INSERT INTO users (username, password, display_name)
				VALUES ($1, $2, $3) RETURNING *`;
			const results = await this.#db.query(query, [
				username,
				password,
				username,
			]);
			const rows = results.rows as QueryResultRow[];
			return rows;
		} catch (error: unknown) {
			return error;
		}
	}
	async refreshAuth(
		userID: string,
		token: string | null = null
	): Promise<UserLoginSvcResult | unknown> {
		try {
			const query = `
				INSERT INTO user_logins (user_id, security_token)
				VALUES ($1, $2)
				RETURNING *;
			`;
			const results = await this.#db.query(query, [userID, token]);
			const row = results?.rows?.[0] as UserLoginSvcResult;
			return row;
		} catch (error) {
			return error;
		}
	}
	async authenticate(
		userID: string,
		token: string | null = null
	): Promise<UserLoginSvcResult | unknown> {
		try {
			const query = `
				INSERT INTO user_logins (user_id, security_token)
				VALUES ($1, $2) RETURNING *`;
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
			const query = `
				UPDATE user_logins
					SET is_active = false, logout_date = CURRENT_TIMESTAMP
				WHERE user_id = $1 AND is_active = true
					RETURNING *`;
			const results = (await this.#db.query(query, [userID])) as QueryResult;
			const row = results.rows?.[0] as UserLoginSvcResult;
			return row as UserLoginSvcResult;
		} catch (error: unknown) {
			return error;
		}
	}
	async reactivate(userID: string): Promise<UserSvcResult | unknown> {
		try {
			const query = `
				UPDATE users 
					SET is_active = true
				WHERE user_id = $1
					RETURNING *`;
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

			// user doesn't exist
			if (!existingUser) {
				return {
					user: null,
					login: null,
					error: new Error("Account not found"),
					// error: "Account not found",
				};
			}

			// invalid credentials
			if (!hasValidCreds) {
				return {
					user: null,
					login: null,
					error: new Error("Incorrect login info."),
					// error: "Incorrect login info.",
				};
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
		} catch (error) {
			const err = error as Error;
			return {
				user: null,
				login: null,
				error: err,
			};
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
