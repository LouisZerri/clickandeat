import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Orders } from "./order.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CustomParseIntPipe } from "src/pipes/custom-parse-int.pipe";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";


@ApiTags('orders')
@Controller('api/orders')
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Get()
    @ApiOperation({ summary: 'Liste toutes les commandes' })
    index(): Promise<Orders[]> {
        return this.orderService.findAll()
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Récupérer une commande en fonction de son ID' })
    async show(@Param('id', CustomParseIntPipe) id: number): Promise<Orders> {
        const order = await this.orderService.find(id)
        if (!order) {
            throw new NotFoundException('Commande non trouvée')
        }

        return order
    }

    @Post()
    @ApiOperation({ summary: 'Créer une commande en fonction de son ID' })
    async create(@Body() createOrderDto: CreateOrderDto): Promise<Orders> {
        return await this.orderService.create(createOrderDto)
    }

    @Put(":id")
    @ApiOperation({ summary: 'Mise à jour d\'une commande en fonction de son ID' })
    async update(@Param('id', CustomParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<Orders> {
        return this.orderService.update(id, updateOrderDto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Suppression d\'une commande en fonction de son ID' })
    async delete(@Param('id', CustomParseIntPipe) id: number): Promise<{ message: string }> {
        await this.orderService.delete(Number(id))
        return { message: 'Commande supprimée avec succès' }
    }

}