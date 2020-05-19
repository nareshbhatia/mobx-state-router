export interface Photo {
    url: string;
    title: string;
}

export interface Item {
    id: string;
    name: string;
    department: string;
    manufacturer: string;
    price: number;
    photo: Photo;
    isFeatured: boolean;
}
