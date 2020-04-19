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
    const balance = transactions.reduce(
      (amount, { type, value }) => ({
        ...amount,
        [type]: Number(amount[type]) + Number(value),
      }),
      { income: 0, outcome: 0 },
    );

    const { income, outcome } = balance;

    return {
      ...balance,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;

// outra forma de fazer o getBalance
/*
const balance = transactions.reduce(
  (accumulator, transaction) => {
    switch (transaction.type) {
      case 'income':
        accumulator.income += Number(transaction.value);
        break;

      case 'outcome':
        accumulator.outcome += Number(transaction.value);
        break;

      default:
        break;
    }

    return accumulator;
  },
  {
    income: 0,
    outcome: 0,
    total: 0,
  },
);
const total = income - outcome;

return { income, outcome, total}
*/
