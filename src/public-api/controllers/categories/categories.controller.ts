import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Get,
  Res,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { CategoriesManagerService } from 'src/public-api/categoriesManager.service';
import { LocalAuthGuard } from 'src/public-api/authentication/local.auth.guard';
import { RolesAccess } from 'src/public-api/roles/roles.decorator';
import { RolesGuard } from 'src/public-api/roles/roles.guard';
import { ROLES } from 'src/public-api/users/users.entity';
import { AuthTokenData } from 'src/public-api/authentication/dtos/AuthTokenData.dto';
import { TokenData } from 'src/public-api/authentication/tokenData.decorator';
import { CategoryCreateRequest } from './dtos/categoryCreateRequest';

interface GetCategoriesResult {
  categoriesData: string;
}
interface CreateCategoryResult {
  categoryData: string;
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

  @UseGuards(LocalAuthGuard)
  @Post('categories')
  async createCategory(
    @Body() request: CategoryCreateRequest,
    @TokenData() tokenData: AuthTokenData,
    @Res() response: Response,
  ) {
    console.log(request);
    const { name } = request;
    let result: CreateCategoryResult;

    try {
      result = await this.categoriesManagerService.createCategory(request.name);
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
    return response.send(JSON.parse(result.categoryData));
  }
}
