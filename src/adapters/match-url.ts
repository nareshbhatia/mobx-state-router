import * as pathToRegexp from 'path-to-regexp';
import { Params } from '../router-store';

interface PatternInfo {
    regExp: RegExp;
    keys: pathToRegexp.Key[];
}

interface PatternInfoCache {
    [pattern: string]: PatternInfo;
}

const patternInfoCache: PatternInfoCache = {};

const getPatternInfo = (pattern: string): PatternInfo => {
    const patternInfo = patternInfoCache[pattern];
    if (patternInfo) {
        return patternInfo;
    }

    const keys: pathToRegexp.Key[] = [];
    const regExp = pathToRegexp(pattern, keys);
    const newPatternInfo = { regExp, keys };
    patternInfoCache[pattern] = newPatternInfo;

    return newPatternInfo;
};

/**
 * Matches a URL to a pattern.
 * For example,
 *     matchUrl('/departments/electronics', '/departments/:id'
 *     => { id: 'electronics' }
 */
export const matchUrl = (url: string, pattern: string) => {
    const { regExp, keys } = getPatternInfo(pattern);
    const match = regExp.exec(url);
    if (!match) {
        return null;
    }

    const [matchedUrl, ...values] = match;

    return keys.reduce((params: Params, key, index) => {
        params[key.name] = values[index];
        return params;
    }, {});
};
