import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../../css/home/GetStarted.module.scss";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Button from "../shared/Button";

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

type ActiveForm = "signup" | "login" | "create-account";

const customCSS = {
	altBtn: {
		backgroundColor: "transparent",
		color: "var(--accent)",
		fontSize: "1.4rem",
	},
};

const GetStarted = () => {
	const [params, setParams] = useSearchParams();
	const tid = params.get("tab") || "signup";
	const [activeForm, setActiveForm] = useState<ActiveForm>(tid as ActiveForm);
	const [loginValues, setLoginValues] = useState<LoginValues>({
		username: "",
		password: "",
	});
	const [signupValues, setSignupValues] = useState<SignupValues>({
		username: "",
		password: "",
		confirmPassword: "",
	});

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

	const changeForms = (formType: ActiveForm) => {
		setActiveForm(formType);
		setParams({ tab: formType });
	};

	return (
		<div className={styles.GetStarted}>
			<div className={styles.GetStarted_header}>
				<h1>Real-Time Web Rooms (Scrum Poker)</h1>
			</div>

			<div className={styles.GetStarted_cta}>
				<button className={styles.GetStarted_cta_btn}>Join Room</button>
				<div className={styles.GetStarted_cta_or}>OR</div>
			</div>

			{/* SIGNUP/CREATE ACCOUNT */}
			{activeForm === "signup" && (
				<>
					<SignupForm
						values={signupValues}
						onChange={handleSignupForm}
						loginUser={() => {}}
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
						loginUser={() => {}}
					/>
					<Button
						onClick={() => changeForms("signup")}
						style={customCSS.altBtn}
					>
						Need an account? Signup here
					</Button>
				</>
			)}
		</div>
	);
};

export default GetStarted;
