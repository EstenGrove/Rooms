export type TKey<T> = keyof T;
export type TRecord<T> = Record<string, T[]>;

const groupBy = <T extends object>(key: TKey<T>, list: T[]): TRecord<T> => {
	const grouped = {} as TRecord<T>;
	for (let i = 0; i < list.length; i++) {
		const item = list[i] as T;
		const mapKey = item[key] as TKey<T>;

		if (!grouped[mapKey as keyof TRecord<T>]) {
			grouped[mapKey as keyof TRecord<T>] = [];
		}
		grouped[mapKey as keyof TRecord<T>].push(item as T);
	}
	return grouped;
};

export { groupBy };
