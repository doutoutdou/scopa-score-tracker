# Implementation Tasks: Scopa Score Tracker

**Feature**: `001-scopa-scorer`
**Branch**: `001-scopa-scorer`
**Date**: 2026-01-14
**Related Docs**: [spec.md](./spec.md) | [plan.md](./plan.md) | [data-model.md](./data-model.md)

---

## Overview

This document breaks down the implementation of the Scopa Score Tracker into dependency-ordered, independently testable tasks. The implementation follows Test-First Development principles (constitutional requirement) and is organized by user story to enable incremental delivery.

**Total Tasks**: 68
**Phases**: 6 (Setup, Foundational, US1, US2, US3, Polish)
**Estimated MVP**: Phase 3 (User Story 1) - 37 tasks

---

## Implementation Strategy

### MVP First (Minimum Viable Product)

**MVP Scope**: User Story 1 only - Setup Game with Players
- Delivers: Game creation, player management (add 2-4 players with validation)
- Delivers: Basic UI for game setup
- Delivers: Foundation for all future features
- **Value**: Users can set up games and see player list

**Post-MVP Increments**:
- **Increment 2** (US2): Add point tracking functionality
- **Increment 3** (US3): Add point removal for error correction

### Constitutional Compliance

**Test-First Development** ✅:
- Every implementation task has a corresponding test task
- Tests are written BEFORE implementation (Red-Green-Refactor)
- Test tasks are marked with `[P]` when parallelizable with other tests
- Coverage target: 90%+ for core logic

**Library-First Architecture** ✅:
- Core logic (`src/core/`) implemented first, independently of React
- Storage layer (`src/storage/`) has clean interface
- UI components (`src/components/`) built last, depend on hooks
- Each layer tested in isolation

---

## Dependency Graph

### Story Completion Order

```text
Phase 1: Setup (project initialization)
  ↓
Phase 2: Foundational (blocking prerequisites)
  ↓
Phase 3: User Story 1 - Setup Game with Players (P1) ← MVP
  ↓
Phase 4: User Story 2 - Add Points to Players (P2)
  ↓
Phase 5: User Story 3 - Remove Points from Players (P3)
  ↓
Phase 6: Polish & Cross-Cutting Concerns
```

**Notes**:
- US1 must complete before US2/US3 (provides player management foundation)
- US2 and US3 are independent after US1 completes (could theoretically be parallelized)
- Polish phase depends on all user stories

### Inter-Story Dependencies

- **US2 depends on US1**: Requires players to exist before adding points
- **US3 depends on US1**: Requires players to exist before removing points
- **US3 depends on US2 conceptually**: Can't remove points users haven't added yet (not a hard dependency)

---

## Phase 1: Setup

**Goal**: Initialize project with Vite + React + TypeScript + Vitest

**Tasks**:
- [ ] T001 Initialize Vite project with React + TypeScript template in repository root
- [ ] T002 Install dependencies (react, react-dom, vite, typescript)
- [ ] T003 Install testing dependencies (vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom)
- [ ] T004 Configure TypeScript with strict mode in tsconfig.json per plan.md (target ES2022, strict: true)
- [ ] T005 Configure Vitest in vite.config.ts (globals, jsdom environment, setupFiles)
- [ ] T006 Create test utilities in tests/helpers/test-utils.ts (localStorage mock, crypto.randomUUID mock, RTL setup)
- [ ] T007 Create directory structure per plan.md (src/core/, src/storage/, src/hooks/, src/components/, tests/unit/, tests/integration/)
- [ ] T008 Verify setup by running npm run dev and npm run test

**Acceptance**:
- `npm run dev` starts Vite dev server
- `npm run test` runs Vitest without errors
- Directory structure matches plan.md
- TypeScript strict mode enabled

---

## Phase 2: Foundational

**Goal**: Implement core types, validation, and storage layer (library-first foundation)

**Test Tasks**:

- [ ] T009 [P] Write unit tests for validatePlayerName in tests/unit/validation.test.ts (empty name, whitespace only, >30 chars, valid names)
- [ ] T010 [P] Write unit tests for validateScore in tests/unit/validation.test.ts (negative, non-integer, zero, valid scores)
- [ ] T011 [P] Write unit tests for validateScoreDelta in tests/unit/validation.test.ts (<1, >100, valid range 1-100)
- [ ] T012 [P] Write unit tests for createNewGame in tests/unit/game-session.test.ts (generates UUID, initializes empty players, sets timestamps)
- [ ] T013 [P] Write unit tests for localStorage service in tests/unit/local-storage.test.ts (save, load, clear, corrupted JSON, quota exceeded, version mismatch)

**Implementation Tasks**:

