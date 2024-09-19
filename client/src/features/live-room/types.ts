export type TicketStatus = "active" | "waiting" | "reviewed";

export interface RoomTickets {
	active: Ticket | null;
	waiting: Ticket[];
	reviewed: Ticket[];
}

export interface Ticket {
	ticketID: number;
	ticketName: string;
	ticketDesc: string;
	ticketAlias: string;
	points: number;
	isActive: boolean;
	createdDate: string;
	wasReviewed: boolean;
}

// Details of a reviewed ticket
export interface TicketSummary {
	ticketSummaryID: number;
	ticketID: number;
	totalPoints: number;
	avgPoints: number;
	highestPoints: number;
	lowestPoints: number;
	isActive: boolean;
	createdDate: string;
}

export interface TicketVote {
	voteID: number;
	ticketID: number;
	memberID: number;
	points: number;
	createdDate: string;
}

// Points card for estimations
export interface PointsCard {
	cardID: number;
	cardPoints: number;
	cardName: string;
}
