import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FoodItemsService } from "./fooditems.service";
import { FoodItems } from "./fooditems.entity";

@ApiTags('food_items')
@Controller('api/foods')
export class FoodItemsController {

    constructor(private readonly foodItemsService: FoodItemsService) { }

    @Get()
    @ApiOperation({ summary: 'Liste tout les aliments' })
    index(): Promise<FoodItems[]> {
        return this.foodItemsService.findAll()
    }
}