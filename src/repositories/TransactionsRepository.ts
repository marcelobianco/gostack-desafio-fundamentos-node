import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const transactions = this.transactions;
    const { income, outcome } = transactions.reduce((accumulator, transaction) => {
      switch(transaction.type) {
        case "income":
          accumulator.income += Number(transaction.value);
          break;
        case "outcome":
          accumulator.outcome += Number(transaction.value);
          break;
        default:
          break;
      }
    return accumulator;
    },{
      income: 0,
      outcome: 0,
      total: 0,
    },);
    const total = income - outcome;

    return {income, outcome, total};
  }

  public create({ title, value, type}: CreateTransactionDTO): Transaction {
    const { total } = this.getBalance();

    if (type === 'outcome' && total < value) {
      throw new Error('BROKEN');
    }

    const transaction = new Transaction({
      title,
      value,
      type,
    });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
