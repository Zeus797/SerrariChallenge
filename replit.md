# SerrariEd - Professional Test Preparation Platform

## Overview

SerrariEd is a modern educational platform designed to help professionals prepare for certification exams including ACCA, HESI A2, ATI TEAS 7, NCLEX RN, NCLEX PN, and HESI EXIT. The platform offers free 10-question challenge tests with instant explanations, performance summaries, and study recommendations. Built with a focus on user engagement and learning effectiveness, it provides a clean, trustworthy interface inspired by modern educational platforms like Khan Academy and Duolingo.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system following SerrariEd brand guidelines
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Component Structure
- **Modular Components**: Reusable components for courses, tests, results, and UI elements
- **Theme System**: Light/dark mode support with context-based theme provider
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Design System**: Consistent spacing (4, 6, 8, 12, 16 units), typography (Inter font), and color palette

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Design**: RESTful endpoints with /api prefix
- **Storage Interface**: Abstracted storage layer with memory-based implementation
- **Development Tools**: Vite integration for hot module replacement in development

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL
- **Schema**: Structured tables for users, courses, questions, and test results
- **Migrations**: Drizzle Kit for database schema management

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Management**: Basic user authentication with username/password
- **Security**: Session-based authentication with secure cookie handling

### Test System Architecture
- **Question Management**: Structured question storage with options, correct answers, explanations, and topics
- **Test Sessions**: Stateful test execution with progress tracking and timing
- **Results Processing**: Score calculation, performance analysis by topic, and recommendation generation
- **Email Capture**: Modal-based email collection before results display

### External Dependencies

**Frontend Libraries**:
- React ecosystem (React, React DOM, React Router alternative - Wouter)
- UI Components (Radix UI primitives, Shadcn/ui, Lucide React icons)
- State Management (TanStack React Query)
- Styling (Tailwind CSS, Class Variance Authority, clsx)
- Forms (React Hook Form, Hookform Resolvers)
- Utilities (date-fns for date handling)

**Backend Dependencies**:
- Express.js web framework
- Database (Drizzle ORM, PostgreSQL driver, Neon serverless)
- Session management (connect-pg-simple)
- Validation (Zod schema validation)
- Development tools (tsx for TypeScript execution, esbuild for production builds)

**External Services**:
- Neon Database (PostgreSQL hosting)
- Google Fonts (Inter typography)
- Serrari Group websites (study materials, about page, resources)
- YouTube (video courses)

**Development Tools**:
- Vite (build tool and development server)
- TypeScript (type safety)
- Drizzle Kit (database migrations)
- PostCSS with Autoprefixer
- Replit-specific plugins for development environment