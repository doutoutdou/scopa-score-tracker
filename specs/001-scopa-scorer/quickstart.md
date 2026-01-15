# Quickstart Guide: Scopa Score Tracker

**Feature**: `001-scopa-scorer`
**Date**: 2026-01-14
**Related Docs**: [spec.md](./spec.md) | [plan.md](./plan.md) | [data-model.md](./data-model.md)

---

## Overview

This guide helps you set up the development environment for the Scopa Score Tracker web application and run your first build.

**Time to first run**: ~5-10 minutes (including dependency installation)

---

## Prerequisites

### Required Software

| Tool | Version    | Purpose | Installation Check |
|------|------------|---------|-------------------|
| **Node.js** | 24+ LTS    | JavaScript runtime | `node --version` |
| **npm** | 11+        | Package manager | `npm --version` |
| **Git** | Any recent | Version control | `git --version` |

### Installation

**Node.js & npm**:
- **macOS**: `brew install node` or download from [nodejs.org](https://nodejs.org/)
- **Windows**: Download installer from [nodejs.org](https://nodejs.org/)
- **Linux**: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs`

**Alternative**: Use [nvm](https://github.com/nvm-sh/nvm) for version management:
```bash
nvm install 24
nvm use 24
```

---

## Project Setup

### 1. Initialize Project

From the repository root:

```bash
# Create project with Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# This creates:
# - package.json
# - tsconfig.json
# - vite.config.ts
# - src/ directory structure
# - public/ directory
```

**Note**: If directory is not empty, Vite will prompt for confirmation.

### 2. Install Dependencies

```bash
# Install core dependencies
npm install

# Install testing dependencies
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Optional: Install additional dev tools
npm install --save-dev @types/node
```

**Expected Dependencies** (from `package.json`):
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@types/node": "24.13.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "@vitest/ui": "^4.0.0",
    "jsdom": "^23.0.0",
    "typescript": "^5.9.0",
    "vite": "^7.0.0",
    "vitest": "^4.0.0"
  }
}
```

### 3. Configure TypeScript

Update `tsconfig.json` for strict mode and proper paths:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting - STRICT MODE */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. Configure Vitest

Create or update `vite.config.ts` to include Vitest configuration:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/helpers/test-utils.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ]
    }
  }
})
```

### 5. Create Test Setup

Create `tests/helpers/test-utils.ts`:

```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Replace global localStorage with mock
global.localStorage = localStorageMock as Storage;

// Mock crypto.randomUUID for deterministic tests
vi.stubGlobal('crypto', {
  randomUUID: () => '00000000-0000-0000-0000-000000000000',
});
```

### 6. Add npm Scripts

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Verify Setup

### 1. Run Development Server

```bash
npm run dev
```

**Expected Output**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

Open `http://localhost:5173/` in your browser. You should see the Vite + React default page.

### 2. Run Tests

```bash
npm run test:run
```

**Expected Output** (initially no tests):
```
✓ 0 tests passed (0)
```

### 3. Run Type Checking

```bash
npm run type-check
```

**Expected Output**:
```
No errors found.
```

### 4. Build for Production

```bash
npm run build
```

**Expected Output**:
```
vite v5.x.x building for production...
✓ xxx modules transformed.
dist/index.html                  x.xx kB
dist/assets/index-xxxxxxxx.js    xxx.xx kB │ gzip: xx.xx kB
✓ built in xxxms
```

---

## Development Workflow

### TDD Workflow (Constitutional Requirement)

1. **Write Test First** (Red):
   ```bash
   # Create test file
   touch tests/unit/game-session.test.ts

   # Write failing test
   npm run test -- --watch
   ```

2. **Implement Feature** (Green):
   ```bash
   # Create implementation file
   touch src/core/game-session.ts

   # Write minimal code to pass test
   # Tests auto-rerun in watch mode
   ```

3. **Refactor** (Refactor):
   ```bash
   # Improve code while keeping tests green
   # Run full suite before committing
   npm run test:run
   ```

### Common Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run dev` | Start dev server | During UI development |
| `npm run test` | Run tests in watch mode | During TDD cycles |
| `npm run test:ui` | Open Vitest UI | Visual test debugging |
| `npm run test:coverage` | Generate coverage report | Before PR/commit |
| `npm run build` | Production build | Before deployment |
| `npm run preview` | Preview production build | Test build locally |
| `npm run type-check` | TypeScript validation | Before commit |

### File Watchers

Vite and Vitest automatically watch for file changes:
- **Vite**: Reloads browser on source changes
- **Vitest**: Reruns tests on source/test changes
- **TypeScript**: IDE provides real-time type checking

---

## Project Structure Reference

After setup, your directory should look like:

```text
scopa-score-tracker/
├── specs/
│   └── 001-scopa-scorer/
│       ├── spec.md           # Feature specification
│       ├── plan.md           # Implementation plan
│       ├── data-model.md     # Data model design
│       └── quickstart.md     # This file
│
├── src/                      # Application source
│   ├── core/                 # Business logic (start here)
│   ├── storage/              # Persistence layer
│   ├── hooks/                # React hooks
│   ├── components/           # UI components
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
│
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── helpers/              # Test utilities
│
├── public/                   # Static assets
│   └── index.html
│
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── README.md                 # Project README
```

---

## Troubleshooting

### Common Issues

**Issue**: `npm install` fails with EACCES permissions error
- **Solution**: Use `npm config set prefix ~/.npm-global` and add `~/.npm-global/bin` to PATH

**Issue**: `npm run dev` port 5173 already in use
- **Solution**: Kill process on port: `lsof -ti:5173 | xargs kill -9` or use different port: `npm run dev -- --port 3000`

**Issue**: TypeScript errors in IDE but not in terminal
- **Solution**: Restart TypeScript server in IDE or run `npm run type-check`

**Issue**: Tests fail with "localStorage is not defined"
- **Solution**: Ensure `tests/helpers/test-utils.ts` is configured as setupFiles in `vite.config.ts`

**Issue**: Module resolution errors (`Cannot find module '@/...'`)
- **Solution**: Check `tsconfig.json` paths configuration and restart IDE

---

## Next Steps

After completing setup:

1. **Phase 2**: Implement core game logic (`src/core/game-session.ts`)
   - Start with tests: `tests/unit/game-session.test.ts`
   - Follow TDD: write test → implement → refactor

2. **Phase 3**: Implement storage layer (`src/storage/local-storage.ts`)
   - Test with mock: `tests/unit/local-storage.test.ts`
   - Test with real localStorage: `tests/integration/`

3. **Phase 4**: Implement React hooks (`src/hooks/`)
   - Bridge core logic to UI components

4. **Phase 5**: Build UI components (`src/components/`)
   - Follow design in spec.md User Stories

---

## Development Tools (Optional)

### Recommended VSCode Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ZixuanChen.vitest-explorer"
  ]
}
```

### ESLint Configuration (Optional)

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react-hooks

npx eslint --init
```

### Prettier Configuration (Optional)

```bash
npm install --save-dev prettier

# Create .prettierrc
echo '{ "semi": true, "singleQuote": true, "trailingComma": "es5" }' > .prettierrc
```

---

## Resources

- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **Vitest Documentation**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/react
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

**Status**: Setup guide complete - ready for implementation
**Next Command**: `/speckit.tasks` to generate task breakdown for implementation
