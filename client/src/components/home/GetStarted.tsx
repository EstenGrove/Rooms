import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../../css/home/GetStarted.module.scss";
import { JoinValues } from "../rooms/types";
import { useAppDispatch } from "../../store/store";
import { setAuth } from "../../features/auth/authSlice";
import { TResponse } from "../../utils/utils_http";
import {
	ILoginResp,
	ISignupResp,
	login,
	signup,
} from "../../utils/utils_users";
import { joinRoomAsNewGuest, JoinRoomResponse } from "../../utils/utils_rooms";
import { setCurrentMember } from "../../features/members/membersSlice";
import { RoomMember } from "../../features/members/types";
import { CurrentRoom } from "../../features/rooms/types";
import { setCurrentRoom } from "../../features/rooms/roomsSlice";
import { processFreshAuth, setAuthToStorage } from "../../utils/utils_auth";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Button from "../shared/Button";
import Modal from "../shared/Modal";
import JoinRoom from "../rooms/JoinRoom";

// SIGN-IN
// SIGN-UP
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
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
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
	// validation results
	const [authError, setAuthError] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
		const loginInfo = (await login(loginValues)) as TResponse<ILoginResp>;

		// handle any auth errors: "Account not Found." or "Incorrect Login Info."
		if (loginInfo.ErrorMsg) {
			setIsSubmitting(false);
			return setAuthError(loginInfo.ErrorMsg);
		}

		setIsSubmitting(false);

		const { User, Session } = loginInfo.Data as ILoginResp;
		setAuthToStorage(processFreshAuth({ User, Session }));
		dispatch(
			setAuth({ user: User, session: { ...Session, isAuthenticated: true } })
		);
		navigate("/dashboard/rooms");
	};
	const userSignup = async () => {
		const signupInfo = (await signup(signupValues)) as TResponse<ISignupResp>;

		console.log("signupInfo", signupInfo);

		if (signupInfo.ErrorMsg) {
			setIsSubmitting(false);
			return setAuthError(signupInfo.ErrorMsg);
		}

		setIsSubmitting(false);

		const { User, Session } = signupInfo.Data as ISignupResp;
		dispatch(setAuth({ user: User, session: Session }));
		setAuthToStorage(processFreshAuth({ User, Session }));
		navigate("/dashboard/rooms");
	};

	const joinNewRoom = async () => {
		const { roomCode } = joinRoomValues;
		const joinData = (await joinRoomAsNewGuest(
			joinRoomValues
		)) as JoinRoomResponse;

		console.log("joinData", joinData);

		if (joinData.ErrorMsg) {
			setIsSubmitting(false);
			return setAuthError(joinData.ErrorMsg);
		}

		const data = joinData?.Data as { Member: RoomMember; Room: CurrentRoom };

		setIsSubmitting(false);
		dispatch(setCurrentMember(data.Member));
		dispatch(setCurrentRoom(data.Room));
		navigate(`/sessions/${roomCode}`);
	};
	const cancelJoinAndSignup = () => {
		closeJoinRoomModal();
		changeForms("signup");
	};

	const openJoinRoomModal = () => {
		setShowJoinRoomModal(true);
	};
	const closeJoinRoomModal = () => {
		setShowJoinRoomModal(false);
		setJoinRoomValues(initialJoin);
	};

	// reset the error message after 5s
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		let timerID: ReturnType<typeof setTimeout>;
		if (!!authError && !isSubmitting) {
			timerID = setTimeout(() => {
				setAuthError("");
			}, 10000);
		}

		return () => {
			isMounted = false;
			clearTimeout(timerID);
		};
	}, [authError, isSubmitting]);

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
						errorMsg={authError as string}
						signupUser={() => {
							setIsSubmitting(true);
							userSignup();
						}}
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
						loginUser={() => {
							setIsSubmitting(true);
							userLogin();
						}}
						isSubmitting={isSubmitting}
						errorMsg={authError as string}
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
						isSubmitting={isSubmitting}
						errorMsg={authError as string}
						joinRoom={() => {
							setIsSubmitting(true);
							joinNewRoom();
						}}
						createAccount={cancelJoinAndSignup}
					/>
				</Modal>
			)}
		</div>
	);
};

export default GetStarted;
