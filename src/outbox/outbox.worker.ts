import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('outbox')
export class OutboxWorker extends WorkerHost {
    constructor() {
        super();
        console.log('👷 OUTBOX WORKER INITIALIZED');
    }

    async process(job: Job) {
        const event = job.data;
        console.log("🚀 ~ OutboxWorker ~ process ~ job.data:", job.data)
        console.log("🚀 ~ OutboxWorker ~ process ~ event:", event)

        // simulate failure
        if (event.type === 'PAYMENT_SUCCESS_FAIL') {
            throw new Error('Simulated failure');
        }

        console.log('EVENT PROCESSED:', event.type, event.payload);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, err: Error) {
        console.error(
            'JOB FAILED:',
            job.id,
            'attempts:',
            job.attemptsMade,
            err.message,
        );
    }
}
