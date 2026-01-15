# Data Model: Scopa Score Tracker

**Feature**: `001-scopa-scorer`
**Date**: 2026-01-14
**Related Docs**: [spec.md](./spec.md) | [plan.md](./plan.md) | [research.md](./research.md)

---

## Overview

This document defines the core data entities, their relationships, validation rules, and state transitions for the Scopa Score Tracker web application.

**Design Principles**:
- Simple, flat data model (YAGNI - no complex relationships needed for MVP)
- Immutable entities where possible (easier testing and reasoning)
- Validation at entity boundaries (fail-fast)
- Single source of truth (game session contains all state)
- TypeScript interfaces for type safety

---

## Entity Definitions

### 1. Player

**Purpose**: Represents a participant in a Scopa game session.

**TypeScript Interface**:
```typescript
interface Player {
  readonly name: string;  // 1-30 chars, unique within game
  readonly score: number; // >= 0, cannot be negative
}
```

**Invariants**:
- Name must be unique within a game session (FR-003)
- Score must never be negative (FR-007)
- Name cannot be empty string or whitespace-only
- Name length: 1-30 characters

**Validation Rules**:
```typescript
function validatePlayerName(name: string): void {
  if (!name || !name.trim()) {
    throw new ValidationError("Player name cannot be empty");
  }
  if (name.length > 30) {
    throw new ValidationError(
      `Player name too long: ${name.length} chars (max 30)`
    );
  }
}

function validateScore(score: number): void {
  if (score < 0) {
    throw new ValidationError(`Score cannot be negative: ${score}`);
  }
  if (!Number.isInteger(score)) {
    throw new ValidationError(`Score must be an integer: ${score}`);
  }
}
```

**JSON Representation**:
```json
{
  "name": "Alice",
  "score": 5
}
```

---

### 2. GameSession

**Purpose**: Represents an active Scopa game with players and their scores.

**TypeScript Interface**:
```typescript
interface GameSession {
  readonly gameId: string;           // UUID v4
  readonly players: readonly Player[]; // 2-4 players (readonly array)
  readonly createdAt: string;        // ISO 8601 timestamp
  readonly lastUpdated: string;      // ISO 8601 timestamp
}
```

**Invariants**:
- Must have at least 2 players (per FR-009)
- Must have at most 4 players (per FR-009)
- All player names must be unique
- `lastUpdated` must be >= `createdAt`

**Constants**:
```typescript
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;
const MIN_SCORE_DELTA = 1;
const MAX_SCORE_DELTA = 100;
```

**Factory Function**:
```typescript
function createNewGame(): GameSession {
  const now = new Date().toISOString();
  return {
    gameId: crypto.randomUUID(),
    players: [],
    createdAt: now,
    lastUpdated: now,
  };
}
```

**Validation Rules**:
```typescript
function validateGameSession(game: GameSession): void {
  if (game.players.length < MIN_PLAYERS) {
    throw new ValidationError(
      `Game requires at least ${MIN_PLAYERS} players, got ${game.players.length}`
    );
  }
  if (game.players.length > MAX_PLAYERS) {
    throw new ValidationError(
      `Game supports maximum ${MAX_PLAYERS} players, got ${game.players.length}`
    );
  }

  // Check unique names
  const names = game.players.map(p => p.name);
  const uniqueNames = new Set(names);
  if (names.length !== uniqueNames.size) {
    const duplicates = names.filter((name, index) =>
      names.indexOf(name) !== index
    );
    throw new ValidationError(`Duplicate player names: ${duplicates.join(', ')}`);
  }
}
```

**JSON Representation**:
```json
{
  "gameId": "550e8400-e29b-41d4-a716-446655440000",
  "players": [
    {"name": "Alice", "score": 5},
    {"name": "Bob", "score": 3}
  ],
  "createdAt": "2026-01-14T10:00:00Z",
  "lastUpdated": "2026-01-14T10:15:00Z"
}
```

---

### 3. StoredData (Persistence Schema)

**Purpose**: Wrapper for localStorage with schema versioning.

**TypeScript Interface**:
```typescript
interface StoredData {
  readonly version: string;      // Schema version (e.g., "1.0.0")
  readonly gameState: GameSession | null; // null = no active game
}
```

**Current Version**: `1.0.0`

