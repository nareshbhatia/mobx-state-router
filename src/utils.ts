export function isEqual(value: any, other: any) {
    if (typeof value !== 'object') {
        return value === other;
    }

    for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            if (!isEqual(value[key], other[key])) {
                return false;
            }
        }
    }

    return true;
}
