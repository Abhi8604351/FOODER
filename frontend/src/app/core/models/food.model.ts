export interface Food {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isAvailable: boolean;
    countInStock: number;
    isVeg: boolean;
    createdAt?: string;
    updatedAt: string;
}
