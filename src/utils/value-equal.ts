// Based on https://github.com/mjackson/value-equal
// Applied fix for https://github.com/mjackson/value-equal/issues/10

export function valueEqual(a: any, b: any): boolean {
    if (a === b) return true;

    if (a == null || b == null) return false;

    if (Array.isArray(a)) {
        return (
            Array.isArray(b) &&
            a.length === b.length &&
            a.every(function(item, index) {
                return valueEqual(item, b[index]);
            })
        );
    }

    const aType = typeof a;
    const bType = typeof b;

    if (aType !== bType) return false;

    if (aType === 'object') {
        const aValue = a.valueOf
            ? a.valueOf()
            : Object.prototype.valueOf.call(a);
        const bValue = b.valueOf
            ? b.valueOf()
            : Object.prototype.valueOf.call(b);

        if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);

        if (aKeys.length !== bKeys.length) return false;

        return aKeys.every(function(key) {
            return valueEqual(a[key], b[key]);
        });
    }

    return false;
}
