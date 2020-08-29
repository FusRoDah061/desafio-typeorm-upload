import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface ListTransactionsDTO {
  transactions: Transaction[];
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}

export default class ListTransactionsService {
  public async execute(): Promise<ListTransactionsDTO> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionRepository.find({
      relations: ['category'],
    });
    const balance = await transactionRepository.getBalance();

    const transactionsWithoutCategoryId = transactions.map(transaction => {
      // eslint-disable-next-line no-param-reassign
      delete transaction.category_id;
      return transaction;
    });

    return {
      transactions: transactionsWithoutCategoryId,
      balance,
    };
  }
}
