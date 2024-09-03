export type TFormValues<T> = T;

// optional 'targetFields' if omitted, all will be validated in 'values'
const isValidForm = <T>(
	values: TFormValues<T>,
	targetFields: string[] = []
): boolean => {
	if (!values || !Object.keys(values).length) return false;

	if (!targetFields.length) {
		// validate all, if no fields were provided
		return Object.entries(values).every(([, val]) => {
			return !!val && val !== "";
		});
	} else {
		// otherwise only validate the 'targetFields'
		return targetFields.every((key) => {
			const val = values[key as keyof T];
			return !!val && val !== "";
		});
	}
};

const runValidator = <T extends object>(
	values: TFormValues<T>,
	validateCb: (val: keyof T) => boolean
) => {
	const issues: Array<{ key: string; error: string }> = [];

	for (const [key, val] of Object.entries(values)) {
		const isValid: boolean = validateCb(val);
		if (!isValid) {
			issues.push({ key, error: `Invalid: ${key}; Value: ${val}` });
		}
	}

	return issues;
};

export { isValidForm, runValidator };
