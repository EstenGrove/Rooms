import styles from "../../css/home/SignupForm.module.scss";
import TextInput from "../shared/TextInput";
import PasswordInput from "../shared/PasswordInput";
import Button from "../shared/Button";

interface SignupValues {
	username: string;
	password: string;
	confirmPassword: string;
}

const customCSS = {
	padding: "1.2rem 1.5rem",
	width: "100%",
};

type Props = {
	values: SignupValues;
	signupUser: () => void;
	onChange: (name: string, value: string) => void;
};

const isFilled = (values: SignupValues) => {
	const { username, password, confirmPassword } = values;
	const hasVals: boolean =
		username.length >= 1 && password.length >= 1 && confirmPassword.length >= 1;

	return hasVals;
};

const isLoginDisabled = (values: SignupValues) => {
	const { username, password, confirmPassword } = values;
	if (!isFilled(values)) return true;

	const userLength: boolean = username?.length >= 3;
	const passLength: boolean = password?.length >= 5;
	const confLength: boolean = confirmPassword?.length >= 5;
	const noMinLength: boolean = !userLength || !passLength || !confLength;
	const pwdsMatch: boolean = password === confirmPassword;

	return noMinLength || !pwdsMatch;
};

const SignupForm = ({ values, onChange, signupUser }: Props) => {
	const { password, confirmPassword } = values;
	const isFormFilled: boolean = isFilled(values);
	const isBtnDisabled: boolean = isLoginDisabled(values);
	const pwdMismatch: boolean = isFormFilled && password !== confirmPassword;

	return (
		<form className={styles.SignupForm}>
			<h3 className={styles.SignupForm_title}>Create account</h3>
			<div className={styles.SignupForm_field}>
				<label htmlFor="username">Username/Email</label>
				<TextInput
					name="username"
					id="username"
					value={values.username}
					onChange={onChange}
					autoComplete="on"
				/>
			</div>
			<div className={styles.SignupForm_field}>
				<label htmlFor="password">Password</label>
				<PasswordInput
					name="password"
					id="password"
					value={values.password}
					onChange={onChange}
					autoComplete="on"
				/>
			</div>
			<div className={styles.SignupForm_field}>
				<label htmlFor="confirmPassword">Confirm Password</label>
				<PasswordInput
					name="confirmPassword"
					id="confirmPassword"
					value={values.confirmPassword}
					onChange={onChange}
					autoComplete="on"
				/>
			</div>
			<div className={styles.SignupForm_errors}>
				{pwdMismatch && <span>Passwords do not match!</span>}
			</div>
			<div className={styles.SignupForm_actions}>
				<Button
					onClick={signupUser}
					isDisabled={isBtnDisabled}
					style={customCSS}
				>
					Create Account
				</Button>
			</div>
		</form>
	);
};

export default SignupForm;
