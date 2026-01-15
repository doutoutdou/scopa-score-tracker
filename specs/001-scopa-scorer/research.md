# Phase 0 Research: Scopa Score Tracker

**Date**: 2026-01-14
**Purpose**: Resolve technical unknowns from plan.md Technical Context

## Research Questions

1. Language/Version selection (JavaScript vs TypeScript, specific version)
2. UI Framework selection (React, Vue, Vanilla JS, or other)
3. Testing Framework selection (Jest, Vitest, Playwright, etc.)
4. Build tooling (Vite, Webpack, Parcel, etc.)
5. Best practices for localStorage in modern web apps
6. Project structure patterns for client-side web applications

---

## 1. Language & Version Selection

### Decision: TypeScript 5.3+ with ES2022 target

### Rationale:
- **Type Safety**: TypeScript catches errors at compile time (player name validation, score ranges, game state structure)
- **Better IDE Support**: Autocomplete and refactoring for game logic
- **Maintainability**: Explicit interfaces for GameSession, Player, Storage contract
- **No Runtime Cost**: Compiles to JavaScript - no performance penalty
- **Modern Features**: ES2022 provides class fields, optional chaining, nullish coalescing
- **Browser Support**: ES2022 supported in all target browsers (Chrome, Firefox, Safari, Edge latest 2 versions)

### Alternatives Considered:
- **Plain JavaScript (ES2022)**: Simpler setup but loses type safety benefits. For a scoring app with validation rules and state management, TypeScript's type checking prevents runtime errors
- **JavaScript with JSDoc**: Type hints without TypeScript compiler, but weaker guarantees and less tooling support
- **TypeScript 4.x**: Older, 5.x has better type inference and performance

### Implementation Notes:
- Use `strict: true` in tsconfig.json for maximum type safety
- Target ES2022 for modern syntax while maintaining browser compatibility
- No additional transpiler needed for modern browsers

---

## 2. UI Framework Selection

### Decision: React 18+ with hooks (functional components only)

### Rationale:
- **Declarative UI**: Score display naturally maps to state rendering (`players.map()`)
- **Component Reusability**: PlayerCard, ScoreButton, GameControls as independent units
- **State Management**: Built-in hooks (useState, useEffect) sufficient for single-game session
- **Testing Ecosystem**: React Testing Library aligns with TDD principles (test user behavior, not implementation)
- **Performance**: Virtual DOM efficiently handles score updates (<1s requirement easily met)
- **Community & Resources**: Largest ecosystem, extensive documentation, mature tooling
- **Constitution Alignment**: Library-first approach - React components are self-contained modules

### Alternatives Considered:
- **Vue 3**: Similar benefits, smaller bundle size (~30% smaller), but smaller ecosystem and fewer TypeScript resources
- **Vanilla JS**: Maximum simplicity and no framework overhead, but manual DOM manipulation increases complexity for dynamic score updates and testing difficulty
- **Svelte**: Compile-time framework with excellent performance, but smaller community and less TypeScript maturity
- **Solid.js**: Fine-grained reactivity for performance, but too new and niche for production use

### Implementation Notes:
- Use Vite as build tool (faster than Create React App, better DX)
- Functional components only (no class components)
- Custom hooks for game logic (`useGameSession`, `useLocalStorage`)
- React Testing Library for component tests

---

## 3. Testing Framework Selection

### Decision: Vitest + React Testing Library + Playwright (optional for E2E)

### Rationale:

**Vitest** (Unit & Integration):
- **Vite-Native**: Shares config with Vite build tool (no duplicate setup)
- **Jest-Compatible API**: Familiar syntax (`describe`, `it`, `expect`) for TDD
- **Fast Execution**: ES modules, parallel tests, instant hot reload
- **TypeScript Support**: Built-in, no extra configuration
- **Constitutional Fit**: Excellent for TDD workflow (watch mode, red-green-refactor cycle)

**React Testing Library**:
- **User-Centric**: Tests user behavior, not implementation details (constitutional observability principle)
- **Accessibility Focus**: Encourages semantic HTML and ARIA attributes
- **Integration-Friendly**: Tests components with real DOM, not shallow rendering

