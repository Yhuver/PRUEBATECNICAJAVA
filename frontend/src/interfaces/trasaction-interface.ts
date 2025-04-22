
export interface TransactionResponse {
    amount : string;
    merchant: string;
}

export interface TransactionRequest {
    id: number;
    amount : string;
    merchant: string;
    createAt: Date;
    updatedAt: Date;
}