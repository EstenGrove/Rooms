export interface CurrentUser {
	username: string;
	password: string;
	displayName: string;
	token: string;
	loginDate: string;
}

export interface CurrentSession {
	token: string;
	lastRefreshed: string;
	isAuthenticated: boolean;
}
