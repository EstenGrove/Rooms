const createUserAccount = async () => {};

const getUserBadgeName = (name: string, maxLength: number = 10): string => {
	if (!name) return "User";

	if (name.length > maxLength) {
		return name.slice(0, maxLength) + "..";
	} else {
		return name;
	}
};

export { createUserAccount, getUserBadgeName };
