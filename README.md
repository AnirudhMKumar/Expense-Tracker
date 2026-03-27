# 💰 Expense Tracker

A full-stack personal finance management application built with modern web technologies. Track your income, expenses, budgets, and recurring transactions all in one place.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Functionality
- **Transactions Management** - Add, edit, delete income/expense transactions with categories
- **Category System** - Organize finances with custom categories (icons, colors, types)
- **Budget Tracking** - Set monthly budget limits per category with progress tracking
- **Recurring Transactions** - Automate bills, subscriptions, and regular income
- **Analytics Dashboard** - Visualize spending patterns with interactive charts

### Pages
| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats, charts, and recent transactions |
| `/transactions` | Full transaction history with filters |
| `/categories` | Manage income/expense categories |
| `/budgets` | Monthly budget planning and tracking |
| `/recurring` | Automated recurring transactions |
| `/analytics` | Detailed spending analysis |

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, Tailwind CSS, shadcn/ui |
| **Forms** | React Hook Form, Zod |
| **Database** | SQLite with Prisma ORM |
| **Charts** | Recharts |
| **Testing** | Vitest, React Testing Library |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AnirudhMKumar/Expense-Tracker.git
cd expense-tracker

# Install dependencies
npm install

# Initialize database
npx prisma db push

# (Optional) Seed sample data
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
expense-tracker/
├── prisma/
│   ├── schema.prisma       # Database models
│   ├── seed.ts             # Sample data seeder
│   └── dev.db              # SQLite database
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── analytics/
│   │   │   ├── budgets/
│   │   │   ├── categories/
│   │   │   ├── dashboard/
│   │   │   └── transactions/
│   │   ├── analytics/      # Analytics page
│   │   ├── budgets/        # Budgets page
│   │   ├── categories/     # Categories page
│   │   ├── recurring/      # Recurring transactions page
│   │   └── transactions/   # Transactions page
│   ├── components/
│   │   ├── budgets/        # Budget components
│   │   ├── categories/     # Category components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── recurring/      # Recurring components
│   │   ├── transactions/   # Transaction components
│   │   └── ui/             # shadcn/ui components
│   ├── lib/
│   │   ├── prisma.ts       # Prisma client
│   │   └── utils.ts        # Utility functions
│   └── types/
│       └── index.ts        # TypeScript types
├── public/                 # Static assets
└── package.json
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run seed` | Seed database with sample data |

## 🔧 Database Schema

### Models
- **Category** - Transaction categories with icon, color, type
- **Transaction** - Individual income/expense records
- **RecurringTransaction** - Automated recurring transactions
- **Budget** - Monthly budget limits per category

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.