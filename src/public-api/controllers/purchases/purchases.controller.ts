import { Controller, Get, HttpException, HttpStatus, Logger, Param, Res, UseGuards } from "@nestjs/common";
import { AuthTokenData } from "src/public-api/authentication/dtos/AuthTokenData.dto";
import { LocalAuthGuard } from "src/public-api/authentication/local.auth.guard";
import { TokenData } from "src/public-api/authentication/tokenData.decorator";
import { PurchasesManagerService } from 'src/public-api/purchasesManager.service';
import { RolesAccess } from 'src/public-api/roles/roles.decorator';
import { RolesGuard } from 'src/public-api/roles/roles.guard';
import { ROLES } from 'src/public-api/users/users.entity';

@Controller()
export class PurchasesController {
    private logger = new Logger(this.constructor.name);
    constructor(private purchasesManagerService: PurchasesManagerService) {};

    @UseGuards(LocalAuthGuard, RolesGuard)
    @RolesAccess(ROLES.STANDARD_USER)
    @Get('purchases')
    async getPurchases() {
        let result;
        try {
            result = await this.purchasesManagerService.getPurchases();
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
        return result;
    } 

}
