import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderDetails } from 'src/order_details/orderdetails.entity';

@Entity()
export class FoodItems {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('float')
    price: number;

    @OneToMany(() => OrderDetails, (orderDetail) => orderDetail.food_item)
    order_details: OrderDetails[];
}
