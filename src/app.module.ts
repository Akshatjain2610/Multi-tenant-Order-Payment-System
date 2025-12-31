import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';

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
    UsersModule,
    AuthModule,
    OrdersModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
