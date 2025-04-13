export interface Orders {
    id: number;
    nb_order: string;
    payment_method: string;
    total: number;
    customer: {
        name: string;
    };
}

export interface InitialOrderValues {
    nb_order: string;
    payment_method: string;
    total: number;
    customerId: number;
    orderItems: {
        itemId: number;
        quantity: number;
        price: number;
    }[];
}

export interface OrderDetailResponse {
    id: number;
    food_item_price: number;
    quantity: number;
    food_item: {
        id: number;
        name: string;
    };
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