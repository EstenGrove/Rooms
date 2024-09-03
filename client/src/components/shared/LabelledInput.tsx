import { RefObject } from "react";
import styles from "../../css/shared/LabelledInput.module.scss";
import TextInput from "./TextInput";

interface InputProps {
	id: string;
	name: string;
	value: string;
	label: string;
	onChange: (name: string, value: string) => void;
	inputRef?: RefObject<HTMLInputElement>;
	placeholder?: string;
}

// @ts-expect-error: Extends input's props to support forwarding via ...rest
interface Props extends InputProps, ComponentPropsWithRef<"input"> {}

const LabelledInput = ({
	id,
	name,
	value,
	label,
	onChange,
	inputRef,
	placeholder,
	...rest
}: Props) => {
	return (
		<div className={styles.LabelledInput}>
			<div className={styles.LabelledInput_field}>
				<label htmlFor={id}>{label}</label>
				<TextInput
					id={id}
					name={name}
					value={value}
					inputRef={inputRef}
					onChange={onChange}
					placeholder={placeholder}
					{...rest}
				/>
			</div>
		</div>
	);
};

export default LabelledInput;
