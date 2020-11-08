// eslint-disable-next-line @typescript-eslint/ban-types
export const isEmpty = (obj: object) => {
	for (const i in obj) return false;
	return true;
};
