export interface IEndpoints {
	rooms: {
		create: string;
		join: string;
		leave: string;
	};
	members: {
		create: string;
	};
	users: {
		create: string;
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
		leave: "/rooms/leaveRoom",
	},
	members: {
		create: "/members/createMember",
	},
	users: {
		create: "/users/createAccount",
	},
};

const CURRENT_ENV_NAME = "local";
const CURRENT_ENV_AUTH = API_AUTH[CURRENT_ENV_NAME];

export {
	BASE_URL,
	API_ENDPOINTS,
	CURRENT_ENV_AUTH as currentEnv,
	CURRENT_ENV_NAME as currentEnvName,
};
