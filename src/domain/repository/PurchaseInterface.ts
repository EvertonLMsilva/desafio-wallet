import { PurchaseDto } from "src/Dto/PurchaseDto";

export interface PurchaseInterface {
    createPurchase(purchaseDto: PurchaseDto): Promise<any>;
}