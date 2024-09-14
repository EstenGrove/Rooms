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
	errorMsg?: string;
	isSubmitting: boolean;
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

const JoinRoom = ({
	values,
	onChange,
	joinRoom,
	errorMsg,
	createAccount,
	isSubmitting = false,
}: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const isValid: boolean = isValidForm<JoinValues>(values);

	// focus 'displayName' input onMount
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
				{errorMsg && (
					<span className={styles.JoinRoom_form_errorMsg}>{errorMsg}</span>
				)}
				<div className={styles.JoinRoom_form_field}>
					<LabelledInput
						id="displayName"
						name="displayName"
						inputRef={inputRef}
						onChange={onChange}
						value={values.displayName}
						placeholder="Your name..."
						label="Enter a display name (visible to others)"
						autoComplete="off"
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
						autoComplete="off"
					/>
				</div>
				<div className={styles.JoinRoom_form_actions}>
					<Button
						onClick={joinRoom}
						isDisabled={!isValid || isSubmitting}
						style={customCSS.join}
					>
						{isSubmitting ? "Joining..." : "Join Room"}
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
