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
    // allow auth routes without tenant
    if (req.path.startsWith('/auth')) {
      return next();
    }

    const tenantKey = req.headers['x-tenant-id'] as string;

    if (!tenantKey) {
      throw new ForbiddenException('X-Tenant-Id header missing');
    }

    const tenant = await this.tenantsService.findByKey(tenantKey);

    if (!tenant) {
      throw new ForbiddenException('Invalid tenant');
    }

    (req as any).tenant = tenant;
    next();
  }
}
