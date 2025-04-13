import { IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDetailDto {
	
	@Type(() => Number)
	@IsNumber()
	food_item_price: number;

	@Type(() => Number)
	@IsInt()
	quantity: number;

	@Type(() => Number)
	@IsInt()
	fooditemsId: number;
}
