import { ComponentPropsWithRef } from "react";
import sprite from "../../assets/icons/rooms.svg";
import styles from "../../css/rooms/CreateRoomButton.module.scss";

type ButtonProps = {
	onClick: () => void;
	isDisabled?: boolean;
};

// @ts-expect-error: Extends buttons props w/ custom props
interface Props extends ButtonProps, ComponentPropsWithRef<"button"> {}

// meeting_room
const CreateRoomButton = ({ onClick, isDisabled = false, ...rest }: Props) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			title="Create a new room"
			className={styles.CreateRoomButton}
			{...rest}
		>
			<svg className={styles.CreateRoomButton_icon}>
				<use xlinkHref={`${sprite}#icon-meeting_room`}></use>
			</svg>
			<span className={styles.CreateRoomButton_text}>Create Room</span>
		</button>
	);
};

export default CreateRoomButton;
