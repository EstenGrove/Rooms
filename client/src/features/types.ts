import { RoomMember } from "./members/types";
import { CurrentRoom, Room } from "./rooms/types";
import { RoomSession } from "./sessions/types";

export type TStatus = "IDLE" | "PENDING" | "FULFILLED" | "REJECTED";

export interface LiveRoomData {
	Member: RoomMember;
	Members: RoomMember[];
	Room: CurrentRoom | Room;
	Session: RoomSession;
}
