import { useCallback, useEffect, useState } from "react";
import {
	AuthSession,
	clearAuthFromStorage,
	defaultAuth,
	getAuthFromStorage,
	processFreshAuth,
	setAuthToStorage,
} from "../utils/utils_auth";
import { useAppDispatch } from "../store/store";
import { diffInMins, isBeforeDate } from "../utils/utils_dates";
import { ILoginResp, refreshAuth } from "../utils/utils_users";
import { IRefreshLoginParams } from "../features/auth/operations";
import { setAuth } from "../features/auth/authSlice";

const THRESHOLD = 30; // mins

export interface HookArgs {
	onSuccess: (session: AuthSession) => void;
	onReject?: (session: AuthSession) => void;
}

export interface AuthSessionState extends AuthSession {
	isAuthenticated: boolean;
}

const defaultSession: AuthSessionState = {
	...defaultAuth,
	isAuthenticated: false,
};

const shouldRefresh = (authSession: AuthSessionState) => {
	const { sessionToken, sessionExpiry } = authSession;

	if (!sessionExpiry || !sessionToken) return true;

	const now: Date = new Date();
	// const isBeforeExpiry = isBeforeDate(now, sessionExpiry);
	const minsToExpiry: number = diffInMins(now, sessionExpiry);

	if (minsToExpiry <= 0) return true;

	return minsToExpiry <= THRESHOLD;
};

const useAuthSession = ({ onSuccess, onReject }: HookArgs) => {
	const dispatch = useAppDispatch();
	const authCache: AuthSession = getAuthFromStorage();
	const [authSession, setAuthSession] = useState<AuthSessionState>({
		...defaultSession,
		...authCache,
	});
	// check and refresh
	const checkAndRefreshAuth = useCallback(async () => {
		const { userID, sessionID, sessionExpiry, sessionToken } = authSession;
		const now: Date = new Date();
		const needsRefresh: boolean = shouldRefresh(authSession);
		const isExpired: boolean = isBeforeDate(now, sessionExpiry as string);

		// session doesn't exist, reject automatically
		if (!sessionExpiry || !sessionToken || isExpired) {
			clearAuthFromStorage();
			setAuthSession(defaultSession);
			return onReject && onReject(authSession);
		}

		if (needsRefresh) {
			const authParams = { userID, sessionID: Number(sessionID) };
			const authData = (await refreshAuth(
				authParams as IRefreshLoginParams
			)) as ILoginResp;

			if (authData instanceof Error) {
				return onReject && onReject(defaultSession);
			}

			const freshAuthCache: AuthSession = processFreshAuth(authData);

			// update states after refresh
			setAuthToStorage(freshAuthCache);
			dispatch(setAuth({ User: authData.User, Session: authData.Session }));
			return onSuccess && onSuccess(freshAuthCache);
		}

		// if doesn't need refresh, but is a valid session just update the states
		// dispatch();
	}, [authSession, dispatch, onSuccess, onReject]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (!authSession?.userID) return;

		checkAndRefreshAuth();

		return () => {
			isMounted = false;
		};
	}, [checkAndRefreshAuth, authSession]);

	return { authSession };
};

export { useAuthSession };
