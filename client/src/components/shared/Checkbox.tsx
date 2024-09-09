import { ChangeEvent } from "react";
import styles from "../../css/shared/Checkbox.module.scss";

type Props = {
	id: string;
	name: string;
	value: boolean | string;
	label: string;
	onChange: (name: string, value: boolean) => void;
};

const Checkbox = ({ id, name, value, onChange, label }: Props) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { checked, name } = e.target;
		onChange(name, checked);
	};

	return (
		<div className={styles.Checkbox}>
			<input
				type="checkbox"
				name={name}
				id={id}
				checked={value === "true"}
				onChange={handleChange}
				className={styles.Checkbox_input}
			/>
			<label htmlFor={id} className={styles.Checkbox_label}>
				<span>{label}</span>
			</label>
		</div>
	);
};

export default Checkbox;
