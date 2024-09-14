import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "../../css/shared/Loading.module.scss";
import Spinner from "./Spinner";

type LoadingProps = {
	children?: ReactNode;
};

interface Props extends LoadingProps, ComponentPropsWithoutRef<"div"> {}

const Loading = ({ children, ...rest }: Props) => {
	return (
		<div className={styles.Loading} {...rest}>
			<Spinner />
			<div className={styles.Loading_inner}>{children}</div>
		</div>
	);
};

export default Loading;
