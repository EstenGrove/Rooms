export interface IEndpoints {
	rooms: {
		create: string;
		join: string;
		joinAsGuest: string;
		joinAsNewGuest: string;
		leave: string;
		getLiveRoom: string;
		getRooms: string;
		deleteRoom: string;
	};
	members: {
		create: string;
	};
	users: {
		login: string;
		logout: string;
		signup: string;
		refresh: string;
		getUser: string;
	};
}

const BASE_URL: string = import.meta.env.VITE_API_BASE;

const API_AUTH = {
	development: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
	},
	production: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
	},
	testing: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
	},
	local: {
		assets: import.meta.env.VITE_APP_ASSETS_URL,
		base: import.meta.env.VITE_API_BASE,
		user: import.meta.env.VITE_API_USER,
		password: import.meta.env.VITE_API_USER_PASSWORD,
	},
};

const API_ENDPOINTS: IEndpoints = {
	rooms: {
		create: "/rooms/createRoom",
		join: "/rooms/joinRoom",
		joinAsGuest: "/rooms/joinRoomAsGuest/",
		joinAsNewGuest: "/rooms/joinRoomAsNewGuest/",
		leave: "/rooms/leaveRoom",
		getLiveRoom: "/rooms/liveRoom",
		getRooms: "/rooms/getRooms",
		deleteRoom: "/rooms/deleteRoom",
	},
	members: {
		create: "/members/createMember",
	},
	users: {
		login: "/users/login",
		logout: "/users/logout",
		signup: "/users/signup",
		refresh: "/users/refresh",
		getUser: "/users/getUser",
	},
};

const CURRENT_ENV_NAME = "local";
const CURRENT_ENV_AUTH = API_AUTH[CURRENT_ENV_NAME];

// Endpoint groups
const {
	users: usersEndpoints,
	rooms: roomsEndpoints,
	members: membersEndpoints,
} = API_ENDPOINTS;

export {
	BASE_URL,
	API_ENDPOINTS,
	CURRENT_ENV_AUTH as currentEnv,
	CURRENT_ENV_NAME as currentEnvName,
	// API ENDPOINT GROUPS
	roomsEndpoints,
	membersEndpoints,
	usersEndpoints,
};
