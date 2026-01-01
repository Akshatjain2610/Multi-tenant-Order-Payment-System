import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        private readonly usersService: UsersService,
    ) { }

    async create(
        tenantId: string,
        userId: number,
        dto: CreateOrderDto,
    ): Promise<OrderResponseDto> {
        const user = await this.usersService.findById(tenantId, userId);

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const order = this.orderRepo.create({
            tenantId,
            user,
            amount: dto.amount,
            status: 'CREATED',
        });

        const saved = await this.orderRepo.save(order);

        return {
            id: saved.id,
            amount: Number(saved.amount),
            status: saved.status,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }


    async findAll(tenantId: string): Promise<OrderResponseDto[]> {
        const orders = await this.orderRepo.find({
            where: { tenantId },
            relations: ['user'],
        });

        return orders.map(order => ({
            id: order.id,
            amount: Number(order.amount),
            status: order.status,
            user: {
                id: order.user.id,
                email: order.user.email,
            },
        }));
    }

    async findById(tenantId: string, orderId: number): Promise<OrderResponseDto[]> {
        return await this.orderRepo.find({
            where: { id: orderId, tenantId },
            relations: ['user'],
        });
    }

    async findEntityById(
        tenantId: string,
        orderId: number,
    ): Promise<Order | null> {
        return this.orderRepo.findOne({
            where: { id: orderId, tenantId },
        });
    }
}
