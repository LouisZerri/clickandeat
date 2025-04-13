import Axios from "axios";
import {Customer} from "../models/CustomerModel.ts";

function findAllCustomer(): Promise<Customer[]> {
    return Axios.get("http://localhost:3000/api/customers").then(
        (response) => response.data as Customer[]
    )
}

export default {
    findAllCustomer
}