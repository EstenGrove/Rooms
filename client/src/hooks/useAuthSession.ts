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

const THRESHOLD = 90; // mins

/**
 * AuthSession:
 * - userID: string | null;
 * - sessionID: number | null;
 * - sessionToken: string | null;
 * - sessionExpiry: string | null;
 * - lastRefreshed: string | null;
 */

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
	const userNotLoaded: boolean = !currentSession?.userID;
	const isExpired: boolean = isAfterDate(now, expiry);
	const isExpiring: boolean = diffInMins(now, expiry) <= THRESHOLD;

	// Conditions:
	// 1. Just logged in, should bail
	// 2. Page refresh: no session, possibly an authCache exists

	if (isExpired) return true;

	// if we have no user & no cache, we want to reject on response
	if (!isAuthed && !expiry) return true;
	// has cache & isn't expired
	if (!isAuthed && !isExpired) return true;
	// has cache & isn't expired
	if (userNotLoaded && !isExpired) return true;
	// has cache & isn't expired but IS expiring
	if (userNotLoaded && !isExpired && isExpiring) return true;

	// just logged in
	return false;
};

const isExpiredSession = (sessionExpiry: Date | string): boolean => {
	const now: Date = new Date();
	const isExpired: boolean = isAfterDate(now, sessionExpiry);

	return isExpired;
};

const useAuthSession = ({ onSuccess, onReject }: HookArgs) => {
	const dispatch = useAppDispatch();
	const authCache: AuthSession = getAuthFromStorage();
	const currentSession: CurrentSession = useSelector(selectCurrentSession);
	const needsRefresh: boolean = shouldRefresh(currentSession, authCache);
	const isExpired: boolean = isExpiredSession(
		currentSession?.expiry ?? authCache?.sessionExpiry
	);

	console.log("needsRefresh", needsRefresh);
	// refresh auth
	const refreshUserAuth = useCallback(async () => {
		if (isExpired) return onReject && onReject();
		if (!needsRefresh) return;

		const { sessionID, userID } = authCache;
		const authArgs = { userID, sessionID };
		const newAuth = (await refreshAuth(
			authArgs as IRefreshLoginParams
		)) as TResponse<ILoginResp>;
		const authData = newAuth?.Data as ILoginResp;

		// refresh succeeded
		if (authData?.Session && authData?.Session?.userLoginID) {
			const freshAuth: AuthSession = processFreshAuth(authData);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

export { useAuthSession };
