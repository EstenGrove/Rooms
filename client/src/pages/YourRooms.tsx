import styles from "../css/pages/YourRooms.module.scss";
import RoomCard from "../components/rooms/RoomCard";
import { RoomInfo } from "../components/rooms/types";
import CreateRoomCard from "../components/rooms/CreateRoomCard";

const createDate = (start: Date, end: Date): Date => {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
};

const createFakeObj = (id: number): RoomInfo => {
	const randomDate = createDate(new Date(2023, 3, 16), new Date());
	const createdDate = createDate(new Date(2019, 1, 1), new Date());
	return {
		roomID: id,
		roomCode: crypto.randomUUID(),
		roomName: "ENG-1 Room",
		lastAliveDate: randomDate.toUTCString(),
		createdDate: createdDate.toUTCString(),
		isActive: true,
		isAlive: id % 2 === 0,
		members: [
			{ memberID: 1, memberName: "Steven G." },
			{ memberID: 2, memberName: "Jessica" },
			{ memberID: 3, memberName: "Theresa L." },
			{ memberID: 4, memberName: "Sanjay R." },
			{ memberID: 5, memberName: "Mohammed" },
		],
	};
};

const createRooms = (count: number): RoomInfo[] => {
	const rooms = [];
	for (let i = 0; i < count; i++) {
		const room = createFakeObj(i);
		rooms.push(room);
	}

	return rooms;
};

const YourRooms = () => {
	const userRooms: RoomInfo[] = createRooms(12);

	const createNewRoom = async () => {
		// do stuff
	};

	return (
		<div className={styles.YourRooms}>
			<div className={styles.YourRooms_cards}>
				<CreateRoomCard onClick={createNewRoom} />
				{userRooms &&
					userRooms.map((room) => (
						<RoomCard key={room.roomCode} roomInfo={room} />
					))}
			</div>
		</div>
	);
};

export default YourRooms;
