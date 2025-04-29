

export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    errorCode: string;
    errors?: any;
}