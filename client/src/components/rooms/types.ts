import { RoomMember } from "../../features/members/types";

export interface RoomValues {
	roomName: string;
	memberName: string;
	startRoom: boolean;
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
	members: Array<RoomMember>;
}

export interface JoinValues {
	displayName: string;
	roomCode: string;
}
