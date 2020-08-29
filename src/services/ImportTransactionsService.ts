/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import fs from 'fs';
import csvParse from 'csv-parse';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  public async execute(csvFileName: string): Promise<Transaction[]> {
    const csvPath = path.join(uploadConfig.directory, csvFileName);
    const csvTransactions = await this.loadCsv(csvPath);
    const createTransaction = new CreateTransactionService();
    const createdTransactions: Transaction[] = [];

    for (const transaction of csvTransactions) {
      const [title, type, value, categoryTitle] = transaction;
      const newTransaction = await createTransaction.execute({
        title,
        type,
        value,
        categoryTitle,
      });

      createdTransactions.push(newTransaction);
    }

    return createdTransactions;
  }

  private async loadCsv(filePath: string): Promise<any[]> {
    const readCsvStream = fs.createReadStream(filePath);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCsv = readCsvStream.pipe(parseStream);
    const lines: any[] = [];

    parseCsv.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCsv.on('end', resolve);
    });

    return lines;
  }
}

export default ImportTransactionsService;
