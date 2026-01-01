import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './payment.entity';
import { OrdersModule } from '../orders/orders.module';
import { OutboxModule } from 'src/outbox/outbox.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), OrdersModule, OutboxModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