- [ ] T014 [P] Implement core types in src/core/types.ts (Player, GameSession, StoredData, ValidationError, StorageError, constants)
- [ ] T015 Implement validatePlayerName function in src/core/validation.ts
- [ ] T016 Implement validateScore function in src/core/validation.ts
- [ ] T017 Implement validateScoreDelta function in src/core/validation.ts (checks 1-100 range per FR-013)
- [ ] T018 Implement createNewGame factory function in src/core/game-session.ts
- [ ] T019 Implement saveGameState function in src/storage/local-storage.ts (JSON serialization with versioning)
- [ ] T020 Implement loadGameState function in src/storage/local-storage.ts (JSON deserialization with validation)
- [ ] T021 Implement clearGameState function in src/storage/local-storage.ts
- [ ] T022 Run all foundational tests and verify 100% pass rate

**Acceptance**:
- All validation functions throw ValidationError for invalid inputs
- createNewGame returns valid GameSession with UUID and timestamps
- localStorage service handles save/load/clear with versioning
- All unit tests pass (tests/unit/validation.test.ts, tests/unit/game-session.test.ts, tests/unit/local-storage.test.ts)

---

## Phase 3: User Story 1 - Setup Game with Players (P1)

**Story Goal**: Users can start a new game and add 2-4 players with unique names.

**Independent Test**: Create game → add 2-4 players with names → verify players registered with score 0 → delivers MVP value (game setup).

**Test Tasks**:

- [ ] T023 [P] [US1] Write unit tests for addPlayer in tests/unit/game-session.test.ts (valid add, duplicate name FR-003, max 4 players FR-009, empty name, >30 char name)
- [ ] T024 [P] [US1] Write unit tests for getPlayers in tests/unit/game-session.test.ts (returns all players, immutable copy)
- [ ] T025 [P] [US1] Write unit tests for validateGameSession in tests/unit/game-session.test.ts (min 2 players FR-009, max 4 players, unique names)
- [ ] T026 [US1] Write integration tests for game setup flow in tests/integration/game-flow.test.tsx (create game, add 2 players, verify state, save to localStorage, load from localStorage)

**Implementation Tasks**:

- [ ] T027 [US1] Implement addPlayer function in src/core/game-session.ts (validates name, checks duplicate, checks max 4 players, returns new GameSession)
- [ ] T028 [US1] Implement getPlayers function in src/core/game-session.ts (returns readonly player list)
- [ ] T029 [US1] Implement validateGameSession function in src/core/game-session.ts (checks 2-4 players, unique names)
- [ ] T030 [US1] Implement useGameSession custom hook in src/hooks/useGameSession.ts (useState for game, addPlayer handler, loadGame/saveGame integration)
- [ ] T031 [US1] Implement useLocalStorage custom hook in src/hooks/useLocalStorage.ts (auto-save on game state changes, load on mount)
- [ ] T032 [US1] Create GameSetup component in src/components/GameSetup.tsx (new game button, add player form with input + submit)
- [ ] T033 [US1] Create PlayerList component in src/components/PlayerList.tsx (displays all players with names and scores, uses PlayerCard)
- [ ] T034 [US1] Create PlayerCard component in src/components/PlayerCard.tsx (displays single player name + score)
- [ ] T035 [US1] Integrate GameSetup and PlayerList in src/App.tsx (main app component, conditional rendering based on game state)
- [ ] T036 [US1] Add basic CSS styling in src/styles.css (layout, forms, buttons, player cards)
- [ ] T037 [US1] Manual testing - verify acceptance scenarios US1.1-US1.4 from spec.md

**Acceptance** (from spec.md):
- ✅ US1.1: Start new game, add "Alice" → Alice appears with 0 points
- ✅ US1.2: Add "Bob" and "Carol" → all three appear with 0 points
- ✅ US1.3: Add empty name → system rejects and prompts for valid name
- ✅ US1.4: Add duplicate "Alice" → system prevents and prompts for unique name
- ✅ UI displays player list with names and scores
- ✅ Game state persists to localStorage
- ✅ All US1 tests pass

---

## Phase 4: User Story 2 - Add Points to Players (P2)

**Story Goal**: Users can award points (1-100) to players during gameplay.

**Independent Test**: Setup game with players → add various point amounts (1 point, multiple points) → verify scores increase correctly → delivers core value (score tracking).

**Test Tasks**:

- [ ] T038 [P] [US2] Write unit tests for addPoints in tests/unit/game-session.test.ts (valid add 1-100 points, player not found, amount <1, amount >100 FR-013, immutability check)
- [ ] T039 [US2] Write integration tests for add points flow in tests/integration/game-flow.test.tsx (create game, add players, add points to each, verify scores update, verify persistence)

**Implementation Tasks**:

