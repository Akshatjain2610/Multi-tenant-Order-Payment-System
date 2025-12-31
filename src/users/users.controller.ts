import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    findAll(@Headers('X-tenant-id') tenantId: string) {       
        return this.userService.findAll(tenantId);
    }

    @Post()
    create(@Headers('x-tenant-id') tenantId: string, @Body() createUserDto: CreateUserDto) {
        return this.userService.create(tenantId, createUserDto);
    }
}
