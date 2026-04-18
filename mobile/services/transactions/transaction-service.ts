import { ITransaction } from '@/types';
import { getRequest } from '@/utils/http';

export class TransactionService {
  public static async getMyTransactions() {
    return await getRequest<ITransaction[]>('/me/transactions');
  }

  public static async getMyTransactionById(transactionId: string) {
    return await getRequest<ITransaction>(`/me/transactions/${transactionId}`);
  }
}
