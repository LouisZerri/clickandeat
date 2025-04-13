import { Injectable } from "@nestjs/common";
import { Customer } from "./customer.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>
    ){ }

    findAll(): Promise<Customer[]> {
        return this.customerRepository.find();
    }
}