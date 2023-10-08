import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PublicApiService {
  private logger = new Logger(this.constructor.name);
}