- [ ] T040 [US2] Implement addPoints function in src/core/game-session.ts (validates player exists, validates amount 1-100 per FR-005/FR-013, returns new GameSession with updated score)
- [ ] T041 [US2] Update useGameSession hook in src/hooks/useGameSession.ts (add addPoints handler)
- [ ] T042 [US2] Create ScoreControls component in src/components/ScoreControls.tsx (input for amount 1-100, "Add Points" button per player)
- [ ] T043 [US2] Update PlayerCard component in src/components/PlayerCard.tsx (integrate ScoreControls, display updated scores)
- [ ] T044 [US2] Update PlayerList component to pass addPoints handler to PlayerCard components
- [ ] T045 [US2] Add error handling UI for invalid score changes (display ValidationError messages to user)
- [ ] T046 [US2] Manual testing - verify acceptance scenarios US2.1-US2.5 from spec.md

**Acceptance** (from spec.md):
- ✅ US2.1: Alice at 0 points, add 1 point → becomes 1
- ✅ US2.2: Bob at 3 points, add 2 points → becomes 5
- ✅ US2.3: Add points to one player → only that player changes
- ✅ US2.4: Attempt to add 0 or 101 points → system rejects with error message
- ✅ US2.5: View current scores → all players displayed with totals
- ✅ Score updates persist to localStorage
- ✅ All US2 tests pass

---

## Phase 5: User Story 3 - Remove Points from Players (P3)

**Story Goal**: Users can correct scoring mistakes by removing points (1-100).

**Independent Test**: Setup game, add points → remove points → verify scores decrease correctly, prevent negative scores → delivers error correction.

**Test Tasks**:

- [ ] T047 [P] [US3] Write unit tests for removePoints in tests/unit/game-session.test.ts (valid remove 1-100 points, player not found, amount <1, amount >100 FR-013, prevent negative score FR-007, immutability check)
- [ ] T048 [US3] Write integration tests for remove points flow in tests/integration/game-flow.test.tsx (create game, add players, add points, remove points, verify negative prevention, verify persistence)

**Implementation Tasks**:

- [ ] T049 [US3] Implement removePoints function in src/core/game-session.ts (validates player exists, validates amount 1-100 per FR-006/FR-013, prevents negative scores per FR-007, returns new GameSession)
- [ ] T050 [US3] Update useGameSession hook in src/hooks/useGameSession.ts (add removePoints handler)
- [ ] T051 [US3] Update ScoreControls component in src/components/ScoreControls.tsx (add "Remove Points" button and handler)
- [ ] T052 [US3] Update error handling UI to display negative score prevention messages
- [ ] T053 [US3] Manual testing - verify acceptance scenarios US3.1-US3.5 from spec.md

**Acceptance** (from spec.md):
- ✅ US3.1: Alice at 5 points, remove 1 point → becomes 4
- ✅ US3.2: Bob at 3 points, remove 3 points → becomes 0
- ✅ US3.3: Carol at 2 points, attempt remove 3 → system prevents, keeps score at 2
- ✅ US3.4: Remove points from one player → only that player changes
- ✅ US3.5: Attempt to remove 0 or 101 points → system rejects with error message
- ✅ All US3 tests pass

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Complete remaining requirements and polish user experience

**Test Tasks**:

- [ ] T054 [P] Write unit tests for "New Game" confirmation in tests/unit/game-session.test.ts (confirms when players exist per FR-012, clears game state)
- [ ] T055 [P] Write tests for edge cases in tests/unit/validation.test.ts (5th player rejection, special characters in names, very long names)
- [ ] T056 Write end-to-end integration tests in tests/integration/full-game.test.tsx (full game from setup through multiple score changes to completion)

**Implementation Tasks**:

- [ ] T057 Implement "New Game" button with confirmation dialog in src/components/GameSetup.tsx (prompts only when game has players per FR-012)
- [ ] T058 Implement special character and length validation for player names in src/core/validation.ts (edge case from spec.md)
- [ ] T059 Add console logging for observability (state transitions, score changes, localStorage operations) throughout src/core/ and src/storage/
- [ ] T060 Add performance timing marks for localStorage operations in src/storage/local-storage.ts (measure save/load time)
- [ ] T061 Improve error messages to include context (operation, player name, current score, constraint violated)
- [ ] T062 Polish UI/UX: responsive layout, better visual hierarchy, clear error display, loading states
- [ ] T063 Add README.md with project description, setup instructions, and usage guide
- [ ] T064 Run full test suite and verify >90% coverage for src/core/ and src/storage/
- [ ] T065 Verify performance targets (SC-001: setup <30s, SC-002: add/remove <5s, SC-003: display updates <1s)
- [ ] T066 Manual testing of all edge cases from spec.md (5th player, negative points, large values, long names, new game confirmation)
- [ ] T067 Build production bundle (npm run build) and verify bundle size <500KB
- [ ] T068 Preview production build (npm run preview) and perform final manual testing

