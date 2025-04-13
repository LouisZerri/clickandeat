import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderDetailDto {
	@IsOptional()
	@IsNumber()
	id?: number;

	@IsNumber()
	food_item_price: number;

	@IsNumber()
	quantity: number;

	@IsNumber()
	fooditemsId: number;
}
