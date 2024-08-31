import { SQLITE_DATABASE as db } from "../db/db";

/**
 * "Create" Table queries
 */

const DROP_QUERY = `DROP rooms`;
const MEMBERS_QUERY = `CREATE TABLE IF NOT EXISTS members (
  member_id INTEGER PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(room_id),
  member_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_alive BOOLEAN,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_alive_date TIMESTAMP
)`;
const ROOMS_QUERY = `CREATE TABLE IF NOT EXISTS rooms (
  room_id INTEGER PRIMARY KEY,
  room_name TEXT NOT NULL,
  room_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_alive BOOLEAN,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_alive_date TIMESTAMP
  )`;
const SESSIONS_QUERY = `CREATE TABLE IF NOT EXISTS sessions (
  session_id INTEGER PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(room_id),
  members JSON,
  is_active BOOLEAN DEFAULT TRUE,
  is_alive BOOLEAN,
  session_start_date TIMESTAMP,
  session_end_date TIMESTAMP,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_alive_date TIMESTAMP
)`;
const USERS_QUERY = `CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  member_id INTEGER REFERENCES members(member_id),
  username TEXT,
  password TEXT,
  display_name TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
)`;

/**
 * To setup tables, for a fresh install:
 * - Add the '.ts' extension to the imported db file like so: import { SQLITE_DATABASE as db } from "../db/db.ts"
 * - Then run: node --experimental-strip-types src/setup/data.ts
 * - Then change the remove the '.ts' extension & start the project via: 'npm run dev'
 */
const setupDatabase = async (dropDB: boolean = false) => {
	try {
		if (dropDB) {
			await db.run(DROP_QUERY);
		}
		await db.run(ROOMS_QUERY);
		await db.run(MEMBERS_QUERY);
		await db.run(SESSIONS_QUERY);
		await db.run(USERS_QUERY);
		return true;
	} catch (error) {
		console.log("Whoops:", error);
		throw error;
	}
};

// node --experimental-strip-types src/setup/data.ts
// setupDatabase(false).then((isDone) => {
// 	console.log("Tables created!", isDone);
// });
