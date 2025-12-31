import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findAll(tenantId: string) {
        return this.userRepository.find({
            where: { tenantId },
            select: ['id', 'email', 'createdAt'],
        });
    }

    async create(tenantId: string, createUserDto: CreateUserDto) {
        const passwordHash = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            tenantId,
            email: createUserDto.email,
            passwordHash
        });
        await this.userRepository.save(user);

        return {
            id: user.id,
            email: user.email,
            tenantId: user.tenantId
        };
    }

    async findByEmail(tenantId: string, email: string) {
        return this.userRepository.findOne({
            where: { tenantId, email },
        });
    }


    async findById(tenantId: string, id: number) {
        return this.userRepository.findOne({
            where: { id, tenantId },
        });
    }
}
