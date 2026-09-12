import React, { useState } from 'react';
import { EstateProvider, useEstate } from './context/EstateContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AICopilot } from './components/AICopilot';
import { CollectionDashboard } from './components/CollectionDashboard';
import { ServiceChargeCalculator } from './components/ServiceChargeCalculator';
import { ArrearsTracker } from './components/ArrearsTracker';
import { DefaulterClassification } from './components/DefaulterClassification';
import { PaymentReminderGenerator } from './components/PaymentReminderGenerator';
import { SMSReminderTemplates } from './components/SMSReminderTemplates';
import { EmailReminderGenerator } from './components/EmailReminderGenerator';
import { CommitteeReportGenerator } from './components/CommitteeReportGenerator';
import { BudgetCalculator } from './components/BudgetCalculator';
import { ExpenseTracker } from './components/ExpenseTracker';
import { UnitDetailsModal } from './components/UnitDetailsModal';
import { AddUnitModal } from './components/AddUnitModal';
import { LogPaymentModal } from './components/LogPaymentModal';
import { VacateResidentModal } from './components/VacateResidentModal';
import type { Unit } from './types';

const AppContent: React.FC = () => {
  const { activeTab } = useEstate();

  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [isLogPaymentOpen, setIsLogPaymentOpen] = useState(false);
  const [vacateUnitTarget, setVacateUnitTarget] = useState<Unit | null>(null);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CollectionDashboard />;
      case 'calculator':
        return <ServiceChargeCalculator />;
      case 'arrears':
        return <ArrearsTracker onOpenVacateModal={(u) => setVacateUnitTarget(u)} />;
      case 'defaulters':
        return <DefaulterClassification onOpenVacateModal={(u) => setVacateUnitTarget(u)} />;
      case 'reminders':
        return <PaymentReminderGenerator />;
      case 'sms':
        return <SMSReminderTemplates />;
      case 'email':
        return <EmailReminderGenerator />;
      case 'committee':
        return <CommitteeReportGenerator />;
      case 'budget':
        return <BudgetCalculator />;
      case 'expenses':
        return <ExpenseTracker />;
      default:
        return <CollectionDashboard />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
      {/* Navbar */}
      <Header
        onOpenAddUnit={() => setIsAddUnitOpen(true)}
        onOpenLogPayment={() => setIsLogPaymentOpen(true)}
      />

      {/* Main Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic Content Workspace */}
        <main style={{ flex: 1, padding: '28px', maxWidth: '1600px', margin: '0 auto', width: '100%', minWidth: 0 }}>
          {renderActiveTab()}
        </main>
      </div>

      {/* Floating AI Copilot Assistant */}
      <AICopilot />

      {/* Modals */}
      <UnitDetailsModal onOpenVacateModal={(u) => setVacateUnitTarget(u)} />
      <AddUnitModal isOpen={isAddUnitOpen} onClose={() => setIsAddUnitOpen(false)} />
      <LogPaymentModal isOpen={isLogPaymentOpen} onClose={() => setIsLogPaymentOpen(false)} />
      <VacateResidentModal unit={vacateUnitTarget} isOpen={!!vacateUnitTarget} onClose={() => setVacateUnitTarget(null)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <EstateProvider>
      <AppContent />
    </EstateProvider>
  );
};

export default App;
