import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('debug')
@Throttle({
  default: {
    limit: 2,
    ttl: 60,
  },
})
export class DebugController {
  @Get()
  test() {
    return { ok: true };
  }
}
