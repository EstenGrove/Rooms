import { ReactNode, useRef } from "react";
import sprite from "../../assets/icons/general.svg";
import styles from "../../css/shared/Modal.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
	title?: string;
	closeModal: () => void;
	children?: ReactNode;
};

const Modal = ({ title, closeModal, children }: Props) => {
	const modalRef = useRef<HTMLElement>(null);
	useOutsideClick(modalRef, closeModal);

	return (
		<aside ref={modalRef} className={styles.Modal}>
			<div className={styles.Modal_top}>
				<h2 className={styles.Modal_top_title}>{title}</h2>
				<button
					type="button"
					onClick={closeModal}
					className={styles.Modal_top_close}
				>
					<svg className={styles.Modal_top_close_icon}>
						<use xlinkHref={`${sprite}#icon-clear`}></use>
					</svg>
				</button>
			</div>
			<div className={styles.Modal_inner}>{children}</div>
		</aside>
	);
};

export default Modal;
