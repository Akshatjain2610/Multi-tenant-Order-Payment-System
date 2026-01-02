import {
  Controller,
  Post,
  Get,
  Body,
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
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(
    @Request() req,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(
      req.tenant.key,
      req.user.userId,
      dto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.ordersService.findAll(req.tenant.key);
  }
}
