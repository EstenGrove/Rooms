import React from "react";
import styles from "../../css/live-room/InactiveSessionNotice.module.scss";

type Props = {};

const InactiveSessionNotice = ({}: Props) => {
	return (
		<div className={styles.InactiveSessionNotice}>
			<div className={styles.InactiveSessionNotice_header}>
				<h2 className={styles.InactiveSessionNotice_header_title}>
					Room is not live.
				</h2>
				<p>
					This room has not been started. You can wait here until the room's
					admin starts a session or come back later. Thanks!
				</p>
			</div>
		</div>
	);
};

export default InactiveSessionNotice;
