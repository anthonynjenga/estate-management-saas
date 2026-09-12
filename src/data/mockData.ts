import type { Unit, PaymentRecord, Expense, BudgetItem, ReminderTemplate, Estate, ServiceChargeFormula } from '../types';

export const initialEstate: Estate = {
  id: 'est-001',
  name: 'Highview Ridge & Gardens Estate',
  location: 'Nairobi Westlands & Kilimani Edge',
  currency: 'KES',
  totalUnits: 48,
  managerName: 'Zuberi Quaye (Lead Property Mgr)',
  managerEmail: 'management@estate-demo.invalid',
  managerPhone: '+254 700 000 000',
  bankDetails: {
    bankName: 'Demo National Bank',
    accountName: 'Estate General HOA Account',
    accountNumber: '0000-1111-2222',
    paybillNo: '000000 (Account: UnitNo)'
  }
};

export const initialFormula: ServiceChargeFormula = {
  baseRatePerSqFt: 12.5,
  sinkingFundPercentage: 15,
  maintenancePercentage: 55,
  securityLevyFixed: 2500,
  wasteWaterLevyFixed: 1500,
  tenantSurchargePercentage: 5
};

export const initialUnits: Unit[] = [
  {
    id: 'u-101',
    unitNumber: 'A-101',
    block: 'Block A (Azure)',
    ownerName: 'Ching Chang Wambui',
    ownerPhone: '+254 700 000 101',
    ownerEmail: 'ching.chang.wambui@estate-demo.invalid',
    propertyType: 'Apartment',
    sizeSqFt: 1200,
    monthlyServiceCharge: 19000,
    currentBalance: 0,
    paymentStatus: 'Paid',
    daysOverdue: 0,
    riskCategory: 'Low',
    riskScore: 8,
    riskFactors: ['On direct debit', 'Consistently pays on 1st of month'],
    lastPaymentDate: '2026-09-02',
    isRepeatDefaulter: false,
    notes: 'Prompt payer. Prefers receipt via WhatsApp.'
  },
  {
    id: 'u-102',
    unitNumber: 'A-102',
    block: 'Block A (Azure)',
    ownerName: 'Ythza Oti',
    ownerPhone: '+254 700 000 102',
    ownerEmail: 'ythza.oti@estate-demo.invalid',
    propertyType: 'Apartment',
    sizeSqFt: 1450,
    monthlyServiceCharge: 22125,
    currentBalance: 44250,
    paymentStatus: 'Overdue',
    daysOverdue: 42,
    riskCategory: 'Medium',
    riskScore: 64,
    riskFactors: ['2 months overdue balance', 'Slow response to email reminders'],
    lastPaymentDate: '2026-07-28',
    isRepeatDefaulter: false,
    notes: 'Requested extension due to overseas business trip.'
  },
  {
    id: 'u-103',
    unitNumber: 'A-103',
    block: 'Block A (Azure)',
    ownerName: 'Zuberi Quaye',
    ownerPhone: '+254 700 000 103',
    ownerEmail: 'zuberi.quaye@estate-demo.invalid',
    propertyType: 'Penthouse',
    sizeSqFt: 2400,
    monthlyServiceCharge: 34000,
    currentBalance: 102000,
    paymentStatus: 'Overdue',
    daysOverdue: 95,
    riskCategory: 'Critical',
    riskScore: 92,
    riskFactors: ['90+ days arrears', '3 unanswered notices', 'Repeat defaulter list'],
    lastPaymentDate: '2026-05-15',
    isRepeatDefaulter: true,
    notes: 'Escalated to HOA Legal Sub-committee for demand notice.'
  },
  {
    id: 'u-104',
    unitNumber: 'A-104',
    block: 'Block A (Azure)',
    ownerName: 'Kaelen Vance',
    ownerPhone: '+254 700 000 104',
    ownerEmail: 'kaelen.vance@estate-demo.invalid',
    propertyType: 'Apartment',
    sizeSqFt: 1200,
    monthlyServiceCharge: 19000,
    currentBalance: 0,
    paymentStatus: 'Paid',
    daysOverdue: 0,
    riskCategory: 'Low',
    riskScore: 5,
    riskFactors: ['Auto M-Pesa Standing Order'],
    lastPaymentDate: '2026-09-01',
    isRepeatDefaulter: false
  },
  {
    id: 'u-201',
    unitNumber: 'B-201',
    block: 'Block B (Crestview)',
    ownerName: 'Vesper Nyambura',
    ownerPhone: '+254 700 000 201',
    ownerEmail: 'vesper.nyambura@estate-demo.invalid',
    propertyType: 'Duplex',
    sizeSqFt: 1800,
    monthlyServiceCharge: 26500,
    currentBalance: 26500,
    paymentStatus: 'Pending',
    daysOverdue: 12,
    riskCategory: 'Medium',
    riskScore: 48,
    riskFactors: ['Grace period active', 'Usually pays between 10th-15th'],
    lastPaymentDate: '2026-08-14',
    isRepeatDefaulter: false
  },
  {
    id: 'u-202',
    unitNumber: 'B-202',
    block: 'Block B (Crestview)',
    ownerName: 'Zephyrine Kiptoo',
    ownerPhone: '+254 700 000 202',
    ownerEmail: 'zephyrine.k@estate-demo.invalid',
    propertyType: 'Apartment',
    sizeSqFt: 1200,
    monthlyServiceCharge: 19000,
    currentBalance: 0,
    paymentStatus: 'Paid',
    daysOverdue: 0,
    riskCategory: 'Low',
    riskScore: 12,
    riskFactors: ['Cleared on time'],
    lastPaymentDate: '2026-09-04',
    isRepeatDefaulter: false
  },
  {
    id: 'u-203',
    unitNumber: 'B-203',
    block: 'Block B (Crestview)',
    ownerName: 'Balthazar Njeri-Chai',
    ownerPhone: '+254 700 000 203',
    ownerEmail: 'balthazar.chai@estate-demo.invalid',
    propertyType: 'Apartment',
    sizeSqFt: 1350,
    monthlyServiceCharge: 20875,
    currentBalance: 62625,
    paymentStatus: 'Overdue',
    daysOverdue: 75,
    riskCategory: 'High',
    riskScore: 84,
    riskFactors: ['3 months outstanding balance', 'Disputed parking allocation charge'],
    lastPaymentDate: '2026-06-10',
    isRepeatDefaulter: true,
    notes: 'Disputing KES 5,000 late fee component.'
  },
  {
    id: 'u-204',
    unitNumber: 'B-204',
    block: 'Block B (Crestview)',
    ownerName: 'Tariq Hassan-Amani',
    ownerPhone: '+254 700 000 204',
    ownerEmail: 'tariq.h@estate-demo.invalid',
    propertyType: 'Duplex',
    sizeSqFt: 1850,
    monthlyServiceCharge: 27125,
    currentBalance: 0,
    paymentStatus: 'Paid',
    daysOverdue: 0,
    riskCategory: 'Low',
    riskScore: 3,
    riskFactors: ['Paid 6 months in advance'],
    lastPaymentDate: '2026-07-01',
    isRepeatDefaulter: false
  },
  {
    id: 'u-301',
    unitNumber: 'C-301',
    block: 'Block C (Horizon)',
    ownerName: 'Wanjiru & Ching Ltd',
    ownerPhone: '+254 700 000 301',
    ownerEmail: 'info@wanjiruching-demo.invalid',
    propertyType: 'Commercial',
    sizeSqFt: 2100,
    monthlyServiceCharge: 30250,
    currentBalance: 90750,
    paymentStatus: 'Overdue',
    daysOverdue: 88,
    riskCategory: 'High',
    riskScore: 86,
    riskFactors: ['Tenant sublet dispute', 'Cheque bounced in July'],
    lastPaymentDate: '2026-06-02',
    isRepeatDefaulter: true,
    notes: 'First cheque bounced. Requires RTGS transfer only.'
  },
  {
    id: 'u-302',
    unitNumber: 'C-302',
    block: 'Block C (Horizon)',
    ownerName: 'Prof. Ythza Kamau',
    ownerPhone: '+254 700 000 302',
    ownerEmail: 'prof.ythza@estate-demo.invalid',
    propertyType: 'Apartment',
    sizeSqFt: 1200,
    monthlyServiceCharge: 19000,
    currentBalance: 0,
    paymentStatus: 'Paid',
    daysOverdue: 0,
    riskCategory: 'Low',
    riskScore: 6,
    riskFactors: ['Reliable pensioner'],
    lastPaymentDate: '2026-09-03',
    isRepeatDefaulter: false
  },
  {
    id: 'u-303',
    unitNumber: 'C-303',
    block: 'Block C (Horizon)',
    ownerName: 'Chloe Dupont-Wambui',
    ownerPhone: '+254 700 000 303',
    ownerEmail: 'chloe.wambui@estate-demo.invalid',
    propertyType: 'Apartment',
    sizeSqFt: 1250,
    monthlyServiceCharge: 19625,
    currentBalance: 19625,
    paymentStatus: 'Pending',
    daysOverdue: 5,
    riskCategory: 'Low',
    riskScore: 22,
    riskFactors: ['Minor delay this month'],
    lastPaymentDate: '2026-08-05',
    isRepeatDefaulter: false
  },
  {
    id: 'u-401',
    unitNumber: 'V-01',
    block: 'Villa Zone (Royal Oaks)',
    ownerName: 'Ambassador Sterling Oti',
    ownerPhone: '+254 700 000 401',
    ownerEmail: 'sterling.oti@estate-demo.invalid',
    propertyType: 'Villa',
    sizeSqFt: 3500,
    monthlyServiceCharge: 47750,
    currentBalance: 0,
    paymentStatus: 'Paid',
    daysOverdue: 0,
    riskCategory: 'Low',
    riskScore: 2,
    riskFactors: ['Corporate embassy account'],
    lastPaymentDate: '2026-09-01',
    isRepeatDefaulter: false
  },
  {
    id: 'u-402',
    unitNumber: 'V-02',
    block: 'Villa Zone (Royal Oaks)',
    ownerName: "Chief Executive Ndung'u-Zheng",
    ownerPhone: '+254 700 000 402',
    ownerEmail: 'ndungu.zheng@estate-demo.invalid',
    propertyType: 'Villa',
    sizeSqFt: 3800,
    monthlyServiceCharge: 51500,
    currentBalance: 154500,
    paymentStatus: 'Overdue',
    daysOverdue: 110,
    riskCategory: 'Critical',
    riskScore: 96,
    riskFactors: ['110 days overdue', 'Ignore legal notices', 'High balance accumulator'],
    lastPaymentDate: '2026-05-01',
    isRepeatDefaulter: true,
    notes: 'Gate barrier remote control suspended per HOA bylaws.'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-101',
    unitId: 'u-101',
    unitNumber: 'A-101',
    residentName: 'Ching Chang Wambui',
    amountPaid: 19000,
    paymentDate: '2026-09-02',
    method: 'Direct Debit',
    referenceNo: 'DD-992019',
    invoiceMonth: '2026-09',
    status: 'Completed'
  },
  {
    id: 'pay-104',
    unitId: 'u-104',
    unitNumber: 'A-104',
    residentName: 'Kaelen Vance',
    amountPaid: 19000,
    paymentDate: '2026-09-01',
    method: 'M-Pesa',
    referenceNo: 'RHS89201KS',
    invoiceMonth: '2026-09',
    status: 'Completed'
  },
  {
    id: 'pay-202',
    unitId: 'u-202',
    unitNumber: 'B-202',
    residentName: 'Zephyrine Kiptoo',
    amountPaid: 19000,
    paymentDate: '2026-09-04',
    method: 'M-Pesa',
    referenceNo: 'RHT10294LL',
    invoiceMonth: '2026-09',
    status: 'Completed'
  },
  {
    id: 'pay-204',
    unitId: 'u-204',
    unitNumber: 'B-204',
    residentName: 'Tariq Hassan-Amani',
    amountPaid: 81375, // 3 months prepaid
    paymentDate: '2026-07-01',
    method: 'Bank Transfer',
    referenceNo: 'FT2618293019',
    invoiceMonth: '2026-09',
    status: 'Completed'
  },
  {
    id: 'pay-302',
    unitId: 'u-302',
    unitNumber: 'C-302',
    residentName: 'Prof. Ythza Kamau',
    amountPaid: 19000,
    paymentDate: '2026-09-03',
    method: 'M-Pesa',
    referenceNo: 'RHU49201MM',
    invoiceMonth: '2026-09',
    status: 'Completed'
  },
  {
    id: 'pay-401',
    unitId: 'u-401',
    unitNumber: 'V-01',
    residentName: 'Ambassador Sterling Oti',
    amountPaid: 47750,
    paymentDate: '2026-09-01',
    method: 'Bank Transfer',
    referenceNo: 'EFT-EMB-9021',
    invoiceMonth: '2026-09',
    status: 'Completed'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-001',
    title: 'Monthly Security Guard Services (24/7 Gate & Patrol)',
    category: 'Security',
    amount: 185000,
    vendor: 'AlphaGuard Patrol Solutions Ltd',
    date: '2026-09-01',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receiptFileName: 'AlphaGuard_Invoice_Sep2026.pdf',
    notes: '12 guards, 2 shifts, canine night patrol included.'
  },
  {
    id: 'exp-002',
    title: 'Common Area Electricity Bill (Lifts, Compound Lighting)',
    category: 'Utilities',
    amount: 94200,
    vendor: 'Metro Power Utility',
    date: '2026-09-03',
    paymentMethod: 'M-Pesa Paybill',
    status: 'Paid',
    receiptFileName: 'MetroPower_Receipt_881920.pdf'
  },
  {
    id: 'exp-003',
    title: 'Standby Generator Diesel Tank Refill (500 Liters)',
    category: 'Utilities',
    amount: 91500,
    vendor: 'TotalEnergies Fuel Depot',
    date: '2026-08-28',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receiptFileName: 'Total_Diesel_Inv_441.pdf'
  },
  {
    id: 'exp-004',
    title: 'Swimming Pool & Clubhouse Landscaping Maintenance',
    category: 'Landscaping',
    amount: 45000,
    vendor: 'GreenThumb Services',
    date: '2026-09-05',
    paymentMethod: 'Bank Transfer',
    status: 'Approved',
    receiptFileName: 'GreenThumb_Sep_Inv.pdf'
  },
  {
    id: 'exp-005',
    title: 'Elevator Quarter 3 Servicing & Safety Certificate',
    category: 'Repairs & Maintenance',
    amount: 120000,
    vendor: 'Apex Lifts Ltd',
    date: '2026-08-20',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receiptFileName: 'ApexLifts_Q3_Cert.pdf'
  },
  {
    id: 'exp-006',
    title: 'Estate Management Software & Portal License',
    category: 'Administrative',
    amount: 35000,
    vendor: 'EstatePro Cloud Systems',
    date: '2026-09-01',
    paymentMethod: 'Credit Card',
    status: 'Paid',
    receiptFileName: 'EstatePro_Subscription.pdf'
  }
];

