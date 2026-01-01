import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxEvent } from './outbox.entity';
import { OutboxPublisher } from './outbox.publisher';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OutboxProcessor {
    constructor(
        @InjectRepository(OutboxEvent)
        private readonly repo: Repository<OutboxEvent>,
        private readonly publisher: OutboxPublisher,
    ) { }

    @Cron('*/5 * * * * *') // every 5 sec
    async processPending() {
        console.log('🔥 OUTBOX CRON RUNNING');
        const events = await this.repo.find({
            where: { status: 'PENDING' },
            take: 10,
        });
        console.log('📦 PENDING EVENTS:', events.length);

        for (const event of events) {
            console.log('➡️ Publishing event:', event.id);

            await this.publisher.publish(event);

            event.status = 'PROCESSED';
            await this.repo.save(event);
        }
    }
}
