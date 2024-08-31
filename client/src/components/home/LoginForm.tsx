import styles from "../../css/home/LoginForm.module.scss";
import TextInput from "../shared/TextInput";
import PasswordInput from "../shared/PasswordInput";
import Button from "../shared/Button";

interface LoginValues {
	username: string;
	password: string;
}

const customCSS = {
	padding: "1.2rem 1.5rem",
	width: "100%",
};

type Props = {
	values: LoginValues;
	loginUser: () => void;
	onChange: (name: string, value: string) => void;
};

const isLoginDisabled = (values: LoginValues) => {
	const { username = "", password = "" } = values;
	const userLength: boolean = username?.length >= 3;
	const passLength: boolean = password?.length >= 5;
	const isEmpty: boolean = !username || !password;
	const noMinLength: boolean = !userLength || !passLength;

	return isEmpty || noMinLength;
};

const LoginForm = ({ values, onChange, loginUser }: Props) => {
	const isBtnDisabled: boolean = isLoginDisabled(values);

	return (
		<form className={styles.LoginForm}>
			<h3 className={styles.LoginForm_title}>Sign in</h3>
			<div className={styles.LoginForm_field}>
				<label htmlFor="username">Username/Email</label>
				<TextInput
					name="username"
					id="username"
					value={values.username}
					onChange={onChange}
					autoComplete="on"
				/>
			</div>
			<div className={styles.LoginForm_field}>
				<label htmlFor="password">Password</label>
				<PasswordInput
					name="password"
					id="password"
					value={values.password}
					onChange={onChange}
					autoComplete="on"
				/>
			</div>
			<div className={styles.LoginForm_actions}>
				<Button
					onClick={loginUser}
					isDisabled={isBtnDisabled}
					style={customCSS}
				>
					Login
				</Button>
			</div>
		</form>
	);
};

export default LoginForm;
