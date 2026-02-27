export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    token?: string;
}

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    token: string;
}
