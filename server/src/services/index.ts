import pool from "../db/postgres/postgresDB";
import { SQLITE_DATABASE as db } from "../db/db";
import { QueryService, QueryServicePG } from "./QueryService";
import { MemberService } from "./MemberService";
import { RoomsService } from "./RoomsService";
import { SessionService } from "./SessionService";
import { UserService } from "./UserService";

interface IDALService {
	rooms: RoomsService;
	members: MemberService;
	sessions: SessionService;
	users?: UserService;
}
// Stand-alone DB query class
const queryService: QueryService = new QueryService(db);
const queryServicePG: QueryServicePG = new QueryServicePG(pool);
// Object service class(s)
const userService: UserService = new UserService(pool);
const roomService: RoomsService = new RoomsService(db);
const memberService: MemberService = new MemberService(db);
const sessionService: SessionService = new SessionService(db);

// const data = await userService.getByUsername("estengrove99@gmail.com");
// console.log("data", data);

const dalServices: IDALService = {
	rooms: roomService,
	members: memberService,
	sessions: sessionService,
	users: userService,
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
};
