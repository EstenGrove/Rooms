import { ComponentPropsWithRef, MouseEvent, ReactNode, RefObject } from "react";
import styles from "../../css/shared/Button.module.scss";

type ButtonProps = {
	children?: ReactNode;
	isDisabled?: boolean;
	btnRef?: RefObject<HTMLButtonElement>;
	onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};
// @ts-expect-error: Extends input's props to support forwarding via ...rest
interface Props extends ButtonProps, ComponentPropsWithRef<"button"> {}

const Button = ({ onClick, isDisabled = false, children, ...rest }: Props) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			className={styles.Button}
			{...rest}
		>
			{children}
		</button>
	);
};

export default Button;
