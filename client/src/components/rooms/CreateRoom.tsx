import { useRef, useEffect } from "react";
import styles from "../../css/rooms/CreateRoom.module.scss";
import TextInput from "../shared/TextInput";
import Button from "../shared/Button";
import Checkbox from "../shared/Checkbox";

type Props = {
	roomValues: {
		roomName: string;
		memberName: string;
		startRoom: boolean;
	};
	onChange: (name: string, value: string) => void;
	createRoom: () => void;
	cancelRoom: () => void;
};

const customCSS = {
	cancel: {
		color: "var(--accent)",
		backgroundColor: "transparent",
	},
};

const CreateRoom = ({
	roomValues,
	onChange,
	createRoom,
	cancelRoom,
}: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { roomName, memberName } = roomValues;
	const isDisabled = !roomName || !memberName;

	// focus input onMount
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		if (inputRef.current) {
			inputRef.current.focus();
		}

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className={styles.CreateRoom}>
			<div className={styles.CreateRoom_field}>
				<label htmlFor="roomName">Add a name for the Room</label>
				<TextInput
					name="roomName"
					value={roomValues.roomName}
					onChange={onChange}
					placeholder="Sprint-16 Room..."
					inputRef={inputRef}
					autoComplete="off"
				/>
			</div>
			<div className={styles.CreateRoom_field}>
				<label htmlFor="roomName">
					Set your display name (visible to others)
				</label>
				<TextInput
					name="memberName"
					value={roomValues.memberName}
					onChange={onChange}
					placeholder="Jessica H..."
				/>
			</div>
			<div className={styles.CreateRoom_field}>
				<Checkbox
					id="startRoom"
					name="startRoom"
					value={roomValues.startRoom}
					onChange={(name, value) => onChange(name, String(value))}
					label="Start Room (auto starts)"
				/>
			</div>
			<div className={styles.CreateRoom_actions}>
				<Button onClick={cancelRoom} style={customCSS.cancel}>
					Cancel
				</Button>
				<Button onClick={createRoom} isDisabled={isDisabled}>
					Create Room
				</Button>
			</div>
		</div>
	);
};

export default CreateRoom;
