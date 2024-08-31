import { ChangeEvent, ComponentPropsWithRef, RefObject, useState } from "react";
import styles from "../../css/shared/PasswordInput.module.scss";
import sprite from "../../assets/icons/rooms.svg";

interface InputProps {
	id?: string;
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	inputRef?: RefObject<HTMLInputElement>;
}

// @ts-expect-error: Extends input's props to support forwarding via ...rest
interface Props extends InputProps, ComponentPropsWithRef<"input"> {}

const show = "remove_red_eye";
const hide = "visibility_off";

const PasswordInput = ({
	name,
	id,
	value,
	onChange,
	inputRef,
	...rest
}: Props) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const togglePassword = () => {
		setShowPassword(!showPassword);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value: string = e.target.value;
		onChange(name, value);
	};
	return (
		<div className={styles.PasswordInput}>
			<input
				ref={inputRef}
				type={showPassword ? "text" : "password"}
				name={name}
				id={id}
				value={value}
				onChange={handleChange}
				className={styles.PasswordInput_input}
				required
				{...rest}
			/>
			<button
				type="button"
				onClick={togglePassword}
				className={styles.PasswordInput_toggle}
				tabIndex={-1}
			>
				<svg className={styles.PasswordInput_toggle_icon}>
					<use xlinkHref={`${sprite}#icon-${showPassword ? show : hide}`}></use>
				</svg>
			</button>
		</div>
	);
};

export default PasswordInput;
