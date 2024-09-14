import styles from "../../css/users/UserBadge.module.scss";
import sprite from "../../assets/icons/rooms.svg";
import { getUserBadgeName } from "../../utils/utils_users";

type Props = {
	displayName: string;
};

const UserBadge = ({ displayName, ...rest }: Props) => {
	const name: string = getUserBadgeName(displayName, 10);

	return (
		<div className={styles.UserBadge} {...rest}>
			<svg className={styles.UserBadge_icon}>
				<use xlinkHref={`${sprite}#icon-account_circle`}></use>
			</svg>
			<div className={styles.UserBadge_name}>{name}</div>
		</div>
	);
};

export default UserBadge;
