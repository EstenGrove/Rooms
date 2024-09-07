import pool from "../db/postgres/postgresDB";
import { SQLITE_DATABASE as db } from "../db/db";
import { QueryService, QueryServicePG } from "./QueryService";
import { MemberService } from "./MemberService";
import { RoomsService } from "./RoomsService";
import { SessionService } from "./SessionService";
import { UserService } from "./UserService";
import { UserLoginService } from "./UserLoginService";

interface IDALService {
	rooms: RoomsService;
	members: MemberService;
	sessions: SessionService;
	users?: UserService;
	logins?: UserLoginService;
}
// Stand-alone DB query class
const queryService: QueryService = new QueryService(db);
const queryServicePG: QueryServicePG = new QueryServicePG(pool);
// Object service class(s)
const userService: UserService = new UserService(pool);
const roomService: RoomsService = new RoomsService(pool); // MIGRATE TO PG
const memberService: MemberService = new MemberService(pool);
const sessionService: SessionService = new SessionService(pool); // MIGRATE TO PG
const userLoginService: UserLoginService = new UserLoginService(pool);

// const data = await userService.getByUsername("estengrove99@gmail.com");
// console.log("data", data);

const dalServices: IDALService = {
	rooms: roomService,
	members: memberService,
	sessions: sessionService,
	users: userService,
	logins: userLoginService,
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
	userLoginService,
};
