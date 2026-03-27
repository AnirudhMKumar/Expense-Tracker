# Expense Tracker

A personal expense tracking application built with Next.js, Prisma, and SQLite.

## Features

- **Transactions**: Add, edit, and delete income/expense transactions
- **Categories**: Organize transactions by category with custom icons and colors
- **Budgets**: Set monthly budget limits per category
- **Recurring Transactions**: Automate recurring income/expenses
- **Dashboard**: View spending trends and statistics

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Forms**: React Hook Form, Zod
- **Database**: SQLite with Prisma ORM
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
npx prisma db push
```

4. (Optional) Seed sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Sample data seeder
│   └── dev.db           # SQLite database
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities and Prisma client
│   └── types/           # TypeScript types
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run seed` - Seed database with sample data

## License

MIT