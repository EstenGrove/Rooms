import { useCallback, useEffect } from "react";
import {
	AuthSession,
	clearAuthFromStorage,
	getAuthFromStorage,
	processFreshAuth,
	setAuthToStorage,
} from "../utils/utils_auth";
import { useAppDispatch } from "../store/store";
import { diffInMins, isAfterDate } from "../utils/utils_dates";
import { ILoginResp, refreshAuth } from "../utils/utils_users";
import { IRefreshLoginParams } from "../features/auth/operations";
import { selectCurrentSession, setAuth } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { CurrentSession } from "../features/auth/types";
import { TResponse } from "../utils/utils_http";

const THRESHOLD = 30; // mins

export interface AuthSessionData {
	expiry: string | null;
	userID: string | null;
	sessionID: string | null;
	lastRefreshed: string | null;
}

export interface HookArgs {
	onSuccess: (session: AuthSession) => void;
	onReject?: () => void;
}

const shouldRefresh = (
	currentSession: CurrentSession,
	authCache: AuthSession
) => {
	const now: Date = new Date();
	const expiry = authCache?.sessionExpiry as string;
	const isAuthed: boolean =
		currentSession && "isAuthenticated" in currentSession;
	const isExpired: boolean = isAfterDate(now, expiry);
	const isExpiring: boolean = diffInMins(now, expiry) <= THRESHOLD;
	const isValidSession: boolean = isAuthed && !isExpiring;

	// Conditions:
	// 1. Just logged in, should bail
	// 2. Page refresh: no session, possibly an authCache exists

	// just logged in
	if (isValidSession || isExpired) return false;

	// page refresh
	if (!isAuthed && !currentSession?.userID) return true;
	if (isExpiring && !isAuthed) return true;

	return false;
};

const useAuthSession = ({ onSuccess, onReject }: HookArgs) => {
	const dispatch = useAppDispatch();
	const authCache: AuthSession = getAuthFromStorage();
	const currentSession: CurrentSession = useSelector(selectCurrentSession);
	const needsRefresh: boolean = shouldRefresh(currentSession, authCache);

	console.log("needsRefresh", needsRefresh);
	// refresh auth
	const refreshUserAuth = useCallback(async () => {
		if (!needsRefresh) return;

		const { sessionID, userID } = authCache;
		const authArgs = { userID, sessionID };
		const newAuth = (await refreshAuth(
			authArgs as IRefreshLoginParams
		)) as TResponse<ILoginResp>;
		const authData = newAuth?.Data as ILoginResp;
		const freshAuth: AuthSession = processFreshAuth(authData);

		// refresh succeeded
		if (authData?.Session && authData?.Session?.userLoginID) {
			setAuthToStorage(freshAuth);
			dispatch(setAuth({ user: authData.User, session: authData.Session }));
			return onSuccess && onSuccess(freshAuth);
		} else {
			// refresh failed
			clearAuthFromStorage();
			return onReject && onReject();
		}
	}, [authCache, dispatch, needsRefresh, onReject, onSuccess]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		refreshUserAuth();

		return () => {
			isMounted = false;
		};
	}, [refreshUserAuth]);
};

export { useAuthSession };
