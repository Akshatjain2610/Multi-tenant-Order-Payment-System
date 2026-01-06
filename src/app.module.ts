import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { OutboxModule } from './outbox/outbox.module';
import { QueuesModule } from './queues/queues.module';
import { TenantsModule } from './tenants/tenants.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TenantThrottlerGuard } from './common/guards/tenant-throttler.guard';
import { DebugController } from './debug/debug.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Admin@1234',
      database: 'nest_app',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ dev only
    }),
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 3,
    },
    {
      name: 'medium',
      ttl: 10000,
      limit: 20
    },
    {
      name: 'long',
      ttl: 60000,
      limit: 100
    }]),
    UsersModule,
    AuthModule,
    OrdersModule,
    PaymentsModule,
    OutboxModule,
    QueuesModule,
    TenantsModule
  ],
  // controllers: [AppController],
  providers: [{
    provide: APP_GUARD,
    useClass: TenantThrottlerGuard
  }],
  controllers: [DebugController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'tenants', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
