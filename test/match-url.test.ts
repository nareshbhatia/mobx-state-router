import { matchUrl } from '../src/adapters/match-url';

describe('matchUrl', () => {
    test('returns params when url matches pattern', () => {
        const params = matchUrl(
            '/confs/tiecon2017/agenda',
            '/confs/:confId/:tab'
        );
        expect(params).toEqual({ confId: 'tiecon2017', tab: 'agenda' });
    });

    test('returns null when url does not match pattern', () => {
        const params = matchUrl('/confs/tiecon2017', '/confs/:confId/:tab');
        expect(params).toBeNull();
    });
});
