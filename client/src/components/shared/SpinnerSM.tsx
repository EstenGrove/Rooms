import { CSSProperties } from "react";
import cssMod from "../../css/shared/SpinnerSM.module.scss";

// range helper: creates array [1...12]
const range = (
	start: number,
	stop: number,
	callback: (num: number) => number
) => {
	return Array.from({ length: stop - start }, (_, i) => callback(i + start));
};

type Props = {
	color?: string;
	styles?: CSSProperties;
};

const SpinnerSM = ({ color = "var(--blueGrey300)", styles = {} }: Props) => {
	const dots = range(0, 8, (x) => x + 1);
	const css = {
		...styles,
		backgroundColor: color,
	};

	return (
		<div className={cssMod.SpinnerSM} style={css}>
			{dots.map((dot) => (
				<div className={cssMod.SpinnerSM_dot} key={dot} />
			))}
		</div>
	);
};
export default SpinnerSM;
