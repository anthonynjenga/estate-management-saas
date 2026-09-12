import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Unit, PaymentRecord, Expense, BudgetItem, ReminderTemplate, Estate, ServiceChargeFormula, RiskCategory } from '../types';
import { initialEstate, initialFormula, initialUnits, initialPayments, initialExpenses, initialBudgets, defaultReminderTemplates } from '../data/mockData';

interface EstateContextType {
  estate: Estate;
  updateEstate: (updated: Partial<Estate>) => void;
  formula: ServiceChargeFormula;
  updateFormula: (updated: ServiceChargeFormula) => void;
  units: Unit[];
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, updated: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  payments: PaymentRecord[];
  addPayment: (payment: Omit<PaymentRecord, 'id'>) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpenseStatus: (id: string, status: Expense['status']) => void;
  deleteExpense: (id: string) => void;
  budgets: BudgetItem[];
  updateBudget: (id: string, budgeted: number, notes?: string) => void;
  templates: ReminderTemplate[];
  addTemplate: (tpl: Omit<ReminderTemplate, 'id'>) => void;
  updateTemplate: (id: string, tpl: Partial<ReminderTemplate>) => void;
  
  // Active Navigation & Filters
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBlockFilter: string;
  setSelectedBlockFilter: (block: string) => void;
  selectedRiskFilter: string;
  setSelectedRiskFilter: (risk: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Theme & AI Copilot
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  
  // Reset Data
  resetAllData: () => void;

  // Selected Unit for Detail View Modal
  selectedUnitForModal: Unit | null;
  setSelectedUnitForModal: (unit: Unit | null) => void;
  
  // Dynamic Risk Classification recalculator
  recalculateUnitRisk: (unit: Unit) => { riskCategory: RiskCategory; riskScore: number; riskFactors: string[] };
}

const EstateContext = createContext<EstateContextType | undefined>(undefined);

export const EstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Robust LocalStorage helper with schema validation
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`estate_ai_${key}`);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      // If array, ensure non-empty valid array
      if (Array.isArray(fallback) && Array.isArray(parsed)) {
        return parsed as T;
      }
      // If object, merge with fallback defaults
      if (typeof fallback === 'object' && fallback !== null && typeof parsed === 'object' && parsed !== null) {
        return { ...fallback, ...parsed } as T;
      }
      return parsed as T;
    } catch {
      return fallback;
    }
  };

  const [estate, setEstate] = useState<Estate>(() => getStored('estate', initialEstate));
  const [formula, setFormula] = useState<ServiceChargeFormula>(() => getStored('formula', initialFormula));
  const [units, setUnits] = useState<Unit[]>(() => getStored('units', initialUnits));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => getStored('payments', initialPayments));
  const [expenses, setExpenses] = useState<Expense[]>(() => getStored('expenses', initialExpenses));
  const [budgets, setBudgets] = useState<BudgetItem[]>(() => getStored('budgets', initialBudgets));
  const [templates, setTemplates] = useState<ReminderTemplate[]>(() => getStored('templates', defaultReminderTemplates));

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getStored('theme_dark', true));
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [selectedUnitForModal, setSelectedUnitForModal] = useState<Unit | null>(null);

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('estate_ai_estate', JSON.stringify(estate)); }, [estate]);
  useEffect(() => { localStorage.setItem('estate_ai_formula', JSON.stringify(formula)); }, [formula]);
  useEffect(() => { localStorage.setItem('estate_ai_units', JSON.stringify(units)); }, [units]);
  useEffect(() => { localStorage.setItem('estate_ai_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('estate_ai_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('estate_ai_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('estate_ai_templates', JSON.stringify(templates)); }, [templates]);
  useEffect(() => { localStorage.setItem('estate_ai_theme_dark', JSON.stringify(isDarkMode)); }, [isDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Enhanced Risk Score Calculator Logic
  const recalculateUnitRisk = (unit: Unit): { riskCategory: RiskCategory; riskScore: number; riskFactors: string[] } => {
    // If account is settled or in credit, reset overdue days & return low risk
    if (unit.currentBalance <= 0) {
      return {
        riskCategory: 'Low',
        riskScore: Math.min(10, Math.max(0, unit.riskScore > 20 ? 10 : unit.riskScore)),
        riskFactors: unit.currentBalance < 0 ? ['Account in credit (Overpaid)'] : ['Account fully settled']
      };
    }

    let score = 0;
    const factors: string[] = [];

    // Overdue Days Factor
    if (unit.daysOverdue > 90) {
      score += 45;
      factors.push('Critical: Overdue by >90 days');
    } else if (unit.daysOverdue > 60) {
      score += 35;
      factors.push('High: Overdue by 60-90 days');
    } else if (unit.daysOverdue > 30) {
      score += 20;
      factors.push('Moderate: Overdue by 30-60 days');
    } else if (unit.daysOverdue > 0) {
      score += 10;
      factors.push('Recent delay: Under 30 days');
    }

    // Outstanding Amount vs Monthly Ratio
    const ratio = unit.monthlyServiceCharge > 0 ? unit.currentBalance / unit.monthlyServiceCharge : 0;
    if (ratio >= 3) {
      score += 30;
      factors.push(`Heavy arrears ratio (${ratio.toFixed(1)}x monthly charge)`);
    } else if (ratio >= 1.5) {
      score += 15;
      factors.push(`Accumulating arrears (${ratio.toFixed(1)}x monthly charge)`);
    }

    // Repeat Defaulter
    if (unit.isRepeatDefaulter) {
      score += 25;
      factors.push('History of repeated payment default');
    }

    score = Math.min(100, Math.max(0, score));

    let category: RiskCategory = 'Low';
    if (score >= 85) category = 'Critical';
    else if (score >= 65) category = 'High';
    else if (score >= 35) category = 'Medium';

    return { riskCategory: category, riskScore: score, riskFactors: factors };
  };

  const updateEstate = (updated: Partial<Estate>) => {
    setEstate(prev => ({ ...prev, ...updated }));
  };

  const updateFormula = (updated: ServiceChargeFormula) => {
    setFormula(updated);
    // Recalculate monthly service charges for all units based on size & formula levies
    setUnits(prevUnits => prevUnits.map(u => {
      const sqFtCharge = u.sizeSqFt * updated.baseRatePerSqFt;
      const calcTotal = Math.round(sqFtCharge + updated.securityLevyFixed + updated.wasteWaterLevyFixed);
      return {
        ...u,
        monthlyServiceCharge: calcTotal
      };
    }));
  };

  const addUnit = (newUnitData: Omit<Unit, 'id'>) => {
    const id = `u-${Date.now()}`;
    const unit: Unit = { ...newUnitData, id };
    const { riskCategory, riskScore, riskFactors } = recalculateUnitRisk(unit);
    setUnits(prev => [ ...prev, { ...unit, riskCategory, riskScore, riskFactors } ]);
  };

  const updateUnit = (id: string, updated: Partial<Unit>) => {
    setUnits(prev => prev.map(u => {
      if (u.id !== id) return u;
      const combined = { ...u, ...updated };
      // Ensure daysOverdue is zero if balance is zero or negative
      if (combined.currentBalance <= 0) {
        combined.daysOverdue = 0;
        combined.paymentStatus = 'Paid';
      }
      const { riskCategory, riskScore, riskFactors } = recalculateUnitRisk(combined);
      return { ...combined, riskCategory, riskScore, riskFactors };
    }));
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
    if (selectedUnitForModal?.id === id) {
      setSelectedUnitForModal(null);
    }
  };

  const addPayment = (paymentData: Omit<PaymentRecord, 'id'>) => {
    const id = `pay-${Date.now()}`;
    const newPay: PaymentRecord = { ...paymentData, id };
    setPayments(prev => [newPay, ...prev]);

    // Update Unit currentBalance & payment status with credit support
    setUnits(prevUnits => prevUnits.map(u => {
      // Match strictly by unitId or unitNumber
      if (u.id === paymentData.unitId || (paymentData.unitNumber && u.unitNumber === paymentData.unitNumber)) {
        const newBalance = u.currentBalance - paymentData.amountPaid;
        const newStatus = newBalance <= 0 ? 'Paid' : (newBalance < u.monthlyServiceCharge ? 'Partial' : 'Overdue');
        const daysOverdue = newBalance <= 0 ? 0 : u.daysOverdue;
        const updatedUnit: Unit = {
          ...u,
          currentBalance: newBalance,
          paymentStatus: newStatus,
          daysOverdue,
          lastPaymentDate: paymentData.paymentDate
        };
        const { riskCategory, riskScore, riskFactors } = recalculateUnitRisk(updatedUnit);
        return { ...updatedUnit, riskCategory, riskScore, riskFactors };
      }
      return u;
    }));
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const id = `exp-${Date.now()}`;
    const newExp: Expense = { ...expenseData, id };
    setExpenses(prev => [newExp, ...prev]);

    // Update actual budget spend
    setBudgets(prevBudgets => prevBudgets.map(b => {
      if (b.category === expenseData.category) {
        return { ...b, actualAmount: b.actualAmount + expenseData.amount };
      }
      return b;
    }));
  };

  const updateExpenseStatus = (id: string, status: Expense['status']) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const deleteExpense = (id: string) => {
    const targetExp = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));

    if (targetExp) {
      setBudgets(prevBudgets => prevBudgets.map(b => {
        if (b.category === targetExp.category) {
          return { ...b, actualAmount: Math.max(0, b.actualAmount - targetExp.amount) };
        }
        return b;
      }));
    }
  };

  const updateBudget = (id: string, budgetedAmount: number, notes?: string) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, budgetedAmount, notes: notes ?? b.notes } : b));
  };

  const addTemplate = (tpl: Omit<ReminderTemplate, 'id'>) => {
    const id = `tpl-${Date.now()}`;
    setTemplates(prev => [...prev, { ...tpl, id }]);
  };

  const updateTemplate = (id: string, tpl: Partial<ReminderTemplate>) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...tpl } : t));
  };

  const resetAllData = () => {
    setEstate(initialEstate);
    setFormula(initialFormula);
    setUnits(initialUnits);
    setPayments(initialPayments);
    setExpenses(initialExpenses);
    setBudgets(initialBudgets);
    setTemplates(defaultReminderTemplates);
    localStorage.clear();
  };

  return (
    <EstateContext.Provider value={{
      estate, updateEstate,
      formula, updateFormula,
      units, addUnit, updateUnit, deleteUnit,
      payments, addPayment,
      expenses, addExpense, updateExpenseStatus, deleteExpense,
      budgets, updateBudget,
      templates, addTemplate, updateTemplate,
      activeTab, setActiveTab,
      selectedBlockFilter, setSelectedBlockFilter,
      selectedRiskFilter, setSelectedRiskFilter,
      searchQuery, setSearchQuery,
      isDarkMode, toggleDarkMode,
      isCopilotOpen, setIsCopilotOpen,
      resetAllData,
      selectedUnitForModal, setSelectedUnitForModal,
      recalculateUnitRisk
    }}>
      {children}
    </EstateContext.Provider>
  );
};

export const useEstate = () => {
  const context = useContext(EstateContext);
  if (!context) {
    throw new Error('useEstate must be used within an EstateProvider');
  }
  return context;
};
