export interface Department {
    id: string;
    name: string;
}

export const Departments: { [id: string]: Department } = {
    electronics: {
        id: 'electronics',
        name: 'Electronics',
    },
    music: {
        id: 'music',
        name: 'Music',
    },
};
