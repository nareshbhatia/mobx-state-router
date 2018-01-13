declare module 'query-string' {
    export function parse(str: string): Object;
    export function stringify(obj: Object): string;
    export function extract(str: string): string;
}
