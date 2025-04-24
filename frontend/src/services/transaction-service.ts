import {
    TransactionRequest,
    TransactionResponse, TransactionUpdateRequest
} from "@/interfaces/transaction-interface.ts";
import { AxiosError } from "axios";
import {api} from "@/services/api.ts";

import {
    ADD_TRANSACTION_URL, DELETE_TRANSACTION_URL,
    GET_TRANSACTION_URL,
    UPDATE_TRANSACTION_URL
} from "@/constants/endpoints.ts";


export const addTransaction = async ( data : TransactionRequest) : Promise<TransactionResponse>  => {
    try {
        const response = await api.post(ADD_TRANSACTION_URL, data);
        return response.data;
    } catch (error ) {
        if (error instanceof AxiosError) {
            throw error.response?.data || 'Ha ocurrido un error al agregar una transacción.';
        }
        throw 'Ha ocurrido un error';
    }
}

export const getTransactions = async (): Promise<Array<TransactionResponse>> => {
    try {
        const response = await api.get(GET_TRANSACTION_URL);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data || "Ha ocurrido un error al obtener las transacciones. Intente más tarde.";
        }
        throw "Ha ocurrido un error desconocido al obtener las transacciones.";
    }
};

export const updateTransaction = async ( id: number,  data: TransactionUpdateRequest ): Promise<TransactionResponse> => {
    try {
        const response = await api.put(`${UPDATE_TRANSACTION_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data || "Ha ocurrido un error al actualizar la transacción. Intente más tarde.";
        }
        throw "Ha ocurrido un error";
    }
};

export const deleteTransaction = async ( id : number): Promise<void> => {
    try {
        const response = await api.delete(`${DELETE_TRANSACTION_URL}/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data || "Ha ocurrido un error al eliminar la transacción. Intente más tarde.";
        }
        throw  "Ha ocurrido un error";
    }
}