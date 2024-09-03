import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../../css/home/GetStarted.module.scss";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import JoinRoom from "../rooms/JoinRoom";
import { JoinValues } from "../rooms/types";
import { loginUser } from "../../features/auth/operations";
import { useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { selectAuthStatus } from "../../features/auth/authSlice";

// SIGN IN
// SIGNUP
// CREATE ROOM
// JOIN ROOM

// SHOW THE BUTTONS, WHICH THEN TOGGLE WHICH FORM TO DISPLAY

interface LoginValues {
	username: string;
	password: string;
}
interface SignupValues {
	username: string;
	password: string;
	confirmPassword: string;
}

type ActiveForm = "signup" | "login";

const customCSS = {
	altBtn: {
		backgroundColor: "transparent",
		color: "var(--accent)",
		fontSize: "1.4rem",
	},
};

const initialJoin: JoinValues = {
	displayName: "",
	roomCode: "",
};
const initialLogin: LoginValues = {
	username: "",
	password: "",
};
const initialSignup: SignupValues = {
	username: "",
	password: "",
	confirmPassword: "",
};

const GetStarted = () => {
	const dispatch = useAppDispatch();
	const authStatus = useSelector(selectAuthStatus);
	const isSubmitting: boolean = authStatus === "PENDING";
	// params
	const [params, setParams] = useSearchParams();
	const tid: string = params.get("tab") || "signup";
	// modals
	const [showJoinRoomModal, setShowJoinRoomModal] = useState<boolean>(false);
	const [activeForm, setActiveForm] = useState<ActiveForm>(tid as ActiveForm);
	// form(s) values
	const [loginValues, setLoginValues] = useState<LoginValues>(initialLogin);
	const [signupValues, setSignupValues] = useState<SignupValues>(initialSignup);
	const [joinRoomValues, setJoinRoomValues] = useState<JoinValues>(initialJoin);

	const handleLoginForm = (name: string, value: string) => {
		setLoginValues({
			...loginValues,
			[name]: value,
		});
	};
	const handleSignupForm = (name: string, value: string) => {
		setSignupValues({
			...signupValues,
			[name]: value,
		});
	};
	const handleJoinForm = (name: string, value: string) => {
		setJoinRoomValues({
			...joinRoomValues,
			[name]: value,
		});
	};

	const changeForms = (formType: ActiveForm) => {
		setActiveForm(formType);
		setParams({ tab: formType });
	};

	const userLogin = async () => {
		dispatch(loginUser(loginValues));
	};
	const userSignup = async () => {
		//
		//
	};

	const openJoinRoomModal = () => {
		setShowJoinRoomModal(true);
	};
	const closeJoinRoomModal = () => {
		setShowJoinRoomModal(false);
		setJoinRoomValues(initialJoin);
	};

	const joinNewRoom = async () => {
		// do stuff
	};
	const cancelJoinAndSignup = () => {
		closeJoinRoomModal();
		changeForms("signup");
	};

	return (
		<div className={styles.GetStarted}>
			<div className={styles.GetStarted_header}>
				<h1>Real-Time Web Rooms (Scrum Poker)</h1>
			</div>

			<div className={styles.GetStarted_cta}>
				<button
					type="button"
					onClick={openJoinRoomModal}
					className={styles.GetStarted_cta_btn}
				>
					Join Room
				</button>
				<div className={styles.GetStarted_cta_or}>OR</div>
			</div>

			{/* SIGNUP/CREATE ACCOUNT */}
			{activeForm === "signup" && (
				<>
					<SignupForm
						values={signupValues}
						onChange={handleSignupForm}
						signupUser={userSignup}
					/>
					<Button onClick={() => changeForms("login")} style={customCSS.altBtn}>
						Already have an account? Login here
					</Button>
				</>
			)}

			{/* LOGIN */}
			{activeForm === "login" && (
				<>
					<LoginForm
						values={loginValues}
						onChange={handleLoginForm}
						loginUser={userLogin}
						isSubmitting={isSubmitting}
					/>
					<Button
						onClick={() => changeForms("signup")}
						style={customCSS.altBtn}
					>
						Need an account? Signup here
					</Button>
				</>
			)}

			{/* MODAL(S) */}
			{showJoinRoomModal && (
				<Modal title="Join Room" closeModal={closeJoinRoomModal}>
					<JoinRoom
						values={joinRoomValues}
						onChange={handleJoinForm}
						joinRoom={joinNewRoom}
						createAccount={cancelJoinAndSignup}
					/>
				</Modal>
			)}
		</div>
	);
};

export default GetStarted;
