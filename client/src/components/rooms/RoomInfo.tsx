import styles from "../../css/rooms/RoomInfo.module.scss";
import { CurrentRoom } from "../../features/rooms/types";
import { getRelativeDistance } from "../../utils/utils_dates";
import RoomCode from "./RoomCode";

type Props = {
	currentRoom: CurrentRoom;
};

const RoomInfo = ({ currentRoom }: Props) => {
	const { room } = currentRoom;
	const lastActive = getRelativeDistance(
		(room?.lastAliveDate ?? room?.createdDate ?? "") as string
	);
	return (
		<div className={styles.RoomInfo}>
			<div className={styles.RoomInfo_header}>
				<h2 className={styles.RoomInfo_header_name}>{room?.roomName}</h2>
				<p className={styles.RoomInfo_header_lastActive}>
					Last active {lastActive}
				</p>
				<RoomCode roomCode={room?.roomCode as string} />
			</div>
		</div>
	);
};

export default RoomInfo;