**Playwright** (E2E - Optional for MVP):
- **Cross-Browser**: Tests in Chrome, Firefox, Safari automatically
- **Reliable**: Less flaky than Selenium, auto-waits for elements
- **MVP Decision**: Defer E2E tests to post-MVP (unit/integration tests sufficient for core logic)

### Alternatives Considered:
- **Jest**: Slower than Vitest, requires more configuration for ES modules and TypeScript
- **Testing Library + Jest**: Works but Vitest has better DX and Vite integration
- **Cypress**: Good for E2E but overkill for MVP, Playwright is more modern and reliable

### Implementation Notes:
- Vitest for core library tests (game logic, validation, storage)
- React Testing Library for UI component tests
- Mock localStorage in tests (in-memory implementation)
- Coverage target: 90%+ for core logic (game session, validation, storage)

---

## 4. Build Tooling Selection

### Decision: Vite 5+

### Rationale:
- **Fast Dev Server**: ES modules with instant hot module replacement (HMR)
- **Zero Config**: TypeScript + React support out of the box
- **Optimized Builds**: Rollup-based production builds with automatic code splitting
- **Modern Defaults**: ESM-first, optimized for modern browsers
- **Small Bundle Size**: Tree-shaking and optimized dependencies
- **Vitest Integration**: Shared configuration with testing framework

### Alternatives Considered:
- **Create React App (CRA)**: Deprecated, slow, requires ejection for customization
- **Webpack**: More powerful but requires significant configuration overhead
- **Parcel**: Simple zero-config, but less mature ecosystem and slower builds than Vite
- **esbuild directly**: Extremely fast but low-level, requires more manual setup

### Implementation Notes:
- Use `vite` for dev server and build
- TypeScript configured via `tsconfig.json`
- Static assets served from `public/` directory
- Production build outputs to `dist/`

---

## 5. LocalStorage Best Practices

### Decision: Structured JSON with versioning and error handling

### Rationale:
- **Web Storage API Standard**: `localStorage.setItem(key, value)` / `getItem(key)` supported in all browsers
- **JSON Serialization**: Store game state as JSON string for structure preservation
- **Versioning**: Include schema version for future migrations (`{version: 1, gameState: {...}}`)
- **Error Handling**: Handle QuotaExceededError (5-10MB limit), JSON parse errors, null values
- **Atomic Updates**: Single `setItem` call per state change (no partial writes)

### Best Practices Applied:
1. **Single Storage Key**: `scopa-game-state` (avoid key proliferation)
2. **Schema Versioning**:
   ```typescript
   interface StoredData {
     version: number;  // Schema version
     gameState: GameSession | null;
   }
   ```
3. **Error Recovery**: Graceful fallback to empty game if localStorage fails or is corrupted
4. **Size Management**: Game state ~1KB (4 players × ~100 bytes each), well under 5MB limit
5. **Privacy**: Clear localStorage on "New Game" if user confirms

### Alternatives Considered:
- **IndexedDB**: More powerful but overkill for simple key-value storage, async API adds complexity
- **SessionStorage**: Cleared when tab closes (violates FR-010 persistence requirement)
- **Cookies**: 4KB limit too small, sent with every HTTP request (unnecessary overhead)

### Implementation Notes:
- Wrap Web Storage API in `LocalStorageService` class
- Export `loadGameState()`, `saveGameState(state)`, `clearGameState()` methods
- Unit test with in-memory mock (no real localStorage in tests)
- Handle edge cases: disabled localStorage (private browsing), quota exceeded, corrupted JSON

---

## 6. Project Structure

### Decision: Feature-based structure with library-first separation

### Rationale:
- **Library-First Compliance**: Core game logic separated from UI
- **Feature Cohesion**: Related code (components, hooks, logic) lives together
- **Testability**: Each module independently testable
- **Scalability**: Easy to add features without restructuring

### Structure:

