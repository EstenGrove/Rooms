export interface RoomValues {
	roomName: string;
	memberName: string;
}

export interface RoomInfoMember {
	memberName: string;
	memberID: number;
}

export interface RoomInfo {
	roomID: number;
	roomCode: string;
	roomName: string;
	lastAliveDate: string;
	createdDate: string;
	isActive: boolean;
	isAlive: boolean;
	members: Array<RoomInfoMember>;
}

export interface JoinValues {
	displayName: string;
	roomCode: string;
}
