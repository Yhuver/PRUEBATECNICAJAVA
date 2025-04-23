
export interface TransactionResponse {
    id: number;
    amount : number;
    merchant: string;
    createAt: Date;
    updatedAt: Date;
}

export interface TransactionRequest {
    amount : number;
    merchant: string;
}


export interface TransactionUpdateRequest {
    amount : number;
    merchant: string;
}