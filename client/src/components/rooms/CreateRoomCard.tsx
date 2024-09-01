import React from "react";
import sprite from "../../assets/icons/rooms.svg";
import styles from "../../css/rooms/CreateRoomCard.module.scss";

type ButtonProps = {
	onClick: () => void;
	isDisabled?: boolean;
};

// @ts-expect-error: Extends buttons props w/ custom props
interface Props extends ButtonProps, ComponentPropsWithRef<"button"> {}

const CreateRoomCard = ({ onClick, isDisabled, ...rest }: Props) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className={styles.CreateRoomCard}
			{...rest}
		>
			<svg className={styles.CreateRoomCard_icon}>
				<use xlinkHref={`${sprite}#icon-meeting_room`}></use>
			</svg>
			<div className={styles.CreateRoomCard_text}>Create Room</div>
		</button>
	);
};

export default CreateRoomCard;
