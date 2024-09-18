import React from "react";
import sprite from "../../assets/icons/rooms2.svg";
import styles from "../../css/rooms/RoomCode.module.scss";
import { addEllipsis } from "../../utils/utils_misc";

type Props = {
	roomCode: string;
};

const RoomCode = ({ roomCode }: Props) => {
	const code: string = addEllipsis(roomCode, 6);

	const copyToClipboard = () => {
		// do stuff
	};

	return (
		<button type="button" className={styles.RoomCode} onClick={copyToClipboard}>
			<span className={styles.RoomCode_code}>{code}</span>
			<svg className={styles.RoomCode_icon}>
				<use xlinkHref={`${sprite}#icon-content_copy`}></use>
			</svg>
		</button>
	);
};

export default RoomCode;
