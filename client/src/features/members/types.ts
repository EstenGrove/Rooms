export interface RoomMember {
	memberID: number;
	memberName: string;
	membershipType: MembershipType | null;
	isActive: boolean;
	isAlive: boolean;
	createdDate: string;
	lastAliveDate: string | null;
}

export interface CurrentMember {
	memberID: number;
	memberName: string;
	isActive: boolean;
	isAlive: boolean;
	createdDate: string;
	lastAliveDate: string | null;
}

export type MembershipType = "guest" | "registered" | "paid";
