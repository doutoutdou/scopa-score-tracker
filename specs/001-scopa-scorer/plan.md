# Implementation Plan: Scopa Score Tracker

**Branch**: `001-scopa-scorer` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-scopa-scorer/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a browser-based web application to track scores for the Scopa card game. The application will support 2-4 players, allow adding/removing points (1-100 per action), persist game state in localStorage, and provide real-time score display. No backend required - pure client-side implementation.

## Technical Context

**Language/Version**: TypeScript 5.3+ (ES2022 target, strict mode)
**Primary Dependencies**: React 18+, Vite 5+, Vitest, React Testing Library
**Storage**: Browser localStorage (Web Storage API with JSON + versioning)
**Testing**: Vitest (unit/integration), React Testing Library (components), Playwright deferred to post-MVP
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: web (single-page application)
**Performance Goals**: <1s UI updates after score changes (per SC-003), <30s game setup time (per SC-001)
**Constraints**: Client-side only (no backend), works offline after initial load, localStorage size limits (typically 5-10MB)
**Scale/Scope**: Single game session, 2-4 players, scores 0-10000+ range, localStorage persistence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Library-First Architecture

**Status**: ✅ PASS

**Analysis**:
- Game logic (player management, score tracking, validation) will be implemented as a standalone library/module with clear boundaries
- UI layer will be separated from business logic
- localStorage persistence will be a separate module with defined interface
- Each component (GameSession, Player, Storage) has singular purpose and is independently testable

**Libraries Planned**:
1. **core/game-session**: Manages game state, player roster, score operations
2. **core/validation**: Validates player names, score ranges, game rules
3. **storage/local-storage**: Handles persistence to/from localStorage
4. **ui/components**: Presentation layer (depends on core, not vice versa)

### II. Test-First Development

**Status**: ✅ COMMITTED

**Analysis**:
- TDD will be applied to all core business logic (game session, validation, storage)
- Tests will be written and reviewed before implementation
- Red-Green-Refactor cycle will be followed
- Acceptance scenarios in spec provide clear test cases to start from

**Test Coverage Plan**:
- Unit tests: Game logic, validation rules, storage operations
- Integration tests: End-to-end game workflows
- Contract tests: localStorage interface compliance
- UI tests: User interaction flows (after core implementation)

### III. Observability

**Status**: ✅ PASS

**Analysis**:
- Browser-based application supports observability through console logging
- All state transitions (add player, change score, new game) will log structured events
- Error messages will include actionable context (validation failures, localStorage errors)
- Performance timing will be tracked for critical operations (load, save, score updates)

**Observability Approach**:
- Structured console logging with levels (info, warn, error)
- Error objects with context (operation, input, constraint violated)
- Performance marks for localStorage operations
- State snapshots logged on significant transitions

### IV. Versioning & Breaking Changes

**Status**: ✅ PASS (with notes)

**Analysis**:
- MVP will start at version 1.0.0
- localStorage schema will be versioned to enable future migrations
- Future breaking changes (schema changes) will require migration logic

**Versioning Strategy**:
- Application version: semantic versioning in package.json
- Data schema version: stored in localStorage alongside game state
- Schema migration function to handle version upgrades

### V. Performance Standards

**Status**: ✅ PASS

**Analysis**:
- Performance targets defined in spec (SC-003: <1s updates, SC-001: <30s setup)
- Simple operations (score changes) are O(1) with minimal overhead
- localStorage read/write latency typically <10ms
- No performance-critical paths requiring special optimization

**Performance Validation**:
- Manual testing will verify UI responsiveness
- Console timing logs will validate storage operations <10ms
- No CI performance tests needed for MVP (operations too simple)

### VI. Simplicity (YAGNI)

**Status**: ✅ PASS

**Analysis**:
- MVP scope tightly defined: single game session, no history, no multi-device sync
- No premature abstractions (e.g., multi-storage backends, complex state machines)
- Minimal dependencies (UI framework + testing only)
- No speculative features (game history, analytics, user accounts)

**Simplicity Commitments**:
- Use standard Web Storage API directly (no abstraction library)
- Inline validation logic (no rule engine)
- Single-file data model (no complex ORM)
- Convention over configuration (no config files for MVP)

### Gate Summary

| Principle | Status | Notes |
|-----------|--------|-------|
| Library-First | ✅ PASS | Clear module boundaries planned |
| Test-First | ✅ COMMITTED | TDD workflow will be followed |
| Observability | ✅ PASS | Console logging + structured errors |
| Versioning | ✅ PASS | Schema versioning planned |
| Performance | ✅ PASS | Targets defined and achievable |
| Simplicity | ✅ PASS | MVP tightly scoped, no over-engineering |

