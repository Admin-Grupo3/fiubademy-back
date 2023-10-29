import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Get,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CategoriesManagerService } from 'src/public-api/categoriesManager.service';
import { LocalAuthGuard } from 'src/public-api/authentication/local.auth.guard';
import { RolesAccess } from 'src/public-api/roles/roles.decorator';
import { RolesGuard } from 'src/public-api/roles/roles.guard';
import { ROLES } from 'src/public-api/users/users.entity';

interface GetCategoriesResult {
  categoriesData: string;
}

@Controller()
export class CategoriesController {
  private logger = new Logger(this.constructor.name);

  constructor(private categoriesManagerService: CategoriesManagerService) {}

  @Get('categories')
  async getAllCategories(@Res() response: Response) {
    let result: GetCategoriesResult;

    try {
      result = await this.categoriesManagerService.getAllCategories();
    } catch (error) {
      this.logger.error(error);
      // check connection error
      if (error.code === 14) {
        throw new HttpException(
          'Service Unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      this.logger.warn(error);
      throw new HttpException(error.details, HttpStatus.BAD_REQUEST);
    }
    return response.send(JSON.parse(result.categoriesData));
  }
}
