import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OutboxPublisher {
    constructor(
        @InjectQueue('outbox')
        private readonly queue: Queue,
    ) { }

    async publish(event: any) {
        console.log('🚀 ADDING JOB TO QUEUE', event.id);
        await this.queue.add('dispatch', event, {
            attempts: 5, // retry 5 times
            backoff: {
                type: 'exponential',
                delay: 1000
            },
            removeOnComplete: true,
            removeOnFail: false, // DLQ - Dead letter Queue
        });
        console.log('✅ JOB ADDED TO QUEUE');
    }
}