**Validation**:
```typescript
function validateStoredData(data: unknown): StoredData {
  if (typeof data !== 'object' || data === null) {
    throw new ValidationError("Invalid stored data: not an object");
  }

  const obj = data as Record<string, unknown>;

  if (obj.version !== "1.0.0") {
    throw new ValidationError(
      `Unsupported schema version: ${obj.version}. Expected 1.0.0`
    );
  }

  if (obj.gameState !== null && typeof obj.gameState !== 'object') {
    throw new ValidationError("Invalid gameState: must be object or null");
  }

  return obj as StoredData;
}
```

**JSON Representation**:
```json
{
  "version": "1.0.0",
  "gameState": {
    "gameId": "550e8400-e29b-41d4-a716-446655440000",
    "players": [
      {"name": "Alice", "score": 5},
      {"name": "Bob", "score": 3}
    ],
    "createdAt": "2026-01-14T10:00:00Z",
    "lastUpdated": "2026-01-14T10:15:00Z"
  }
}
```

---

## Core Operations (Game Logic)

### 1. Add Player

**Signature**:
```typescript
function addPlayer(game: GameSession, name: string): GameSession
```

**Validation**:
- Name is not empty (FR-002)
- Name is unique (FR-003)
- Game has < 4 players (FR-009)

**Returns**: New `GameSession` with player added (immutable update)

**Implementation**:
```typescript
function addPlayer(game: GameSession, name: string): GameSession {
  validatePlayerName(name);

  // Check duplicate
  if (game.players.some(p => p.name === name)) {
    throw new ValidationError(`Player '${name}' already exists in game`);
  }

  // Check max players
  if (game.players.length >= MAX_PLAYERS) {
    throw new ValidationError(
      `Cannot add player: game already has ${MAX_PLAYERS} players (maximum)`
    );
  }

  // Create new player with 0 score (FR-004)
  const newPlayer: Player = { name, score: 0 };

  return {
    ...game,
    players: [...game.players, newPlayer],
    lastUpdated: new Date().toISOString(),
  };
}
```

---

### 2. Add Points

**Signature**:
```typescript
function addPoints(
  game: GameSession,
  playerName: string,
  amount: number
): GameSession
```

**Validation**:
- Player exists
- Amount is between 1 and 100 (FR-005, FR-013)

**Returns**: New `GameSession` with updated score (immutable update)

**Implementation**:
```typescript
function addPoints(
  game: GameSession,
  playerName: string,
  amount: number
): GameSession {
  // Validate amount range
  if (amount < MIN_SCORE_DELTA || amount > MAX_SCORE_DELTA) {
    throw new ValidationError(
      `Invalid score change: ${amount}. Must be between ${MIN_SCORE_DELTA} and ${MAX_SCORE_DELTA}`
    );
  }

  // Find player
  const playerIndex = game.players.findIndex(p => p.name === playerName);
  if (playerIndex === -1) {
    throw new ValidationError(`Player '${playerName}' not found in game`);
  }

  // Create updated player
  const player = game.players[playerIndex];
  const updatedPlayer: Player = {
    ...player,
    score: player.score + amount,
  };

  // Create new players array with update
  const updatedPlayers = [...game.players];
  updatedPlayers[playerIndex] = updatedPlayer;

  return {
    ...game,
    players: updatedPlayers,
    lastUpdated: new Date().toISOString(),
  };
}
```

---

### 3. Remove Points

**Signature**:
```typescript
function removePoints(
  game: GameSession,
  playerName: string,
  amount: number
): GameSession
```

**Validation**:
- Player exists
- Amount is between 1 and 100 (FR-006, FR-013)
- Result score >= 0 (FR-007)

**Returns**: New `GameSession` with updated score (immutable update)

**Implementation**:
```typescript
function removePoints(
  game: GameSession,
  playerName: string,
  amount: number
): GameSession {
  // Validate amount range
  if (amount < MIN_SCORE_DELTA || amount > MAX_SCORE_DELTA) {
    throw new ValidationError(
      `Invalid score change: ${amount}. Must be between ${MIN_SCORE_DELTA} and ${MAX_SCORE_DELTA}`
    );
  }

  // Find player
  const playerIndex = game.players.findIndex(p => p.name === playerName);
  if (playerIndex === -1) {
    throw new ValidationError(`Player '${playerName}' not found in game`);
  }

  // Check for negative result (FR-007)
  const player = game.players[playerIndex];
  const newScore = player.score - amount;
  if (newScore < 0) {
    throw new ValidationError(
      `Cannot remove ${amount} points from ${playerName}. ` +
      `Current score: ${player.score}. ` +
      `This would result in negative score (${newScore}).`
    );
  }

  // Create updated player
  const updatedPlayer: Player = {
    ...player,
    score: newScore,
  };

  // Create new players array with update
  const updatedPlayers = [...game.players];
  updatedPlayers[playerIndex] = updatedPlayer;

  return {
    ...game,
    players: updatedPlayers,
    lastUpdated: new Date().toISOString(),
  };
}
```

