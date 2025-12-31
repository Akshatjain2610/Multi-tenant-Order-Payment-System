import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(
        @Headers('x-tenant-id') tenantId: string,
        @Body() dto: LoginDto,
    ) {
        return this.authService.login(tenantId, dto);
    }
}
