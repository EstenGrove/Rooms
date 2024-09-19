import pool from "../db/postgres/postgresDB";
import { SQLITE_DATABASE as db } from "../db/db";
import { QueryService, QueryServicePG } from "./QueryService";
import { MemberService } from "./MemberService";
import { RoomsService } from "./RoomsService";
import { SessionService } from "./SessionService";
import { UserService } from "./UserService";
import { UserLoginService } from "./UserLoginService";
import { LiveRoomService } from "./LiveRoomService";
import { CardsService } from "./CardsService";

interface IDALService {
	rooms: RoomsService;
	members: MemberService;
	sessions: SessionService;
	liveRoom?: LiveRoomService;
	users?: UserService;
	logins?: UserLoginService;
	cards?: CardsService;
}
// Stand-alone DB query class
const queryService: QueryService = new QueryService(db);
const queryServicePG: QueryServicePG = new QueryServicePG(pool);
// Object service class(s)
const userService: UserService = new UserService(pool);
const roomService: RoomsService = new RoomsService(pool);
const memberService: MemberService = new MemberService(pool);
const sessionService: SessionService = new SessionService(pool);
const liveRoomService: LiveRoomService = new LiveRoomService(pool);
const userLoginService: UserLoginService = new UserLoginService(pool);
const voteCardsService: CardsService = new CardsService(pool);

const dalServices: IDALService = {
	rooms: roomService,
	members: memberService,
	sessions: sessionService,
	users: userService,
	logins: userLoginService,
	liveRoom: liveRoomService,
	cards: voteCardsService,
};

export {
	// grouped services
	dalServices,
	queryService,
	queryServicePG,
	// stand-alone services
	userService,
	roomService,
	memberService,
	sessionService,
	liveRoomService,
	userLoginService,
	voteCardsService,
};
