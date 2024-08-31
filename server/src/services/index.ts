import { SQLITE_DATABASE as db } from "../db/db";
import { MemberService } from "./MemberService";
import { RoomsService } from "./RoomsService";
import { SessionService } from "./SessionService";
import { QueryService } from "./QueryService";

interface IDALService {
	rooms: RoomsService;
	members: MemberService;
	sessions: SessionService;
}
// Stand-alone DB query class
const queryService: QueryService = new QueryService(db);
// Object service class(s)
const roomService: RoomsService = new RoomsService(db);
const memberService: MemberService = new MemberService(db);
const sessionService: SessionService = new SessionService(db);

const dalServices: IDALService = {
	rooms: roomService,
	members: memberService,
	sessions: sessionService,
};

export {
	// grouped services
	dalServices,
	queryService,
	// stand-alone services
	roomService,
	memberService,
	sessionService,
};
