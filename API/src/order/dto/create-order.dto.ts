import { IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDetailDto } from 'src/order_details/dto/create-order-details.dto';


export class CreateOrderDto {
	@IsString()
	@IsNotEmpty()
	nb_order: string;

	@IsString()
	@IsNotEmpty()
	payment_method: string;

	@IsNumber()
	total: number;

	@IsInt()
	customerId: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateOrderDetailDto)
	order_details: CreateOrderDetailDto[];
}
