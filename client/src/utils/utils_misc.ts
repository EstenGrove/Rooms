type TParams = {
	[key: string]: string;
};

const upsertQueryParams = (paramsObj: TParams) => {
	const url = new URL(window.location.href);
	for (const [key, val] of Object.entries(paramsObj)) {
		url.searchParams.set(key, val);
	}
	history.pushState({}, "", url);
};

const addEllipsis = (str: string, maxLength: number = 30) => {
	if (str.length < maxLength) return str;
	const newStr = str.slice(0, maxLength + 2);
	return newStr + "..";
};

export { upsertQueryParams, addEllipsis };
