import Axios from "axios";
import {FoodItem} from "../models/FoodItemModel.ts";

function findAllItems(): Promise<FoodItem[]> {
    return Axios.get("http://localhost:3000/api/foods").then(
        (response) => response.data as FoodItem[]
    )
}

export default {
    findAllItems
}