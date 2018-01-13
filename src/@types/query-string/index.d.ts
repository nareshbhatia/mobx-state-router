declare module 'query-string' {
    export function parse(str: string, options?: any): Object;
    export function stringify(obj: Object, options?: any): string;
    export function extract(str: string): string;
}
