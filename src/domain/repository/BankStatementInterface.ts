import { DateStatementDto } from "src/Dto/DateStatementDto";

export interface BankStatementInterface {
    findStatement(dateStatement: DateStatementDto): Promise<any>;
}