**GATE DECISION**: ✅ **PROCEED TO PHASE 0** - All constitutional requirements satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── core/                    # Pure business logic (no React, no DOM)
│   ├── game-session.ts      # GameSession operations (add player, change score)
│   ├── validation.ts        # Input validation (names, scores, player count)
│   └── types.ts             # TypeScript interfaces (GameSession, Player, errors)
│
├── storage/                 # Persistence layer
│   └── local-storage.ts     # LocalStorage wrapper (load/save/clear)
│
├── hooks/                   # React hooks (bridge between core and UI)
│   ├── useGameSession.ts    # Game state management hook
│   └── useLocalStorage.ts   # localStorage sync hook
│
├── components/              # React UI components
│   ├── GameSetup.tsx        # New game + add players UI
│   ├── ScoreBoard.tsx       # Display all player scores
│   ├── PlayerCard.tsx       # Individual player display
│   └── ScoreControls.tsx    # Add/remove points buttons
│
├── App.tsx                  # Root component
├── main.tsx                 # Entry point (React rendering)
├── vite-env.d.ts            # Vite environment types
└── styles.css               # Global styles

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

public/                      # Static assets
└── index.html               # HTML shell

Root configuration files:
├── package.json             # Node dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── vitest.config.ts         # Vitest test configuration (if separate)
└── README.md                # Project documentation
```

**Structure Decision**: Web application with library-first architecture

**Rationale**:
- **`src/core/`**: Pure TypeScript business logic, zero framework dependencies, fully testable in isolation
- **`src/storage/`**: Clean abstraction over localStorage API, testable with mocks
- **`src/hooks/`**: React-specific layer that bridges core logic to UI components
- **`src/components/`**: Presentational components, delegates logic to hooks
- **`tests/`**: Organized by test type (unit, integration) not by source structure
- **`public/`**: Vite convention for static assets served as-is

**Library Boundaries**:
1. `core/` → No external dependencies (pure TypeScript)
2. `storage/` → Browser API only (Web Storage)
3. `hooks/` → React + core modules
4. `components/` → React + hooks

**Constitutional Alignment**:
- ✅ Library-First: Core logic is framework-independent
- ✅ Testability: Each layer independently testable
- ✅ Simplicity: No monorepo, no complex build, single project

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: ✅ NO VIOLATIONS

All constitutional principles satisfied. No complexity justifications required.

---

## Post-Design Constitution Re-Evaluation

*Re-evaluated after Phase 1 design completion*

### Library-First Architecture ✅ CONFIRMED

**Post-Design Analysis**:
- `src/core/` modules are pure TypeScript with zero framework dependencies
- `src/storage/` wraps browser API with clean interface
- `src/hooks/` bridges core logic to React without coupling
- `src/components/` delegates all logic to hooks
- Each layer is independently testable with mocks

**Validation**: Architecture maintains strict library boundaries as planned.

### Test-First Development ✅ CONFIRMED

**Post-Design Analysis**:
- Vitest configured with watch mode for TDD workflow
- Test structure matches source structure for discoverability
- Mock implementations designed for unit testing (`tests/helpers/test-utils.ts`)
- Coverage targets: 90%+ for core logic
- Red-Green-Refactor cycle supported by tooling

**Validation**: Testing strategy fully supports TDD workflow.

### Observability ✅ CONFIRMED

**Post-Design Analysis**:
- TypeScript interfaces provide compile-time observability
- Error classes (`ValidationError`, `StorageError`) include structured context
- localStorage operations will log with timing metrics
- Browser DevTools integration for runtime debugging
- State transitions logged in console (structured events)

**Validation**: Observability requirements met through TypeScript + console logging + error context.

### Versioning ✅ CONFIRMED

**Post-Design Analysis**:
- localStorage schema versioned (v1.0.0) in `StoredData` interface
- Application version managed via `package.json`
- Semantic versioning strategy documented in data-model.md
- Migration path designed for future schema changes

**Validation**: Versioning strategy in place for both app and data schema.

### Performance ✅ CONFIRMED

**Post-Design Analysis**:
- All core operations O(n) where n ≤ 4 players (effectively O(1))
- localStorage read/write ~10ms typical
- React virtual DOM handles UI updates efficiently
- No performance bottlenecks identified in design
- Performance targets (<1s updates, <30s setup) easily achievable

**Validation**: Performance requirements met by design.

### Simplicity (YAGNI) ✅ CONFIRMED

**Post-Design Analysis**:
- No state management library (React hooks sufficient)
- No routing library (single-page, no navigation)
- No CSS framework (vanilla CSS planned)
- No backend/API (pure client-side)
- No complex build configuration (Vite defaults)
- Immutable data structures (functional approach, no ORM)

**Validation**: Design adheres to YAGNI principles throughout.

---

## Final Constitutional Verdict

| Principle | Pre-Design | Post-Design | Notes |
|-----------|-----------|-------------|-------|
| Library-First | ✅ PASS | ✅ CONFIRMED | Clear boundaries maintained |
| Test-First | ✅ COMMITTED | ✅ CONFIRMED | Tooling fully supports TDD |
| Observability | ✅ PASS | ✅ CONFIRMED | TypeScript + logging strategy |
| Versioning | ✅ PASS | ✅ CONFIRMED | Schema + app versioning |
| Performance | ✅ PASS | ✅ CONFIRMED | Targets achievable |
| Simplicity | ✅ PASS | ✅ CONFIRMED | YAGNI throughout |

**FINAL DECISION**: ✅ **APPROVED FOR IMPLEMENTATION** - All constitutional requirements satisfied.
