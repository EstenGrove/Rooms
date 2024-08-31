import React from "react";
import styles from "../css/pages/Room.module.scss";
import { useParams } from "react-router-dom";

const Room = () => {
	const params = useParams();
	return (
		<div className={styles.Room}>
			<h1>/room/{params?.id ?? ":id"}</h1>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default Room;
