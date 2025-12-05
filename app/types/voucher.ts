export interface Voucher {
  id: string;
  titleSuffix: string;
  paymentType: 'cash' | 'bank_transfer';
  voucherHeading: string;
  voucherNumber: string;
  date: string;
  accountHead: string;
  payTo: string;
  sumOfRs: string;
  towards: string;
  amount: number;
  preparedBy: string;
  checkedBy: string;
  approvedBy: string;
  receivedBy: string;
  createdAt: number;
}

