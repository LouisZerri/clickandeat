import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Customer } from 'src/customer/customer.entity';
import { OrderDetails } from 'src/order_details/orderdetails.entity';

@Entity()
export class Orders {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nb_order: string;

	@Column()
	payment_method: string;

	@Column('float')
	total: number;

	@ManyToOne(() => Customer, (customer) => customer.orders)
	@JoinColumn({ name: 'customerId' })
	customer: Customer;

	@OneToMany(() => OrderDetails, (orderDetail) => orderDetail.order, { cascade: true })
	order_details: OrderDetails[];
}
