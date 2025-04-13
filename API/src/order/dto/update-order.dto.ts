import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateOrderDetailDto } from 'src/order_details/dto/update-order-details.dto';

export class UpdateOrderDto {
    @IsString()
    nb_order: string;

    @IsString()
    payment_method: string;

    @IsNumber()
    total: number;

    @IsNumber()
    customerId: number;

    @ValidateNested({ each: true })
    @Type(() => UpdateOrderDetailDto)
    order_details: UpdateOrderDetailDto[];
}
