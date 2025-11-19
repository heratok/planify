# Planify - React Project with TailwindCSS

A modern React application built with Vite, TypeScript, TailwindCSS v3.4, ESLint, and Prettier.

## Features

- **React 19** with TypeScript
- **TailwindCSS v3.4** with dark mode support (class strategy, persisted in localStorage)
- **ESLint** and **Prettier** for code quality and formatting
- Responsive layout with functional navbar and sidebar
- Theme context for dark mode management
- Project structure: components, pages, context, hooks, utils, assets

## Project Structure

```
src/
├── components/     # Reusable UI components (Navbar, Sidebar, LayoutWrapper)
├── pages/          # Page components
├── context/        # React context providers (ThemeContext)
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── assets/         # Static assets
├── App.tsx         # Main app component
├── main.tsx        # App entry point
└── index.css       # Global styles with Tailwind
```

## Layout Components

### Navbar

- App logo placeholder (left)
- Dark mode toggle and user avatar (right, desktop)
- Collapses into dropdown menu on mobile

### Sidebar

- Navigation links: Dashboard, Projects, Settings
- Active link highlighting
- Collapsible on mobile via hamburger menu

### LayoutWrapper

- Combines Navbar and Sidebar
- Manages sidebar state and active page
- Responsive design

## Dark Mode

- Toggle using Tailwind's `dark:` classes
- Preference saved in localStorage
- Automatic application on page load

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build

Build for production:

```bash
npm run build
```

### Linting

Run ESLint:

```bash
npm run lint
```

## Configuration

### TailwindCSS

- Configured with dark mode using `class` strategy
- Content paths: `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`

### ESLint & Prettier

- ESLint configured with TypeScript and React rules
- Prettier integrated for consistent formatting
- Auto-fix with `npm run lint -- --fix`

## Usage

The app includes a `LayoutWrapper` component with:

- Navbar placeholder (top)
- Sidebar placeholder (left, collapsible on mobile)
- Main content area (flex-1)

Responsive design:

- Desktop: Sidebar visible
- Mobile: Sidebar toggles via hamburger menu

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
