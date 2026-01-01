import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { OutboxService } from 'src/outbox/outbox.service';

@Injectable()
export class PaymentsService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,
        private readonly ordersService: OrdersService,
        private readonly outboxService: OutboxService
    ) { }

    async create(
        tenantId: string,
        orderId: number,
        dto: CreatePaymentDto,
    ): Promise<PaymentResponseDto> {
        return this.dataSource.transaction(async manager => {
            // 1️⃣ Order ENTITY lao (NOT DTO)
            const order = await this.ordersService.findEntityById(
                tenantId,
                orderId,
            );

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            // 2️⃣ Idempotency check
            const existing = await manager.findOne(Payment, {
                where: {
                    tenantId,
                    idempotencyKey: dto.idempotencyKey,
                },
            });

            if (existing) {
                return {
                    id: existing.id,
                    orderId: existing.orderId,
                    amount: Number(existing.amount),
                    status: existing.status,
                };
            }

            // 3️⃣ Create payment (ENTITY only)
            const payment = manager.create(Payment, {
                tenantId,
                orderId: order.id,
                order,
                amount: dto.amount,
                status: 'PENDING',
                idempotencyKey: dto.idempotencyKey,
            });

            const saved = await manager.save(payment);

            // throw new Error('FORCED FAILURE AFTER SAVE');

            // 4️⃣ Simulate success
            saved.status = 'SUCCESS';
            await manager.save(saved);

            await this.outboxService.add(manager, {
                aggregate: 'payment',
                type: 'PAYMENT_SUCCESS',
                payload: {
                    paymentId: saved.id,
                    orderId: order.id,
                    amount: saved.amount,
                },
            });

            return {
                id: saved.id,
                orderId: saved.orderId,
                amount: Number(saved.amount),
                status: saved.status,
            };
        });
    }
}
