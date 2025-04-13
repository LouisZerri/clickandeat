import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FoodItems } from "./fooditems.entity";


@Injectable()
export class FoodItemsService {

    constructor(
        @InjectRepository(FoodItems)
        private foodItemsRepository: Repository<FoodItems>
    ){ }

    findAll(): Promise<FoodItems[]> {
        return this.foodItemsRepository.find();
    }
}