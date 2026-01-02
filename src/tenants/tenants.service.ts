import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantsService {
    constructor(
        @InjectRepository(Tenant)
        private readonly repo: Repository<Tenant>,
    ) { }

    findByKey(key: string) {
        return this.repo.findOne({
            where: { key, isActive: true },
        });
    }

    async create(key: string) {
        const tenant = this.repo.create({
            key,
            isActive: true,
        });

        return this.repo.save(tenant);
    }
}