```text
src/
├── core/                    # Pure business logic (no React, no DOM)
│   ├── game-session.ts      # GameSession class (add player, change score)
│   ├── validation.ts        # Input validation (names, scores, player count)
│   └── types.ts             # TypeScript interfaces (GameSession, Player)
│
├── storage/                 # Persistence layer
│   └── local-storage.ts     # LocalStorage wrapper (load/save/clear)
│
├── hooks/                   # React hooks (bridge between core and UI)
│   ├── useGameSession.ts    # Game state management hook
│   └── useLocalStorage.ts   # localStorage sync hook
│
├── components/              # React UI components
│   ├── GameSetup.tsx        # New game + add players
│   ├── ScoreBoard.tsx       # Display scores
│   ├── PlayerCard.tsx       # Individual player display
│   └── ScoreControls.tsx    # Add/remove points buttons
│
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
└── index.html               # HTML shell

tests/
├── unit/
│   ├── game-session.test.ts # Core logic tests
│   ├── validation.test.ts   # Validation tests
│   └── local-storage.test.ts # Storage tests
│
├── integration/
│   └── game-flow.test.tsx   # Full game workflows
│
└── helpers/
    └── test-utils.ts        # Test utilities (mock storage, render helpers)
```

### Structure Decision Rationale:
- **`core/` purity**: No framework dependencies, 100% portable and testable
- **`storage/` boundary**: Single point of integration with browser APIs
- **`hooks/` bridge**: React-specific logic separated from pure business logic
- **`components/` presentation**: UI only, delegates logic to hooks
- **TDD-Friendly**: Test core/ and storage/ without React, test components with RTL

### Alternatives Considered:
- **Type-based structure** (`/models`, `/services`, `/components`): Less cohesive, harder to locate related code
- **Single `/src` folder**: Works for tiny apps but doesn't enforce library-first architecture
- **Monorepo with packages**: Overkill for single app, adds build complexity

---

## Summary of Decisions

| Aspect | Decision | Key Benefit |
|--------|----------|------------|
| **Language** | TypeScript 5.3+ (ES2022) | Type safety + modern syntax |
| **UI Framework** | React 18+ (hooks) | Declarative UI + strong ecosystem |
| **Testing** | Vitest + React Testing Library | Fast TDD workflow + user-centric tests |
| **Build Tool** | Vite 5+ | Fast dev server + simple config |
| **Storage** | localStorage with JSON + versioning | Simple, reliable, versioned schema |
| **Structure** | Feature-based with library-first | Constitutional compliance + testability |

## Next Steps (Phase 1)

1. ✅ Research complete - all NEEDS CLARIFICATION resolved
2. → Create `data-model.md` with TypeScript interfaces
3. → Generate contracts (likely N/A for client-only app, but document API surface)
4. → Create `quickstart.md` for development setup
5. → Update agent context with technology stack

## Technical Stack Summary

**Core Technologies**:
- TypeScript 5.3+ (strict mode)
- React 18+
- Vite 5+
- Vitest + React Testing Library

**Browser APIs**:
- Web Storage API (localStorage)
- ES2022 features

**Development**:
- Node.js 20+ (LTS)
- npm or pnpm for package management

**Production**:
- Static file hosting (Netlify, Vercel, GitHub Pages, or S3)
- No backend/database required

---

## Constitutional Alignment

### Library-First Architecture ✅
- Core game logic (`core/`) independent of React
- Storage layer (`storage/`) has clean interface
- UI components (`components/`) depend on core, not vice versa
- All modules independently testable

### Test-First Development ✅
- Vitest enables fast TDD workflow with watch mode
- React Testing Library tests user behavior
- Mock implementations for storage layer
- Coverage targets: 90%+ for core logic

### Observability ✅
- Structured console logging for state transitions
- Error messages include context (operation, input, constraint)
- localStorage operations logged with timing
- Browser DevTools integration for debugging

### Simplicity (YAGNI) ✅
- No state management library (React hooks sufficient)
- No routing (single-page, no navigation)
- No CSS framework (vanilla CSS or lightweight styling)
- No backend/API (pure client-side)
- No build complexity (Vite defaults sufficient)

### Versioning ✅
- localStorage schema versioned (v1.0.0)
- Application version in package.json
- Semantic versioning for future releases

### Performance ✅
- React virtual DOM for efficient updates
- localStorage operations <10ms typical
- Bundle size optimized with Vite tree-shaking
- Lazy loading not needed (small app)
- Performance targets easily met (<1s updates, <30s setup)

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-14
**Status**: Complete - Ready for Phase 1 (data model & contracts)
