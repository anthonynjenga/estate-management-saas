export type PropertyType = 'Apartment' | 'Villa' | 'Penthouse' | 'Duplex' | 'Commercial';

export type RiskCategory = 'Low' | 'Medium' | 'High' | 'Critical';

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Partial';

export interface Unit {
  id: string;
  unitNumber: string;
  block: string; // e.g. Block A, Block B, Villa Zone
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  propertyType: PropertyType;
  sizeSqFt: number;
  monthlyServiceCharge: number;
  currentBalance: number; // positive = amount owed/arrears, 0 = settled, negative = overpaid
  paymentStatus: PaymentStatus;
  daysOverdue: number;
  riskCategory: RiskCategory;
  riskScore: number; // 0-100
  riskFactors: string[];
  lastPaymentDate?: string;
  isRepeatDefaulter: boolean;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  unitId: string;
  unitNumber: string;
  residentName: string;
  amountPaid: number;
  paymentDate: string;
  method: 'M-Pesa' | 'Bank Transfer' | 'Credit Card' | 'Direct Debit' | 'Cheque';
  referenceNo: string;
  invoiceMonth: string; // YYYY-MM
  status: 'Completed' | 'Pending Verification' | 'Rejected';
}

export type ExpenseCategory = 
  | 'Security' 
  | 'Utilities' 
  | 'Landscaping' 
  | 'Repairs & Maintenance' 
  | 'Administrative' 
  | 'Sinking Fund Capital';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  vendor: string;
  date: string;
  paymentMethod: string;
  status: 'Approved' | 'Pending Approval' | 'Paid';
  receiptUrl?: string;
  receiptFileName?: string;
  notes?: string;
}

export interface BudgetItem {
  id: string;
  category: ExpenseCategory;
  budgetedAmount: number;
  actualAmount: number;
  notes: string;
}

export interface ReminderTemplate {
  id: string;
  title: string;
  channel: 'SMS' | 'Email' | 'Notice';
  tone: 'Polite' | 'Firm' | 'Formal' | 'Legal';
  content: string;
  subject?: string;
}

export interface Estate {
  id: string;
  name: string;
  location: string;
  currency: string;
  totalUnits: number;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    paybillNo?: string;
  };
}

export interface ServiceChargeFormula {
  baseRatePerSqFt: number;
  sinkingFundPercentage: number;
  maintenancePercentage: number;
  securityLevyFixed: number;
  wasteWaterLevyFixed: number;
  tenantSurchargePercentage: number;
}
