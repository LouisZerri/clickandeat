import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Orders } from "./order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderDetails } from "src/order_details/orderdetails.entity";
import { Customer } from "src/customer/customer.entity";
import { FoodItems } from "src/food_items/fooditems.entity";
import { Not, In } from 'typeorm';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Orders)
		private orderRepository: Repository<Orders>,

		@InjectRepository(OrderDetails)
		private orderDetailsRepository: Repository<OrderDetails>,

		@InjectRepository(Customer)
		private customerRepository: Repository<Customer>,

		@InjectRepository(FoodItems)
		private foodItemsRepository: Repository<FoodItems>,
	) { }

	findAll(): Promise<Orders[]> {
		return this.orderRepository.find({
			relations: ['customer']
		});
	}

	find(id: number): Promise<Orders | null> {
		return this.orderRepository.findOne({
			where: { id },
			relations: ['customer', 'order_details', 'order_details.food_item'],
		});
	}

	async create(createOrderDto: CreateOrderDto): Promise<Orders> {
		const { nb_order, payment_method, total, customerId, order_details } = createOrderDto;

		const customer = await this.customerRepository.findOne({ where: { id: customerId } });
		if (!customer) throw new NotFoundException("Le client n'a pas été trouvé");

		const order = this.orderRepository.create({
			nb_order,
			payment_method,
			total,
			customer,
		});

		const savedOrder = await this.orderRepository.save(order);

		for (const detail of order_details) {

			const foodItemRef = this.foodItemsRepository.create({ id: detail.fooditemsId });

			const orderDetail = new OrderDetails();
			orderDetail.food_item_price = detail.food_item_price;
			orderDetail.quantity = detail.quantity;
			orderDetail.order = this.orderRepository.create({ id: savedOrder.id });
			orderDetail.food_item = foodItemRef;

			await this.orderDetailsRepository.save(orderDetail);
		}

		const fullOrder = await this.orderRepository.findOne({
			where: { id: savedOrder.id },
			relations: ['customer', 'order_details', 'order_details.food_item'],
		});

		if (!fullOrder) throw new NotFoundException("Commande non retrouvée après la création");

		return fullOrder;
	}

	async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Orders> {

		const order = await this.orderRepository.findOne({
			where: { id },
			relations: ['order_details'],
		});

		if (!order) throw new NotFoundException('Commande non trouvée');

		const { nb_order, payment_method, total, customerId, order_details } = updateOrderDto;

		if (!order_details || order_details.length === 0) {
			throw new BadRequestException("La commande doit contenir au moins un aliment");
		}

		order.nb_order = nb_order;
		order.payment_method = payment_method;
		order.total = total;

		const customer = await this.customerRepository.findOne({ where: { id: customerId } });
		if (!customer) throw new NotFoundException('Client non trouvé');
		order.customer = customer;

		const updatedDetails: OrderDetails[] = [];

		for (const detail of order_details) {

			const foodItem = await this.foodItemsRepository.findOne({ where: { id: detail.fooditemsId } });
			if (!foodItem) throw new NotFoundException('L\'aliment est introuvable');

			if (detail.id) {
				const existingDetail = await this.orderDetailsRepository.findOne({ where: { id: detail.id } });

				if (!existingDetail) {
					throw new NotFoundException("Le détails de la commande est introuvable");
				}

				existingDetail.food_item_price = detail.food_item_price;
				existingDetail.quantity = detail.quantity;
				existingDetail.food_item = foodItem;
				existingDetail.order = order;

				updatedDetails.push(existingDetail);
			} else {
				const newDetail = this.orderDetailsRepository.create({
					food_item_price: detail.food_item_price,
					quantity: detail.quantity,
					food_item: foodItem,
					order,
				});

				updatedDetails.push(newDetail);
			}
		}

		// Supprimer les anciens OrderDetails non inclus dans la requête
		const idsToKeep = order_details.filter(d => d.id).map(d => d.id);
		if (idsToKeep.length > 0) {
			await this.orderDetailsRepository.delete({
				order: { id: order.id },
				id: Not(In(idsToKeep)),
			});
		}

		await this.orderRepository.save(order);
		await this.orderDetailsRepository.save(updatedDetails);

		const updatedOrder = await this.orderRepository.findOne({
			where: { id: order.id },
			relations: ['customer', 'order_details', 'order_details.food_item'],
		});

		if (!updatedOrder) {
			throw new NotFoundException("Commande mise à jour non retrouvée");
		}

		return updatedOrder;
	}


	async delete(id: number): Promise<{ message: string }> {

		const order = await this.orderRepository.findOne({
			where: { id },
			relations: ['order_details'],
		});

		if (!order) {
			throw new NotFoundException(`Commande avec l'id ${id} non trouvée`);
		}

		await this.orderDetailsRepository.delete({ order: { id } });

		await this.orderRepository.delete(id);

		return { message: `Commande ${id} supprimée avec succès` };
	}

}


