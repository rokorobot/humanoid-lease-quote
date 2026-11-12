# Feature Specification: Save a quote and reopen it by its link

**Feature Branch**: `002-save-quote`

**Created**: 2026-11-12

**Status**: Approved <!-- Draft, then Approved. Only a human sets Approved. -->

**Change class**: schema-migration (adds stored data; the riskiest class in the PR wins) <!-- Factory addition -->

**Size estimate**: 7 FRs × 45 = about 315 lines; class limit 400 <!-- Factory addition -->

**Approved by**: Robert Konecny (`rokorobot`), 2026-11-12, in chat ("approve as recommended": no expiry, public links) <!-- Factory addition -->

**Input**: User description: "Save a quote and show it again by its link."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Save a quote and share its link (Priority: P1)

After getting a quote (spec 001), the user saves it and gets a link they can send to a colleague. Opening the link later shows the same quote.

**Why this priority**: A quote that disappears when the page is closed cannot be shared or used in a buying decision.

**Independent Test**: Get a quote for Standard, 20 robots, 24 months, full maintenance; save it; open the link in a new browser and see 48,320.00 USD per month and the date it was saved.

**Acceptance Scenarios**:

1. **Given** a valid quote on screen, **When** the user saves it, **Then** they are taken to the quote's own link, which shows every pricing step from spec 001 and the date it was saved.
2. **Given** a saved quote's link, **When** anyone opens it later, **Then** they see the same amounts, even if prices have changed since.
3. **Given** a link to a quote that does not exist, **When** it is opened, **Then** the page says "Quote not found." and the response is "not found".

### Edge Cases

- Saving is only offered when a valid quote is on screen. A save request with invalid input is rejected with the spec 001 messages, and nothing is stored.
- Saving the same quote twice creates two separate saved quotes, each with its own link.
- Links must not be guessable or sequential: knowing one link must not lead to another customer's quote.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Users MUST be able to save a valid quote from the quote page.
- **FR-002**: System MUST store the request (model, quantity, term, service), every amount shown (list price, both discounts with their percentages, maintenance, monthly price, total) and the time it was saved.
- **FR-003**: System MUST give each saved quote a random, unguessable link identifier, never a sequence number.
- **FR-004**: After saving, System MUST take the user to the saved quote's link.
- **FR-005**: Opening a saved quote's link MUST show the stored amounts, laid out as in spec 001, and the date saved (UTC, YYYY-MM-DD). It MUST NOT recalculate them.
- **FR-006**: Opening a link that does not exist, or a malformed one, MUST show "Quote not found." with a not-found response.
- **FR-007**: System MUST reject a save with invalid input using the spec 001 messages and store nothing.

### Requirement-to-test map _(mandatory, factory addition)_

| Requirement | Test name                                                         | Level       |
| ----------- | ----------------------------------------------------------------- | ----------- |
| FR-001      | `saved quote: saving from the quote page opens its link`          | smoke       |
| FR-002      | `saved quote: stores the request, every amount and the save time` | integration |
| FR-003      | `saved quote: ids are random and not sequential`                  | integration |
| FR-004      | `saved quote: saving from the quote page opens its link`          | smoke       |
| FR-005      | `saved quote: shows stored amounts, not recalculated ones`        | integration |
| FR-006      | `saved quote: unknown or malformed link is not found`             | integration |
| FR-007      | `saved quote: invalid input is rejected and nothing is stored`    | integration |

### Key Entities _(include if feature involves data)_

- **Saved quote**: a quote from spec 001 frozen at the moment it was saved: the request, every amount, the save time and its link identifier.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A saved quote's link shows exactly the amounts that were on screen when it was saved.
- **SC-002**: Saving and opening the link takes under 10 seconds for a user.

## Assumptions

- No login. Anyone who has a link can see that quote; links are the only protection, which is why they must be unguessable (FR-003).
- Saved quotes hold no personal data: no name, email or company.
- Saved quotes are kept indefinitely. Deleting them is out of scope.
- Listing saved quotes is spec 003.
- The template's example notes table and pages stay.
