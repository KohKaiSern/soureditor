export const reduce = (input: string): string => {
	return input
		.replace(/♀/g, 'f')
		.replace(/♂/g, 'm')
		.replace(/é/g, 'e')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
};
export default reduce;
