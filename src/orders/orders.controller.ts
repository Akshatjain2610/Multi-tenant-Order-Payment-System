import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Tenant-Id',
  required: true,
})
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Request() req,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(
      tenantId,
      req.user.userId,
      dto,
    );
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.ordersService.findAll(tenantId);
  }
}
