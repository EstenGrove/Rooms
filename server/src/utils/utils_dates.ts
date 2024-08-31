import {
	differenceInMinutes,
	minutesToHours,
	minutesToSeconds,
} from "date-fns";

const getDiffInMins = (
	earlier: Date | string,
	later: Date | string
): number => {
	return differenceInMinutes(later, earlier);
};

export type MinsTo = "hrs" | "secs" | "days" | "wks";

const minsTo = (mins: number, to: MinsTo): number => {
	switch (to) {
		case "hrs": {
			const hrs = mins / 60;
			const fixed = hrs.toFixed(2);
			return Number(fixed);
		}
		case "secs": {
			const secs = mins * 60;
			const fixed = secs.toFixed(2);

			return Number(fixed);
		}
		case "days": {
			const hours = minutesToHours(mins);
			return hours / 24;
		}
		case "wks": {
			const hours = minutesToHours(mins);
			const days = hours / 24;
			const weeks = days / 7;
			return weeks;
		}

		default:
			throw new Error(`Invalid conversion: ${mins} => ${to}`);
	}
};

export { getDiffInMins, minsTo };
