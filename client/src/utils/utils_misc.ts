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

const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

export type TKey<T> = keyof T;
export type TRecord<T> = Record<string, T[]>;

const groupBy = <T extends object>(key: TKey<T>, list: T[]) => {
	const grouped = {} as TRecord<T>;
	for (let i = 0; i < list.length; i++) {
		const item = list[i] as T;
		const mapKey = item[key] as TKey<T>;

		if (!grouped[mapKey as keyof object]) {
			grouped[mapKey as keyof TRecord<T>] = [];
			// break;
		}
		grouped[mapKey as keyof TRecord<T>].push(item as T);
	}
	return grouped;
};

const copyToClipboard = (text: string) => {
	if ("navigator" in window) {
		navigator.clipboard.writeText(text);
	}
};

export { upsertQueryParams, addEllipsis, sleep, groupBy, copyToClipboard };
