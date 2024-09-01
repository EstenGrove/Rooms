import React from "react";
import styles from "../css/pages/RoomSession.module.scss";

type Props = {};

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

const RoomSession = ({}: Props) => {
	return (
		<div className={styles.RoomSession}>
			<div className={styles.RoomSession_header}>
				<h1 className={styles.RoomSession_title}>Live Session</h1>
				<LiveIndicator />
			</div>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default RoomSession;