export const initialBudgets: BudgetItem[] = [
  {
    id: 'bud-01',
    category: 'Security',
    budgetedAmount: 200000,
    actualAmount: 185000,
    notes: 'Includes guards, CCTV cloud storage, gate barrier maintenance.'
  },
  {
    id: 'bud-02',
    category: 'Utilities',
    budgetedAmount: 180000,
    actualAmount: 185700,
    notes: 'Common area lighting, borehole water pump electricity, diesel fuel.'
  },
  {
    id: 'bud-03',
    category: 'Landscaping',
    budgetedAmount: 50000,
    actualAmount: 45000,
    notes: 'Lawn mowing, tree trimming, pool chemical treatments.'
  },
  {
    id: 'bud-04',
    category: 'Repairs & Maintenance',
    budgetedAmount: 150000,
    actualAmount: 120000,
    notes: 'Plumbing leak fixes, lift servicing, exterior light bulb replacements.'
  },
  {
    id: 'bud-05',
    category: 'Administrative',
    budgetedAmount: 60000,
    actualAmount: 35000,
    notes: 'Management software, audit fees, printing notices, secretary stipend.'
  },
  {
    id: 'bud-06',
    category: 'Sinking Fund Capital',
    budgetedAmount: 160000,
    actualAmount: 160000,
    notes: 'Monthly allocation set aside in high-yield fixed deposit for roof/lift overhaul.'
  }
];

