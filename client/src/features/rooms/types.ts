import { RoomMember } from "../members/types";
import { RoomSession } from "../sessions/types";

export interface Room {
	roomID: number;
	roomCode: string;
	roomName: string;
	lastAliveDate: string;
	createdDate: string;
	isActive: boolean;
	isAlive: boolean;
}

export interface CurrentRoom {
	room: Room | null;
	members: RoomMember[];
	session: RoomSession | null;
}
