import { compile, PathFunction } from 'path-to-regexp';

interface GeneratorCache {
    [pattern: string]: PathFunction;
}

const generatorCache: GeneratorCache = {};

const getGenerator = (pattern: string): PathFunction => {
    const generator = generatorCache[pattern];
    if (generator) {
        return generator;
    }

    const compiledGenerator = compile(pattern);
    generatorCache[pattern] = compiledGenerator;

    return compiledGenerator;
};

/**
 * Generates a URL from a pattern and parameters.
 * For example,
 *     generateUrl('/departments/:id', { id: 'electronics' })
 *     => '/departments/electronics'
 */
export const generateUrl = (pattern = '/', params = {}) => {
    if (pattern === '/') {
        return pattern;
    }
    const generator = getGenerator(pattern);
    return generator(params);
};
