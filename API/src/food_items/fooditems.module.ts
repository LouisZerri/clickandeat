import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodItems } from "./fooditems.entity";
import { FoodItemsController } from "./fooditems.controller";
import { FoodItemsService } from "./fooditems.service";

@Module({
    imports: [TypeOrmModule.forFeature([FoodItems])],
    controllers: [FoodItemsController],
    providers: [FoodItemsService],
    exports: [TypeOrmModule]
})

export class FoodItemsModule{}