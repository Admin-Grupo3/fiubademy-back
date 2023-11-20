import { Injectable, Logger } from "@nestjs/common";
import { PurchasesService } from "./purchases/purchases.service";

@Injectable()
export class PurchasesManagerService {
    private logger = new Logger(this.constructor.name);
    constructor(private readonly purchasesService: PurchasesService) {};
    
    async getPurchases() {
        this.logger.log(`getPurchases`);
        return await this.purchasesService.findAll();
    }
}