export const defaultReminderTemplates: ReminderTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Gentle Friendly Reminder',
    channel: 'SMS',
    tone: 'Polite',
    content: 'Dear {{resident_name}}, friendly reminder that service charge for Unit {{unit_no}} ({{amount_due}} {{currency}}) was due on {{due_date}}. Pay via Paybill {{paybill}} Acc: {{unit_no}}. Thank you! - {{estate_name}}'
  },
  {
    id: 'tpl-2',
    title: 'Firm Payment Overdue Notice',
    channel: 'SMS',
    tone: 'Firm',
    content: 'NOTICE: Unit {{unit_no}} has an outstanding service charge of {{amount_due}} {{currency}} overdue by {{days_overdue}} days. Kindly clear balance by {{due_date}} to avoid late penalty fees. - Management {{estate_name}}'
  },
  {
    id: 'tpl-3',
    title: 'Formal Email Outstanding Statement',
    channel: 'Email',
    tone: 'Formal',
    subject: 'Statement of Account - Service Charge Overdue for Unit {{unit_no}}',
    content: `Dear {{resident_name}},

We hope this email finds you well.

This is an official communication from the Management Committee of {{estate_name}} regarding the service charge balance for Unit {{unit_no}}.

ACCOUNT SUMMARY:
- Unit Number: {{unit_no}}
- Owner / Resident: {{resident_name}}
- Total Outstanding Balance: {{amount_due}} {{currency}}
- Days Overdue: {{days_overdue}} Days

Service charges are vital to maintaining estate security, water supply, landscaping, elevator operations, and overall property valuation.

PAYMENT OPTIONS:
1. Bank Transfer: {{bank_name}} | Acc: {{account_no}} | Name: {{account_name}}
2. M-Pesa Paybill: {{paybill}} | Account Reference: {{unit_no}}

Please provide your transaction receipt or reference code to {{manager_email}} once payment is completed.

Warm regards,
{{manager_name}}
Estate Management Office | {{estate_name}}`
  },
  {
    id: 'tpl-4',
    title: 'Final Pre-Legal Demand Notice',
    channel: 'Notice',
    tone: 'Legal',
    subject: 'FINAL DEMAND NOTICE: Unpaid Service Charges for Unit {{unit_no}}',
    content: `MEMORANDUM & FORMAL DEMAND NOTICE

TO: {{resident_name}} (Unit {{unit_no}})
FROM: Board of Directors & Management Committee, {{estate_name}}
DATE: {{current_date}}
SUBJECT: FINAL NOTICE BEFORE LEGAL ESCALATION & ACCESS SUSPENSION

TOTAL OVERDUE BALANCE: {{amount_due}} {{currency}}
DAYS IN DEFAULT: {{days_overdue}} Days

TAKE NOTICE that despite multiple previous written reminders, your service charge account for Unit {{unit_no}} remains severely delinquent.

CONSEQUENCES OF CONTINUED NON-PAYMENT WITHIN 7 DAYS:
1. Deactivation of automatic gate access tags / remote control access.
2. Suspension of non-essential common amenities (Clubhouse, Gym, Swimming Pool).
3. Publishing of Unit Number on the Estate Defaulters Roster per HOA Bylaw Section 14.2.
4. Immediate referral to external legal counsel for debt recovery court proceedings, with all legal costs accrued to your account.

To prevent these actions, immediate settlement of {{amount_due}} {{currency}} must be executed on or before {{due_date}}.

Signed for and on behalf of {{estate_name}} HOA Board,
__________________________
{{manager_name}} (Managing Director)`
  }
];
