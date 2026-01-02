import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantsService } from '../../tenants/tenants.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantsService: TenantsService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const tenantKey = req.headers['x-tenant-id'] as string;
    console.log("🚀 ~ TenantMiddleware ~ use ~ tenantKey:", tenantKey)
    
    if (!tenantKey) {
      throw new ForbiddenException('X-Tenant-Id header missing');
    }

    const tenant = await this.tenantsService.findByKey(tenantKey);

    if (!tenant) {
      throw new ForbiddenException('Invalid tenant');
    }

    // attach tenant to request
    (req as any).tenant = tenant;

    next();
  }
}
