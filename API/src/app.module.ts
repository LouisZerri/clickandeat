import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { OrderDetailsModule } from './order_details/orderdetails.module';
import { FoodItemsModule } from './food_items/fooditems.module';



@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: 'localhost',
			port: 3306,
			username: 'root',
			password: 'root',
			database: 'clickandeat',
			autoLoadEntities: true,
			//entities: [__dirname + '/**/*.entity{.ts,.js}'],
			synchronize: true,
		}),

		CustomerModule,
		OrderModule,
		OrderDetailsModule,
		FoodItemsModule
	],
})
export class AppModule { }
