import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
	it('if is {} object', () => {
		expect(isEmpty({})).toBe(true);
	});
	it('if is {same:value} object', () => {
		expect(isEmpty({ same: 'value' })).toBe(false);
	});
});
