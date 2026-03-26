# GEMINI.md

## Project Overview

This is a [Next.js](https://nextjs.org/) project named "SkillStreak", bootstrapped with `create-next-app`. It uses [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/). The project is configured with [Tailwind CSS](https://tailwindcss.com/) for styling and [ESLint](https://eslint.org/) for code linting. The package manager used is [pnpm](https://pnpm.io/).

The application structure follows the Next.js App Router paradigm, with pages and layouts located in the `app/` directory.

## Building and Running

The following scripts are available in `package.json` to manage the application lifecycle.

### Running the development server

To start the development server, run the following command. This will make the application available at [http://localhost:3000](http://localhost:3000). The page will auto-update as you edit the files.

```bash
pnpm dev
```

### Building for production

To create a production-ready build, use:

```bash
pnpm build
```

This will compile the application and output the optimized files to the `.next/` directory.

### Starting the production server

After building the project, you can start a production server with:

```bash
pnpm start
```

### Linting

To run the linter and check for code quality issues, use:

```bash
pnpm lint
```

## Development Conventions

### TypeScript

- **Strict Mode**: The project enforces strict type-checking (`"strict": true` in `tsconfig.json`) to ensure code quality and catch errors early.
- **Path Aliases**: The `tsconfig.json` is configured with a path alias `@/*` which maps to the project root directory (`./*`). This allows for cleaner import statements. For example, instead of `import { MyComponent } from '../../components/MyComponent'`, you can use `import { MyComponent } from '@/components/MyComponent'`.

### Styling

- The project uses **Tailwind CSS** for utility-first styling. Styles are defined in `app/globals.css` and applied via class names in the React components.
- The Geist font is pre-configured for use throughout the application.

### File Structure

- **`app/`**: Contains the core application code, including pages, layouts, and components.
  - **`layout.tsx`**: The root layout for the application.
  - **`page.tsx`**: The main page component for the home route (`/`).
  - **`globals.css`**: Global stylesheets, including Tailwind CSS imports.
- **`public/`**: Contains static assets like images and fonts that are served directly.
- **Configuration Files**:
  - `next.config.ts`: Configuration for the Next.js framework.
  - `postcss.config.mjs`: Configuration for PostCSS, used by Tailwind CSS.
  - `tailwind.config.ts`: (Not present, but can be created) for customizing Tailwind CSS.
  - `eslint.config.mjs`: Configuration for ESLint.
  - `tsconfig.json`: Configuration for the TypeScript compiler.
