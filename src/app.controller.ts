import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class PublicAPIController {
  constructor(private readonly appService: AppService) {}
}
