import { Module } from '@nestjs/common';
import { QueuesModule } from '../queues/queues.module';
import { OutboxWorker } from 'src/outbox/outbox.worker';

@Module({
  imports: [QueuesModule],
  providers: [OutboxWorker],
})
export class WorkersModule {}
