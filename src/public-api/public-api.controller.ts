import { Controller, Logger } from '@nestjs/common';
import { PublicApiService } from './public-api.service';

@Controller()
export class PublicApiController {
  private logger = new Logger(this.constructor.name);

  constructor(private publicApiService: PublicApiService) {}
}
