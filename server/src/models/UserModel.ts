import { UserSvcResult } from "../services/UserService";

export interface IUserModel {
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

class UserModel {
	private _dbUser: UserSvcResult | null;
	private _clientUser: IUserModel | null;
	constructor(user: UserSvcResult) {
		this._dbUser = user;
		this._clientUser = {
			token: null,
			userID: user.user_id,
			memberID: user.member_id,
			username: user.username,
			displayName: user.display_name,
			password: user.password,
			isActive: user.is_active,
			createdDate: user.created_date,
			lastLoginDate: user.last_login_date,
		};
	}
	public getModelDB() {
		return this._dbUser;
	}
	public getModel() {
		return this._clientUser;
	}
	public model() {
		return this._clientUser;
	}
}

export { UserModel };
