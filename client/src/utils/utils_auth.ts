import {
	getFromLocalStorage,
	removeFromLocalStorage,
	saveToLocalStorage,
} from "./utils_storage";
import { ILoginResp } from "./utils_users";

export interface AuthSession {
	userID: string | null;
	sessionID: number | null;
	sessionToken: string | null;
	sessionExpiry: string | null;
	lastRefreshed: string | null;
}

const defaultAuth: AuthSession = {
	userID: null,
	sessionID: null,
	sessionToken: null,
	sessionExpiry: null,
	lastRefreshed: null,
};

const getAuthFromStorage = (key: string = "iauth"): AuthSession => {
	const authCache = getFromLocalStorage<AuthSession>(key);

	if (authCache) {
		return authCache as AuthSession;
	} else {
		return defaultAuth as AuthSession;
	}
};

const setAuthToStorage = (userAuth: AuthSession) => {
	const key: string = "iauth";
	saveToLocalStorage(key, userAuth);
};

const clearAuthFromStorage = (key: string = "iauth") => {
	removeFromLocalStorage(key);
};

const processFreshAuth = (authData: ILoginResp): AuthSession => {
	const { User, Session } = authData;

	const freshAuth: AuthSession = {
		userID: User.userID,
		sessionToken: Session.token,
		sessionID: Session.sessionID,
		sessionExpiry: Session.sessionExpiry,
		lastRefreshed: Session.lastRefreshed,
	};

	return freshAuth;
};

export {
	defaultAuth,
	getAuthFromStorage,
	setAuthToStorage,
	clearAuthFromStorage,
	processFreshAuth,
};
