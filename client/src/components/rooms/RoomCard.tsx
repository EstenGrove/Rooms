import styles from "../../css/rooms/RoomCard.module.scss";
import sprite from "../../assets/icons/rooms.svg";
import { addEllipsis } from "../../utils/utils_misc";
import { getRelativeDistance } from "../../utils/utils_dates";
import { RoomInfo, RoomInfoMember } from "./types";
import AdminBadge from "../users/AdminBadge";
import { NavLink } from "react-router-dom";

type Props = {
	roomInfo: RoomInfo;
};

// REQUIREMENTS
// - Consider add a SSE listener to listen for if the room has an active session
//    - IF active, then show a pulsing beacon that indicates it's live

const LiveRoomIndicator = () => {
	return (
		<div title="Room is live" className={styles.LiveRoomIndicator}>
			<div className={styles.LiveRoomIndicator_ping}>
				<div className={styles.LiveRoomIndicator_ping_beacon}></div>
				<div className={styles.LiveRoomIndicator_ping_flash}></div>
			</div>
			<div className={styles.LiveRoomIndicator_msg}>Active</div>
		</div>
	);
};

type StartRoom = {
	startRoom: () => void;
};
const StartRoomButton = ({ startRoom }: StartRoom) => {
	return (
		<button
			type="button"
			title="Start Room"
			onClick={startRoom}
			className={styles.StartRoomButton}
		>
			<svg className={styles.StartRoomButton_icon}>
				<use xlinkHref={`${sprite}#icon-controller-play`}></use>
			</svg>
		</button>
	);
};

type MembersCount = {
	roomMembers: Array<RoomInfoMember>;
};
const MembersCount = ({ roomMembers }: MembersCount) => {
	const count: number = roomMembers?.length || 0;
	return (
		<div className={styles.MembersCount}>
			<svg className={styles.MembersCount_icon}>
				<use xlinkHref={`${sprite}#icon-group`}></use>
			</svg>
			<span>{count} members</span>
		</div>
	);
};

type Details = {
	to: string;
};
const ViewDetails = ({ to }: Details) => {
	return (
		<NavLink to={to} className={styles.ViewDetails}>
			View Details
		</NavLink>
	);
};

const RoomCard = ({ roomInfo }: Props) => {
	const { roomName, roomCode, members, lastAliveDate, isAlive } = roomInfo;
	const isAdmin: boolean = false;

	const startRoomSession = async () => {
		// do stuff
	};

	return (
		<div className={styles.RoomCard}>
			<div className={styles.RoomCard_header}>
				<div className={styles.RoomCard_header_left}>
					<h4>{addEllipsis(roomName, 35)}</h4>
					<span>Last active {getRelativeDistance(lastAliveDate)}</span>
					{isAdmin && <AdminBadge />}
				</div>
				<div className={styles.RoomCard_header_right}>
					{isAlive && <LiveRoomIndicator />}
					{!isAlive && <StartRoomButton startRoom={startRoomSession} />}
				</div>
			</div>
			<div className={styles.RoomCard_body}></div>
			<div className={styles.RoomCard_actions}>
				<MembersCount roomMembers={members} />
				<ViewDetails to={roomCode} />
			</div>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default RoomCard;
