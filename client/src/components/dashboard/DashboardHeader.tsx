import React from "react";
import styles from "../../css/dashboard/DashboardHeader.module.scss";
import { CurrentUser } from "../../features/auth/authSlice";

type Props = {
	currentUser: CurrentUser;
};

const DashboardHeader = ({ currentUser }: Props) => {
	const { displayName } = currentUser;
	return (
		<div className={styles.DashboardHeader}>
			<h3 className={styles.DashboardHeader_title}>
				Welcome Back, <b>{displayName}</b>
			</h3>
		</div>
	);
};

export default DashboardHeader;
