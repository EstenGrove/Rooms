import { useRef, useEffect } from "react";
import { isValidForm } from "../../utils/utils_validation";
import { JoinValues } from "./types";
import styles from "../../css/rooms/JoinRoom.module.scss";
import LabelledInput from "../shared/LabelledInput";
import Button from "../shared/Button";

type Props = {
	values: JoinValues;
	onChange: (name: string, value: string) => void;
	joinRoom: () => void;
	createAccount: () => void;
};

const customCSS = {
	join: {
		width: "100%",
		padding: "1.5rem 1.5rem",
	},
	create: {
		backgroundColor: "transparent",
		color: "var(--accent)",
	},
};

const JoinRoom = ({ values, onChange, joinRoom, createAccount }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const isValid: boolean = isValidForm<JoinValues>(values);

	// focus 1st input onMount
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (inputRef.current) {
			inputRef.current.focus();
		}

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className={styles.JoinRoom}>
			<div className={styles.JoinRoom_form}>
				<div className={styles.JoinRoom_form_field}>
					<LabelledInput
						id="displayName"
						name="displayName"
						inputRef={inputRef}
						onChange={onChange}
						value={values.displayName}
						placeholder="Your name..."
						label="Enter a display name (visible to others)"
					/>
				</div>
				<div className={styles.JoinRoom_form_field}>
					<LabelledInput
						id="roomCode"
						name="roomCode"
						onChange={onChange}
						value={values.roomCode}
						placeholder="Enter code..."
						label="Invite Code (eg. XXXX-XXXX-XXXXX)"
					/>
				</div>
				<div className={styles.JoinRoom_form_actions}>
					<Button
						onClick={joinRoom}
						isDisabled={!isValid}
						style={customCSS.join}
					>
						Join Room
					</Button>
				</div>
				<div className={styles.JoinRoom_form_ctaOptions}>
					<div>OR</div>
					<Button style={customCSS.create} onClick={createAccount}>
						Create Account
					</Button>
				</div>
			</div>
		</div>
	);
};

export default JoinRoom;
