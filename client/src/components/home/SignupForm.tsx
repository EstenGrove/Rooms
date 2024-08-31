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
	loginUser: () => void;
	onChange: (name: string, value: string) => void;
};

const isLoginDisabled = (values: SignupValues) => {
	const { username = "", password = "" } = values;
	const userLength: boolean = username?.length >= 3;
	const passLength: boolean = password?.length >= 5;
	const isEmpty: boolean = !username || !password;
	const noMinLength: boolean = !userLength || !passLength;

	return isEmpty || noMinLength;
};

const SignupForm = ({ values, onChange, loginUser }: Props) => {
	const isBtnDisabled: boolean = isLoginDisabled(values);

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
			<div className={styles.SignupForm_actions}>
				<Button
					onClick={loginUser}
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