**Acceptance**:
- All functional requirements (FR-001 through FR-013) verified
- All success criteria (SC-001 through SC-006) measured and achieved
- Test coverage >90% for core logic
- All edge cases handled gracefully
- Production build succeeds
- UI/UX polished and responsive

---

## Parallel Execution Opportunities

### Phase 1: Setup
- Tasks are sequential (project init → dependencies → config → directory structure)

### Phase 2: Foundational
**Test Writing** (parallel):
- T009 [P] validation tests (name)
- T010 [P] validation tests (score)
- T011 [P] validation tests (score delta)
- T012 [P] createNewGame tests
- T013 [P] localStorage tests

**Implementation** (parallel after tests):
- T015 validatePlayerName
- T016 validateScore
- T017 validateScoreDelta
- T019-T021 localStorage service (if T014 types completed)

### Phase 3: User Story 1
**Test Writing** (parallel):
- T023 [P] addPlayer tests
- T024 [P] getPlayers tests
- T025 [P] validateGameSession tests

**Implementation** (after core functions done):
- T032 GameSetup component
- T033 PlayerList component
- T034 PlayerCard component
(Components can be built in parallel once hooks are ready)

### Phase 4: User Story 2
**Test Writing**:
- T038 [P] addPoints tests (parallel with US3 tests)

**Implementation**:
- T042-T045 UI components (parallel after T040-T041 core logic)

### Phase 5: User Story 3
**Test Writing**:
- T047 [P] removePoints tests (parallel with US2 tests)

**Implementation**:
- T051-T052 UI updates (parallel with US2 UI if desired)

### Phase 6: Polish
**Test Writing** (parallel):
- T054 [P] New Game confirmation tests
- T055 [P] Edge case validation tests

**Implementation** (parallel):
- T057 New Game confirmation
- T058 Validation edge cases
- T059 Observability logging
- T060 Performance timing
- T061 Error message improvements
- T062 UI/UX polish

---

## Task Summary by Phase

| Phase | Description | Total Tasks | Test Tasks | Impl Tasks | Parallel Opportunities |
|-------|-------------|-------------|------------|------------|------------------------|
| 1 | Setup | 8 | 0 | 8 | 0 (sequential) |
| 2 | Foundational | 14 | 5 | 9 | 8 (5 test + 3 impl) |
| 3 | User Story 1 | 15 | 4 | 11 | 7 (3 test + 4 impl) |
| 4 | User Story 2 | 9 | 2 | 7 | 5 (1 test + 4 impl) |
| 5 | User Story 3 | 7 | 2 | 5 | 3 (1 test + 2 impl) |
| 6 | Polish | 15 | 3 | 12 | 10 (2 test + 8 impl) |
| **Total** | **68** | **16** | **52** | **33** |

---

## MVP Scope Definition

**Minimum Viable Product** = Phases 1-3 only (T001-T037)

**Delivers**:
- ✅ Game creation and setup
- ✅ Player management (add 2-4 players with validation)
- ✅ Player list display with names and initial scores
- ✅ localStorage persistence
- ✅ Basic UI for game setup
- ✅ All User Story 1 requirements (FR-001, FR-002, FR-003, FR-004, FR-009, FR-010, FR-011)

**Does NOT Include** (post-MVP):
- Point addition (US2)
- Point removal (US3)
- New game confirmation (US1 provides new game button, but without confirmation for empty games)
- Full polish and edge case handling

**Time Estimate**: 37 tasks (8 setup + 14 foundational + 15 US1)

**Why This MVP**:
- Enables users to set up games (primary value)
- Foundation for all future features
- Independently testable and deliverable
- Minimal but functional product

---

## Next Steps

1. **Start with Phase 1** (T001-T008): Initialize project
2. **Complete Phase 2** (T009-T022): Build core foundation (TDD approach)
3. **Deliver MVP** (T023-T037): Complete User Story 1
4. **Iterate on Post-MVP**: US2 → US3 → Polish

**Recommended Workflow**:
1. Run `npm create vite@latest` (T001)
2. Install dependencies (T002-T003)
3. Configure tooling (T004-T006)
4. Follow TDD cycle for each feature:
   - Write tests first (Red)
   - Implement to pass tests (Green)
   - Refactor while keeping tests green (Refactor)
5. Commit after each completed user story phase

---

**Status**: Ready for implementation
**Generated**: 2026-01-14
**Validation**: ✅ All tasks follow checklist format, organized by user story, constitutional TDD requirements met
