/**
 * Gets rid of the missing requestAnimationFrame polyfill warning.
 *
 * @link https://reactjs.org/docs/javascript-environment-requirements.html
 * @copyright 2004-present Facebook. All Rights Reserved.
 */
(global as any).requestAnimationFrame = (callback: any) => {
    setTimeout(callback, 0);
};