---

## Relationships

```text
GameSession (1) ──── contains ──── (0..4) Player
```

**Cardinality**:
- One `GameSession` contains 0 to 4 `Player` entities
- `Player` entities exist only within a `GameSession` (no independent lifecycle)
- Players are identified by name within a game (name is unique key per game)

**No Complex Relationships**:
- No many-to-many relationships (YAGNI)
- No foreign keys or references between entities
- Simple containment model (game owns players)

---

## State Transitions

### GameSession Lifecycle

```text
[Start] → createNewGame() → [Empty Game]
[Empty Game] → addPlayer() → [Has 1 Player]
[Has 1 Player] → addPlayer() → [Active Game] (2+ players)
[Active Game] → addPlayer() → [Active Game] (3-4 players)
[Active Game] → addPoints() → [Active Game]
[Active Game] → removePoints() → [Active Game]
[Active Game] → createNewGame() → [Empty Game] (with confirmation)
```

**State Definitions**:
- **Empty Game**: 0-1 players (cannot start gameplay, waiting for more players)
- **Active Game**: 2-4 players (can perform score operations)
- **Terminal States**: None in MVP (no game end detection)

**Invalid Transitions**:
- Cannot add player if game has 4 players (max limit)
- Cannot remove points if result would be negative
- Cannot modify scores if player doesn't exist
- Cannot add/remove <1 or >100 points per action

### Player Score Transitions

```text
[New Player: score=0]
    → addPoints(n) → [score=n]
    → addPoints(m) → [score=n+m]
    → removePoints(k) → [score=n+m-k] (if n+m-k >= 0)
    ⊗ removePoints(n+m+1) (would be negative, rejected)
```

**Rules**:
- Score always starts at 0 (FR-004)
- Score can only change by 1-100 per operation (FR-013)
- Score cannot go below 0 (FR-007)
- All operations are immutable (return new GameSession)

---

## Serialization / Deserialization

### LocalStorage Operations

**Save**:
```typescript
function saveToLocalStorage(game: GameSession | null): void {
  const data: StoredData = {
    version: "1.0.0",
    gameState: game,
  };

  try {
    localStorage.setItem('scopa-game-state', JSON.stringify(data));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new StorageError('localStorage quota exceeded');
    }
    throw new StorageError(`Failed to save game: ${error}`);
  }
}
```

**Load**:
```typescript
function loadFromLocalStorage(): GameSession | null {
  try {
    const json = localStorage.getItem('scopa-game-state');
    if (!json) {
      return null; // No saved game
    }

    const data = JSON.parse(json);
    validateStoredData(data);

    if (data.gameState === null) {
      return null;
    }

    validateGameSession(data.gameState);
    return data.gameState;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new StorageError('Corrupted game data: invalid JSON');
    }
    throw error;
  }
}
```

**Clear**:
```typescript
function clearLocalStorage(): void {
  localStorage.removeItem('scopa-game-state');
}
```

---

## Validation Rules Summary

### Player Validation

| Rule | When Checked | Error Message |
|------|-------------|---------------|
| Name not empty | Player creation | "Player name cannot be empty" |
| Name length 1-30 | Player creation | "Player name too long: {len} chars (max 30)" |
| Score >= 0 | Score update | "Score cannot be negative: {score}" |
| Name unique in game | Add player | "Player '{name}' already exists in game" |

### GameSession Validation

| Rule | When Checked | Error Message |
|------|-------------|---------------|
| Min 2 players | Game start/load | "Game requires at least 2 players, got {count}" |
| Max 4 players | Add player | "Cannot add player: game already has 4 players (maximum)" |
| Player exists | Score operations | "Player '{name}' not found in game" |
| Score delta 1-100 | Add/remove points | "Invalid score change: {amount}. Must be between 1 and 100" |
| No negative result | Remove points | "Cannot remove {amount} points from {name}. Current score: {current}. This would result in negative score." |

