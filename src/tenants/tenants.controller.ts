import { Controller, Post, Body } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @SkipThrottle()
  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto.key);
  }
}
