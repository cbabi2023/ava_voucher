export interface Voucher {
  id: string;
  companySuffix: string; // Optional company name after AVA (e.g., "Productions", "Entertainments")
  paymentType: 'cash' | 'bank_transfer' | 'upi';
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

