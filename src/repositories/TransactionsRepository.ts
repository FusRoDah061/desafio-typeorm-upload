import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.reduce((total, currentTransaction) => {
      return (
        total +
        Number(
          currentTransaction.type === 'income' ? currentTransaction.value : 0.0,
        )
      );
    }, 0.0);

    const outcome = transactions.reduce((total, currentTransaction) => {
      return (
        total +
        Number(
          currentTransaction.type === 'outcome'
            ? currentTransaction.value
            : 0.0,
        )
      );
    }, 0.0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
