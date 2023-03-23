import { Injectable, Inject } from '@nestjs/common';
import { WalletDto } from 'src/domain/dto/WalletDto';
import WalletEntity from 'src/domain/entity/WalletEntity';
import { WalletRepository } from 'src/domain/repository/WalletRepository';
import { WalletModel } from '../database/model/WalletModel';

@Injectable()
export class WalletDatabaseRepository implements WalletRepository {
  constructor(@Inject('wallet') private walletModel: typeof WalletModel) {}

  async save(walletDto: WalletDto): Promise<void> {
    await this.walletModel.create(walletDto);
  }

  async getAll(transactionDto: WalletDto): Promise<WalletEntity[]> {
    const findWallet = await this.walletModel.findAll({
      attributes: ['value'],
      where: {
        idAccount: transactionDto?.idAccount,
      },
    });

    return findWallet;
  }

  async getOne(transactionDto: WalletDto): Promise<WalletEntity> {
    const findWallet = await this.walletModel.findOne({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { ...transactionDto },
    });

    return findWallet?.dataValues;
  }

  async update(idAccount: number, values: WalletEntity): Promise<void> {
    await this.walletModel.update(values, {
      where: { idAccount },
    });
  }
}
