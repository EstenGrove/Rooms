import { Pool, QueryResult } from "pg";
import { UserLoginSvcResult } from "./UserService";

class UserLoginService {
	#db: Pool;

	constructor(db: Pool) {
		this.#db = db;
	}

	async getByID(loginID: number): Promise<UserLoginSvcResult | unknown> {
		try {
			const query = `
        SELECT * FROM user_logins 
        WHERE user_login_id = $1`;
			const results = (await this.#db.query(query, [loginID])) as QueryResult;
			const row = results?.rows?.[0] as UserLoginSvcResult;

			return row as UserLoginSvcResult;
		} catch (error) {
			return error;
		}
	}
	async getByUserID(
		userID: string,
		isActive: boolean = true
	): Promise<UserLoginSvcResult | unknown> {
		try {
			const query = `
        SELECT * FROM user_logins 
        WHERE user_id = $1 and is_active = $2`;
			const results = (await this.#db.query(query, [
				userID,
				isActive,
			])) as QueryResult;
			const row = results?.rows?.[0] as UserLoginSvcResult;

			return row as UserLoginSvcResult;
		} catch (error) {
			return error;
		}
	}
	async getByLoginDate(
		loginDate: string
	): Promise<UserLoginSvcResult[] | unknown> {
		try {
			const query = `
        SELECT * FROM user_logins
        WHERE login_date::date = date $1 
      `;
			const results = (await this.#db.query(query, [loginDate])) as QueryResult;
			const rows = results?.rows as UserLoginSvcResult[];
			return rows;
		} catch (error) {
			return error;
		}
	}
	async getByLogoutDate(
		loginDate: string
	): Promise<UserLoginSvcResult[] | unknown> {
		try {
			const query = `
        SELECT * FROM user_logins
        WHERE logout_date::date = date $1 
      `;
			const results = (await this.#db.query(query, [loginDate])) as QueryResult;
			const rows = results?.rows as UserLoginSvcResult[];
			return rows;
		} catch (error) {
			return error;
		}
	}
}

export { UserLoginService };
