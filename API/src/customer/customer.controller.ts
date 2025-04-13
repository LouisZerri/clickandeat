import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CustomerService } from "./customer.service";
import { Customer } from "./customer.entity";

@ApiTags('clients')
@Controller('api/customers')
export class CustomerController {

    constructor(private readonly customerService: CustomerService) { }

    @Get()
    @ApiOperation({ summary: 'Liste tout les clients' })
    index(): Promise<Customer[]> {
        return this.customerService.findAll()
    }
}