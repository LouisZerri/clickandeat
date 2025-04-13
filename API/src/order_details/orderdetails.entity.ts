import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Orders } from 'src/order/order.entity';
import { FoodItems } from 'src/food_items/fooditems.entity';

@Entity()
export class OrderDetails {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('float')
	food_item_price: number;

	@Column()
	quantity: number;

	@ManyToOne(() => Orders, (order) => order.order_details)
	@JoinColumn({ name: 'orderId' })
	order: Orders;

	@ManyToOne(() => FoodItems, (foodItem) => foodItem.order_details)
	@JoinColumn({ name: 'fooditemsId' })
	food_item: FoodItems;
}
