const saveToLocalStorage = <T extends number | string | object>(
	key: string,
	data: T
) => {
	const newData = JSON.stringify(data);
	localStorage.setItem(key, newData);
};

const getFromLocalStorage = <T extends number | string | object>(
	key: string
): T | unknown => {
	const rawData = localStorage.getItem(key) as string;

	try {
		const data = JSON.parse(rawData);
		return data;
	} catch (error) {
		return error;
	}
};

const upsertToLocalStorage = <T extends number | string | object>(
	key: string,
	data: T
) => {
	saveToLocalStorage(key, data);
};

const removeFromLocalStorage = (key: string) => {
	localStorage.removeItem(key);
};
const clearLocalStorage = () => {
	localStorage.clear();
};

export {
	saveToLocalStorage,
	getFromLocalStorage,
	upsertToLocalStorage,
	removeFromLocalStorage,
	clearLocalStorage,
};
