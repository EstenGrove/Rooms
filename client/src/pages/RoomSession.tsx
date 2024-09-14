import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "../css/pages/RoomSession.module.scss";
import { useSelector } from "react-redux";
import { selectCurrentMember } from "../features/members/membersSlice";
import { useAppDispatch } from "../store/store";
import { fetchLiveRoom } from "../features/rooms/operations";
import { RootState } from "../store/store";
import { TStatus } from "../features/types";

// REQUIREMENTS:
// - Figure out how to handle auth'd users & public users
// 		- Perhaps use localStorage or sessionStorage

const LiveIndicator = () => {
	return (
		<div className={styles.LiveIndicator}>
			<div className={styles.LiveIndicator_ping}>
				<div className={styles.LiveIndicator_ping_beacon}></div>
				<div className={styles.LiveIndicator_ping_flash}></div>
			</div>
			<div className={styles.LiveIndicator_msg}>Active</div>
		</div>
	);
};

const RoomSession = () => {
	const { roomCode } = useParams();
	const dispatch = useAppDispatch();
	const currentMember = useSelector(selectCurrentMember);
	const status: TStatus = useSelector((state: RootState) => state.rooms.status);
	const isLoading: boolean = status === "PENDING";

	// fetch our room, session & member data
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (roomCode) {
			const { memberID } = currentMember;
			dispatch(fetchLiveRoom({ roomCode, memberID }));
		}

		return () => {
			isMounted = false;
		};
	}, [currentMember, dispatch, roomCode]);

	return (
		<div className={styles.RoomSession}>
			<div className={styles.RoomSession_header}>
				<h1 className={styles.RoomSession_title}>Live Session</h1>
				<LiveIndicator />
				{isLoading && <div>Loading room...please wait..</div>}
				<div>Room Code: {roomCode}</div>
			</div>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default RoomSession;
