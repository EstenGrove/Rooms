export interface RoomSession {
	sessionID: number;
	roomID: number;
	memberIDs: number;
	isActive: boolean;
	isAlive: boolean;
	sessionStartDate: string | null;
	sessionEndDate: string | null;
	createdDate: string;
	lastAliveDate: string | null;
}