### Storage Validation

| Rule | When Checked | Error Message |
|------|-------------|---------------|
| Valid JSON | File load | "Corrupted game data: invalid JSON" |
| Required fields present | File load | "Invalid stored data: missing field {field}" |
| Version compatible | File load | "Unsupported schema version: {version}. Expected 1.0.0" |
| QuotaExceeded | File save | "localStorage quota exceeded" |

---

## Performance Characteristics

### Memory Footprint

| Entity | Size Estimate | Notes |
|--------|--------------|-------|
| Player | ~100 bytes | Name (30 chars max) + score (number) |
| GameSession | ~400 bytes | 4 players + metadata |
| JSON string | ~300 bytes | Serialized game with 4 players |

**Scalability**: In-memory operations are O(n) where n = number of players (max 4), so effectively O(1).

### Operation Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| addPlayer | O(n) | Check uniqueness across n players |
| addPoints | O(n) | Find player in array |
| removePoints | O(n) | Find player in array |
| saveToLocalStorage | O(n) | JSON.stringify iterates players |
| loadFromLocalStorage | O(n) | JSON.parse iterates players |

**Note**: With n ≤ 4, all operations complete in microseconds (well under <1s requirement).

---

## Type Definitions (Complete)

```typescript
// src/core/types.ts

export interface Player {
  readonly name: string;
  readonly score: number;
}

export interface GameSession {
  readonly gameId: string;
  readonly players: readonly Player[];
  readonly createdAt: string;
  readonly lastUpdated: string;
}

export interface StoredData {
  readonly version: string;
  readonly gameState: GameSession | null;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;
export const MIN_SCORE_DELTA = 1;
export const MAX_SCORE_DELTA = 100;
export const STORAGE_KEY = 'scopa-game-state';
export const SCHEMA_VERSION = '1.0.0';
```

---

## Extension Points (Not in MVP)

**Potential Future Extensions** (deferred per YAGNI):

1. **Score History**: Track all score events with timestamps
   - Would require new interface: `ScoreEvent { playerName, delta, timestamp }`
   - Enables undo/redo functionality

2. **Game Statistics**: Track game-level metrics
   - Total hands played, game duration, winner history
   - Would extend `GameSession` with new fields

3. **Multi-Game Management**: Support multiple concurrent games
   - Would require `Map<gameId, GameSession>` structure
   - Storage keys: `scopa-game-${gameId}`

4. **Team Play**: Support 2v2 team games
   - Would require new interface: `Team { name, players }`
   - Relationship changes: `GameSession` → `Team` → `Player`

**Decision**: Do not implement any extensions until explicitly required. Current model is sufficient for MVP.

---

## Testing Strategy

### Unit Test Coverage

| Module | Test Cases |
|--------|-----------|
| Validation | Empty name, long name, negative score, duplicate names, invalid score delta |
| Game Operations | Add player (valid, duplicate, over limit), add/remove points (valid, negative prevention, player not found, invalid range) |
| Serialization | Round-trip (save → load), corrupted JSON, quota exceeded, version mismatch |

### Property-Based Testing

Consider using fast-check for:
- Score operations always maintain score >= 0
- Player list always has unique names
- Serialization round-trip preserves all data
- Immutability: operations never mutate input

### Integration Testing

- Full workflow: create game → add players → modify scores → save → load → verify
- localStorage disabled (private browsing): graceful degradation
- Performance: ensure all operations complete in <100ms

---

## Summary

**Core Entities**: `Player`, `GameSession`, `StoredData`

**Key Design Decisions**:
- Immutable data structures (functional approach)
- TypeScript interfaces for compile-time safety
- Validation at operation boundaries (fail-fast)
- JSON serialization via native `JSON.stringify/parse`
- Performance: All operations O(n) where n ≤ 4 (effectively constant time)

**Constitution Alignment**:
- ✅ Library-First: Core logic independent of React
- ✅ Test-First: Clear types and validation enable comprehensive testing
- ✅ Observability: Structured errors with context
- ✅ Simplicity: Minimal model, no premature abstractions
- ✅ Versioning: Schema version included for future migrations

**Next Steps**:
1. Define API surface in `contracts/` (if needed)
2. Create `quickstart.md` for development setup
3. Update agent context with technology stack
