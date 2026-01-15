# Feature Specification: Scopa Score Tracker

**Feature Branch**: `001-scopa-scorer`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "I want an application to be able to count score for the scopa card game. I should be able to add players and add / remove point"

## Clarifications

### Session 2026-01-13

- Q: What is the maximum number of players allowed in a game? → A: Enforce strict 2-4 player limit (traditional Scopa rules)

### Session 2026-01-14

- Q: Should the system track the history of score events? → A: Store only current scores (no event history)
- Q: What platform should the Scopa Score Tracker be built for? → A: Web application (browser-based)
- Q: Where should game state be stored? → A: Browser localStorage (client-side storage)
- Q: How should the system handle starting a new game when a game is already active? → A: Prompt for confirmation (warn user that current game will be lost)
- Q: Should the system enforce a maximum point value per score change? → A: Enforce reasonable limit (1-100 points per action)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Setup Game with Players (Priority: P1)

Users need to start a new Scopa game session by adding players before any scoring can begin.

**Why this priority**: Without players, no scoring can occur. This is the foundational capability that enables all other features and represents the minimal viable product.

**Independent Test**: Can be fully tested by creating a game session, adding 2-4 players with names, and verifying the players are registered with zero initial scores. Delivers immediate value by allowing game setup.

**Acceptance Scenarios**:

1. **Given** no active game session, **When** user starts a new game and adds player "Alice", **Then** Alice appears in the player list with 0 points
2. **Given** an active game with one player, **When** user adds players "Bob" and "Carol", **Then** all three players appear in the player list with 0 points each
3. **Given** an active game session, **When** user adds a player with an empty name, **Then** the system rejects the addition and prompts for a valid name
4. **Given** an active game with player "Alice", **When** user attempts to add another player named "Alice", **Then** the system prevents duplicate names and prompts for a unique name

---

### User Story 2 - Add Points to Players (Priority: P2)

During gameplay, users need to award points to players when they score in Scopa (e.g., capturing a scopa, winning cards, coins, settebello, or primiera).

**Why this priority**: Core scoring functionality that enables tracking game progress. Essential for the application's primary purpose but depends on having players already set up.

**Independent Test**: Can be tested by setting up a game with players, adding various point amounts (1 point, multiple points), and verifying the player's score increases correctly. Delivers the main value proposition of score tracking.

**Acceptance Scenarios**:

1. **Given** a game with player "Alice" at 0 points, **When** user adds 1 point to Alice, **Then** Alice's score becomes 1
2. **Given** a game with player "Bob" at 3 points, **When** user adds 2 points to Bob, **Then** Bob's score becomes 5
3. **Given** a game with multiple players, **When** user adds points to one player, **Then** only that player's score changes, others remain unchanged
4. **Given** a game with players, **When** user attempts to add 0 or 101 points, **Then** the system rejects the operation and displays an error message (valid range: 1-100)
5. **Given** a game in progress, **When** user views the current scores, **Then** all players are displayed with their current point totals in a clear, readable format

---

### User Story 3 - Remove Points from Players (Priority: P3)

Users need to correct scoring mistakes by removing points from players when points were incorrectly awarded.

**Why this priority**: Error correction is important for accuracy but not essential for basic gameplay. Players can work around this by restarting the game if needed, making it lower priority than core scoring.

**Independent Test**: Can be tested by setting up a game, adding points to a player, then removing points, and verifying the score decreases correctly. Delivers convenience and error recovery.

**Acceptance Scenarios**:

1. **Given** a game with player "Alice" at 5 points, **When** user removes 1 point from Alice, **Then** Alice's score becomes 4
2. **Given** a game with player "Bob" at 3 points, **When** user removes 3 points from Bob, **Then** Bob's score becomes 0
3. **Given** a game with player "Carol" at 2 points, **When** user attempts to remove 3 points from Carol, **Then** the system prevents the operation and keeps the score at 2 (scores cannot go negative)
4. **Given** a game with multiple players, **When** user removes points from one player, **Then** only that player's score changes, others remain unchanged
5. **Given** a game with players, **When** user attempts to remove 0 or 101 points, **Then** the system rejects the operation and displays an error message (valid range: 1-100)

---

### Edge Cases

- What happens when a user tries to add a 5th player when 4 players are already registered? System must reject and display an error message
- What happens when a user tries to remove points that would make the score negative? System prevents the operation and maintains the score at 0 or above (per FR-007)
- What happens if a user tries to add an extremely large point value (e.g., 9999)? System rejects values outside the 1-100 range per action and displays an error message
- What happens if a user tries to add 0 or negative points? System rejects the operation and displays an error message requiring positive values (1-100)
- How does the system handle very long player names or special characters in names?
- What happens if a user starts a new game while an existing game is in progress? System displays a confirmation prompt warning that the current game will be lost

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create a new game session
- **FR-002**: System MUST allow users to add players to an active game session
- **FR-003**: System MUST require each player to have a unique name within a game session
- **FR-004**: System MUST initialize each new player with a score of 0 points
- **FR-005**: System MUST allow users to add points to any player in increments between 1 and 100 points per action
- **FR-006**: System MUST allow users to remove points from any player in increments between 1 and 100 points per action
- **FR-007**: System MUST prevent player scores from becoming negative
- **FR-008**: System MUST display all players and their current scores in real-time
- **FR-009**: System MUST support a minimum of 2 players and a maximum of 4 players (traditional Scopa limit)
- **FR-010**: System MUST persist the current game state (player names and current scores only) to browser localStorage so scores are not lost if the application is closed unexpectedly
- **FR-011**: System MUST allow users to start a new game, which resets all scores and clears the player list
- **FR-012**: System MUST prompt users for confirmation before starting a new game when an active game with players exists, warning that current progress will be lost
- **FR-013**: System MUST reject point changes (add or remove) that are outside the valid range of 1-100 points per action and display an appropriate error message

### Assumptions

- Application is delivered as a web application accessible via modern browsers (Chrome, Firefox, Safari, Edge)
- Game state is persisted using browser localStorage (client-side only, not synced across devices or browsers)
- Points are tracked as simple positive integers (0 or greater)
- The application does not enforce specific Scopa scoring rules (e.g., what constitutes a valid score) - users manage scoring logic
- The application tracks one game session at a time (no multi-game management in MVP)
- Player names are text strings with reasonable length limits (e.g., 1-30 characters)
- The application does not require authentication or user accounts in MVP
- The system stores only current game state (player names and current scores); no historical event tracking or audit trail
- No backend server or database required (pure client-side application)

### Key Entities

- **Game Session**: Represents an active Scopa game with a collection of players and their scores
- **Player**: Represents a participant in the game with attributes: unique name, current score (integer ≥ 0)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can set up a new game and add all players in under 30 seconds
- **SC-002**: Users can add or remove points from any player in under 5 seconds
- **SC-003**: System displays updated scores immediately after any score change (within 1 second)
- **SC-004**: 95% of users can complete a full game session without scoring errors or confusion
- **SC-005**: System maintains accurate score totals across the entire game session without data loss
- **SC-006**: Users can track a complete Scopa game (typically 11-21 points per game) without performance degradation
