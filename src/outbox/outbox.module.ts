import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEvent } from './outbox.entity';
import { QueuesModule } from 'src/queues/queues.module';
import { OutboxPublisher } from './outbox.publisher';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxProcessor } from './outbox.processor';
import { WorkersModule } from 'src/workers/workers.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([OutboxEvent]), 
    QueuesModule, WorkersModule
  ],
  providers: [OutboxService, OutboxPublisher, OutboxProcessor],
  exports: [OutboxService],
})
export class OutboxModule {}