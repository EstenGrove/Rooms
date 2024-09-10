export interface CurrentUser {
	token: string | null;
	userID: string;
	memberID: number;
	username: string;
	password: string;
	displayName: string | null;
	isActive: boolean;
	loginDate: string;
	lastLoginDate: string;
	createdDate: string;
}

export interface CurrentSession {
	token: string;
	userID: string;
	userLoginID: number;
	expiry: string;
	lastRefreshedDate: string;
	isAuthenticated: boolean;
}
