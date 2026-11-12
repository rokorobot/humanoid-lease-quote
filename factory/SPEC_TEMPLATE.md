# Spec Template

Every feature the factory builds starts from a spec in this format, saved as `specs/<NNN-short-name>/spec.md`. The Spec agent writes it. A human approves it. The Implementer builds only from an approved spec and never edits it.

The format is the spec template from GitHub Spec Kit (github/spec-kit v1.4.0, MIT, see `THIRD_PARTY_NOTICES.md`), kept as published so its tooling stays usable. The factory adds four things, each marked "Factory addition": the change class, the size estimate, the approval line, and the requirement-to-test map.

Rules:
- Say what and why, never how. No tech stack, file names, or implementation detail.
- Requirement IDs (`FR-001`) are stable. Never renumber; retire an ID instead of reusing it.
- Every `FR` appears in the requirement-to-test map before approval.
- No `[NEEDS CLARIFICATION]` marker may remain in an approved spec. Each one is a question for a human.
- One spec is one PR. If it cannot fit the change class's diff limit, split it into several specs.
- Estimate the size before approval: about 45 changed lines per functional requirement, code and tests together (spec 001 of humanoid-lease-quote: 11 FRs, 489 lines). Replace the rate when real PRs show a better one. An estimate over the class limit means split the spec now, not after it is built.

Copy everything below the line.

---

# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft <!-- Draft, then Approved. Only a human sets Approved. -->

**Change class**: [from factory/change-classes.yaml, e.g. feature] <!-- Factory addition -->

**Size estimate**: [N FRs × 45 = about N lines; class limit L] <!-- Factory addition -->

**Approved by**: [human and date. Empty until approved.] <!-- Factory addition -->

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Requirement-to-test map *(mandatory, factory addition)*

<!--
  One row per functional requirement. The fail_to_pass gate runs each named test on the base
  branch, where it must fail, and on the PR, where it must pass.
-->

| Requirement | Test name | Level |
|---|---|---|
| FR-001 | `[name of the test that proves it]` | unit / integration / smoke |

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Assumption about target users, e.g., "Users have stable internet connectivity"]
- [Assumption about scope boundaries, e.g., "Mobile support is out of scope for v1"]
- [Assumption about data/environment, e.g., "Existing authentication system will be reused"]
- [Dependency on existing system/service, e.g., "Requires access to the existing user profile API"]
