# StaffSync - Unified HR & Employee Management System

A unified frontend application combining HR Dashboard and Employee Portal functionalities.

## Project Structure

```
merged-project/
├── src/
│   ├── components/
│   │   ├── common/              # Shared utilities (ErrorBoundary, LoadingSpinner, etc.)
│   │   ├── homepage/            # Homepage components (Navbar, Hero, Features, etc.)
│   │   ├── hr/                  # HR Dashboard components
│   │   │   ├── layout/          # HR layout (Sidebar, Header, MainLayout)
│   │   │   ├── dashboard/       # HR dashboard widgets
│   │   │   ├── attendance/      # HR attendance management
│   │   │   └── employees/       # Employee management
│   │   ├── employee-dashboard/  # Employee Dashboard components
│   │   └── ui/                  # Shared UI components (shadcn)
│   ├── pages/
│   │   ├── Index.tsx            # Homepage (landing page)
│   │   ├── Login.tsx            # Login page for both roles
│   │   ├── hr/                  # HR Dashboard pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Employees.tsx
│   │   │   ├── Attendance.tsx
│   │   │   └── Settings.tsx
│   │   └── employee/            # Employee Dashboard pages
│   │       ├── EmployeeDashboard.tsx
│   │       ├── Attendance.tsx
│   │       ├── Tasks.tsx
│   │       └── Documents.tsx
│   ├── lib/
│   │   ├── utils.ts             # Utility functions
│   │   ├── constants.ts         # App constants and routes
│   │   └── types.ts             # TypeScript type definitions
│   ├── hooks/                   # Custom React hooks
│   └── App.tsx                  # Main app with routing & error boundary
└── package.json
```

## Features

### Homepage (/)
- Landing page with hero section
- Feature showcase
- Login options for HR and Employee roles
- Modern, responsive design

### HR Dashboard (/hr/*)
- Dashboard with statistics and charts
- Employee management (add, view, delete)
- Attendance tracking and management
- Settings and configuration

### Employee Dashboard (/employee/*)
- Personal dashboard with metrics
- Attendance history
- Task management
- Document access

## Routing

- `/` - Homepage (landing page)
- `/login/hr` - HR login page
- `/login/employee` - Employee login page
- `/hr/dashboard` - HR Dashboard
- `/hr/employees` - Employee Management
- `/hr/attendance` - Attendance Management
- `/hr/settings` - Settings
- `/employee/dashboard` - Employee Dashboard
- `/employee/attendance` - Employee Attendance View
- `/employee/tasks` - Employee Tasks
- `/employee/documents` - Employee Documents

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The application will be available at `http://localhost:5173`

### Demo Credentials

**HR Login:**
- Email: hr@staffsync.com
- Password: demo123

**Employee Login:**
- Email: employee@staffsync.com
- Password: demo123

## Technology Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6 with lazy loading
- **UI Components:** shadcn/ui (Radix UI)
- **Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query)
- **Form Handling:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **Error Handling:** React Error Boundaries
- **Code Splitting:** React.lazy() + Suspense

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Notes

- This is a frontend-only application with mock data
- No authentication backend is implemented (demo mode)
- All data is stored in component state (not persisted)
- Designed for single admin user scenario

## License

MIT
