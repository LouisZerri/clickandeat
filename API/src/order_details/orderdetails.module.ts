import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderDetails } from "./orderdetails.entity";
import { OrderDetailsController } from "./orderdetails.controller";
import { OrderDetailsService } from "./orderdetails.service";
import { Orders } from "src/order/order.entity";
import { FoodItems } from "src/food_items/fooditems.entity";

@Module({
    imports: [TypeOrmModule.forFeature([OrderDetails, Orders, FoodItems])],
    controllers: [OrderDetailsController],
    providers: [OrderDetailsService],
    exports: [TypeOrmModule]
})

export class OrderDetailsModule{}