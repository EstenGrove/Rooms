import styles from "../../css/dashboard/DashboardHeader.module.scss";
import { CurrentUser } from "../../features/auth/types";

type Props = {
	currentUser: CurrentUser;
};

const DashboardHeader = ({ currentUser }: Props) => {
	const username = currentUser?.username;
	const displayName = currentUser?.displayName;
	const welcomeName: string = displayName || username;
	return (
		<div className={styles.DashboardHeader}>
			<h3 className={styles.DashboardHeader_title}>
				Welcome Back, <b>{welcomeName}</b>
			</h3>
		</div>
	);
};

export default DashboardHeader;
