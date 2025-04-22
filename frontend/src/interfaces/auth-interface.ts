
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
}