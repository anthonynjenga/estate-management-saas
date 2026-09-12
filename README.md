# Estate Management Pro SaaS Toolkit 🏢

An enterprise-grade, modern SaaS application for property managers, homeowners associations (HOA), and residential estate committees. Built with React, TypeScript, Vite, and custom CSS design system with glassmorphism aesthetics.

[![GitHub Repository](https://img.shields.io/badge/GitHub-estate--management--saas-blue?style=flat-square&logo=github)](https://github.com/anthonynjenga/estate-management-saas)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Vite%20%7C%20Recharts-6366f1?style=flat-square)](https://vitejs.dev/)

---

## 🌟 Key Features

1. **Service-Charge Calculator**
   - Automated allocation by square footage, occupancy count, or fixed unit split.
   - Real-time unit tiering and total budget distribution.

2. **Arrears Tracker & Vacate Resident Management**
   - Live roster of unit accounts, balances, payment history, and aging buckets.
   - Comprehensive resident vacancy modal to mark units vacant, onboard new tenants, or remove units cleanly.

3. **Defaulter Risk Engine & Classification**
   - Multi-factor risk scoring algorithm assessing overdue duration, repeat offences, and payment velocity.
   - Automated risk categorization (Low, Moderate, Severe, High Risk).

4. **Monthly Collection Dashboard**
   - Interactive financial analytics with Recharts visual trend graphs.
   - KPI metric cards for total collections, pending arrears, collection rate %, and active defaulters.

5. **Payment Reminder Studio**
   - Customizable letter & notice generator with dynamic placeholder tags (`{{unit_no}}`, `{{owner_name}}`, `{{balance}}`).
   - Printable formal demand notice formatting.

6. **SMS & WhatsApp Reminder Center**
   - Quick-send SMS and WhatsApp direct links (`wa.me`) with character counters and template tuner.

7. **Email Reminder Builder**
   - Professional HTML email statement builder with responsive mobile/desktop client previews and send simulator.

8. **Monthly Committee AGM Report Generator**
   - Executive summary builder with financial overview, maintenance logs, and defaulter analysis.
   - Instant printable HTML/PDF report template with clean header styling.

9. **Budget Calculator & Variance Analyzer**
   - Annual/Monthly budget planner with real-time budget vs actual expenditure variance calculation.

10. **Expense Tracker & Smart OCR Scanner**
    - Receipt upload simulation with OCR document parsing for vendor, amount, and category extraction.
    - Vendor registry and expenditure logs.

11. **Copilot Assistant**
    - Floating interactive assistant with quick action shortcuts and collapsible minimization toggle.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anthonynjenga/estate-management-saas.git

# Navigate into project directory
cd estate-management-saas

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173/` in your browser to view the application.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Custom CSS design system (Dark/Light mode, Glassmorphism, HSL color tokens)
- **Charts & Data Viz**: Recharts
- **Icons**: Lucide React
- **Persistence**: Browser LocalStorage state management via `EstateContext`

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
