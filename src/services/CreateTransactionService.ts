import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import CreateCategoryService from './CreateCategoryService';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: RequestDTO): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type)) {
      throw new AppError(
        "Invalid transaction type. Allowed values are 'income' and 'outcome'",
      );
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Insufficient balance.');
    }

    const categoriesRepository = getRepository(Category);
    let category = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    });

    if (!category) {
      const createCategory = new CreateCategoryService();
      category = await createCategory.execute(categoryTitle);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
