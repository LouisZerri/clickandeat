import axios from 'axios';

interface CreateOrderPayload {
    nb_order: string;
    payment_method: string;
    total: number;
    customerId: number;
    order_details: {
        food_item_price: number;
        quantity: number;
        fooditemsId: number | undefined;
    }[];
}

export interface UpdateOrderPayload {
    nb_order: string;
    payment_method: string;
    total: number;
    customerId: number;
    order_details: {
        id?: number;
        food_item_price: number;
        quantity: number;
        fooditemsId: number;
    }[];
}

const API_URL = 'http://localhost:3000/api/orders';

const createOrder = async (order: CreateOrderPayload) => {
    const response = await axios.post(API_URL, order);
    return response.data;
};

const getAllOrders = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}

const getOrderById = async (id: number | undefined) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
}

const deleteOrder = async (id: number) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

const updateOrder = async (id: number, payload: UpdateOrderPayload) => {
    const res = await axios.put(`${API_URL}/${id}`, payload);
    return res.data;
};


export default {
    createOrder,
    getAllOrders,
    getOrderById,
    deleteOrder,
    updateOrder
};
