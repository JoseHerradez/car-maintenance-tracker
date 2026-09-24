# Car Maintenance Tracker

A comprehensive web application for tracking vehicle maintenance, repairs, modifications, fuel consumption, and service reminders. Built with modern web technologies to help car owners keep detailed records of their vehicles.

## Features

### ✅ Implemented

- **User Authentication & Profiles** - Secure sign-up, login, and profile management using Better-Auth
- **Vehicle Garage Management** - Add, edit, and delete multiple vehicles with details like make, model, year, VIN, license plate, and purchase information
- **Maintenance & Repair Logging** - Record routine maintenance and repairs with date, mileage, cost, service provider, and detailed notes
- **Modifications & Upgrades Tracking** - Log aftermarket parts, aesthetic changes, or performance upgrades with costs and installation details
- **Fuel & Mileage Tracking** - Track fuel fill-ups to monitor fuel economy and total vehicle mileage over time
- **Document & Receipt Storage** - Upload and attach photos or PDFs of receipts, warranties, and service reports to specific log entries (powered by Vercel Blob)
- **Maintenance Reminders** - Set future alerts based on time (e.g., "6 months") or mileage (e.g., "5,000 miles") for upcoming routine services
- **Responsive Design** - Fully responsive UI that works on desktop, tablet, and mobile devices

## Tech Stack

### Core Framework

- **Next.js 16.3.6** - React framework with App Router and React Server Components
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library with latest features

### Database & ORM

- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe SQL toolkit for TypeScript

### Authentication

- **Better-Auth** - Modern authentication solution

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library built on Radix UI
- **Lucide React** - Beautiful icon library

### Forms & Validation

- **React Hook Form** - Performant form library
- **Zod** - TypeScript-first schema validation

### File Storage

- **Vercel Blob** - Serverless file storage for receipts and documents

### Utilities

- **date-fns** - Modern JavaScript date utility library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Vercel account (for Blob storage)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd car-maintenance-tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a .env.local file in the root directory:

```env
# Database
POSTGRES_URL="postgresql://user:password@localhost:5432/car_tracker"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

4. **Set up the database**

```bash
# Push schema to database
npm run db:push

# Or generate and run migrations
npm run db:generate
npm run db:migrate
```

5. **Run the development server**

```bash
npm run dev
```

6. **Run the database studio**

```bash
npm run db:studio
```

## Project Structure

```
car-maintenance-tracker/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/                # Main dashboard
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   └── vehicles/
│   │   │       └── [id]/
│   │   │           └── page.tsx      # Vehicle detail page
│   │   ├── actions/                  # Server Actions
│   │   │   ├── auth.ts               # Authentication actions
│   │   │   ├── vehicles.ts           # Vehicle CRUD
│   │   │   ├── maintenance.ts        # Maintenance logs
│   │   │   ├── fuel.ts               # Fuel logs
│   │   │   ├── modifications.ts      # Modifications
│   │   │   ├── files.ts              # File uploads
│   │   │   └── reminders.ts          # Reminders
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   └── vehicles/                 # Vehicle-related components
│   │       ├── vehicle-form.tsx
│   │       ├── vehicle-garage.tsx
│   │       ├── maintenance-form.tsx
│   │       ├── fuel-form.tsx
│   │       ├── modification-form.tsx
│   │       ├── reminder-form.tsx
│   │       ├── file-upload.tsx
│   │       ├── file-list.tsx
│   │       └── [dialog/button components]
│   │
│   ├── db/                           # Database configuration
│   │   ├── schema.ts                 # Drizzle schema
│   │   └── index.ts                  # Database connection
│   │
│   ├── lib/                          # Utilities and configs
│   │   ├── auth.ts                   # Better-Auth configuration
│   │   └── validations/              # Zod schemas
│   │       ├── vehicle.ts
│   │       ├── maintenance.ts
│   │       ├── fuel.ts
│   │       ├── modification.ts
│   │       └── reminder.ts
│   │
│   └── middleware.ts                 # Next.js middleware
│
├── public/                           # Static assets
├── drizzle.config.ts                 # Drizzle configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
└── README.md                         # This file
```

## Database Schema

The application uses the following main tables:

- users - User accounts (managed by Better-Auth)
- vehicles - Vehicle information (make, model, year, VIN, etc.)
- maintenance_logs - Maintenance and repair records
- fuel_logs - Fuel fill-up records
- modifications - Vehicle modifications and upgrades
- reminders - Maintenance reminders (time or mileage-based)
- maintenance_files - File attachments for maintenance logs
- fuel_files - File attachments for fuel logs
- modification_files - File attachments for modifications

All tables are properly related with foreign keys and cascade deletes configured.

## Security Features

- Authentication - All routes protected with session-based authentication
- Authorization - Server-side ownership verification on all mutations
- Input Validation - Zod schemas validate all form data on both client and server
- SQL Injection Prevention - Drizzle ORM uses parameterized queries
- File Upload Security - Files stored securely in Vercel Blob with public access

## License

This project is created for educational and demonstration purposes.
