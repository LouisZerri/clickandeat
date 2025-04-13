import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { Customer } from "src/customer/customer.entity";
import { OrderDetails } from "src/order_details/orderdetails.entity";
import { FoodItems } from "src/food_items/fooditems.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Orders, Customer, OrderDetails, FoodItems])],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [TypeOrmModule]
})

export class OrderModule{}