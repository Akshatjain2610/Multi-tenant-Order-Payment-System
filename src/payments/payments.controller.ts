import {
    Controller,
    Post,
    Body,
    Headers,
    Param,
    UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Tenant-Id',
  required: true,
})
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    create(
        @Headers('x-tenant-id') tenantId: string,
        @Param('orderId') orderId: number,
        @Body() dto: CreatePaymentDto,
    ) {
        return this.paymentsService.create(
            tenantId,
            Number(orderId),
            dto,
        );
    }
}
