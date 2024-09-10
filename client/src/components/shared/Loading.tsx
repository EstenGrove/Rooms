import { ReactNode } from "react";
import styles from "../../css/shared/Loading.module.scss";
import Spinner from "./Spinner";

type Props = {
	children?: ReactNode;
};

const Loading = ({ children }: Props) => {
	return (
		<div className={styles.Loading}>
			<Spinner />
			<div className={styles.Loading_inner}>{children}</div>
		</div>
	);
};

export default Loading;
