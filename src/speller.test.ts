import Speller from './speller';

describe('Speller', () => {
    it('should load', async () => {
        const speller = import('./speller');
        expect(speller).toBeDefined();
    });

    it('should instantiate', () => {
        const speller = new Speller();
        expect(speller).toBeDefined();
    });
});
