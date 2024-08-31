import { ChangeEvent, ComponentPropsWithRef, RefObject } from "react";
import styles from "../../css/shared/TextInput.module.scss";

interface InputProps {
	id?: string;
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	inputRef?: RefObject<HTMLInputElement>;
}

// @ts-expect-error: Extends input's props to support forwarding via ...rest
interface Props extends InputProps, ComponentPropsWithRef<"input"> {}

const TextInput = ({ name, id, value, onChange, inputRef, ...rest }: Props) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value: string = e.target.value;
		onChange(name, value);
	};

	return (
		<div className={styles.TextInput}>
			<input
				ref={inputRef}
				type="text"
				name={name}
				id={id}
				value={value}
				onChange={handleChange}
				className={styles.TextInput_input}
				autoComplete="on"
				{...rest}
			/>
		</div>
	);
};

export default TextInput;
