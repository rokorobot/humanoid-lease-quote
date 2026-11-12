# Feature Specification: Monthly lease quote

**Feature Branch**: `001-monthly-quote`

**Created**: 2026-11-12

**Status**: Approved <!-- Draft, then Approved. Only a human sets Approved. -->

**Change class**: feature <!-- Factory addition -->

**Approved by**: Robert Konecny (`rokorobot`), 2026-11-12, in chat ("approved") <!-- Factory addition -->

**Input**: User description: "Someone chooses a robot model, a quantity, a lease term and a service level, and gets a monthly price. Volume discount above a certain fleet size, discount for longer terms with a minimum term, service levels basic and full maintenance, reject impossible input with clear messages."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Get a monthly price for a fleet (Priority: P1)

A prospective customer picks a robot model, how many robots, a lease term and a service level, and sees the monthly price and the total over the whole term, with each discount shown on its own line.

**Why this priority**: The price is the product. Everything else (saving, listing quotes) builds on it.

**Independent Test**: Enter Standard, 20 robots, 24 months, full maintenance, and see 48,320.00 USD per month and 1,159,680.00 USD in total.

**Acceptance Scenarios**:

1. **Given** the quote page, **When** the user picks Compact, 1 robot, 12 months, basic service, **Then** the page shows 1,500.00 USD per month and 18,000.00 USD in total, with no discounts.
2. **Given** the quote page, **When** the user picks Standard, 20 robots, 24 months, full maintenance, **Then** the page shows: list price 48,000.00; volume discount 5% −2,400.00; term discount 5% −2,280.00; full maintenance +5,000.00; monthly price 48,320.00 USD; total 1,159,680.00 USD.
3. **Given** the quote page, **When** the user picks Heavy-duty, 50 robots, 36 months, basic service, **Then** the page shows a 10% volume discount, a 10% term discount, and 157,950.00 USD per month.

---

### User Story 2 - Clear messages for impossible input (Priority: P2)

If the user asks for something that cannot be leased, the page says what is wrong and how to fix it, instead of showing a price.

**Why this priority**: A wrong price shown with confidence is worse than no price.

**Independent Test**: Enter 0 robots and see "Quantity must be between 1 and 500." and no price.

**Acceptance Scenarios**:

1. **Given** the quote page, **When** the quantity is 0, 501, 2.5 or not a number, **Then** the page shows "Quantity must be between 1 and 500." and no price.
2. **Given** a request with a term other than 12, 24 or 36 months, **When** it is submitted, **Then** it is rejected with "Lease term must be 12, 24 or 36 months."
3. **Given** a request with an unknown model or service level, **When** it is submitted, **Then** it is rejected with a message naming the allowed values.
4. **Given** several invalid fields, **When** submitted, **Then** every problem is shown at once, not one at a time.

### Edge Cases

- Quantity exactly 10, 49, 50, 500 sits on a discount or limit boundary: 10 and 49 get 5%, 50 and 500 get 10%, 9 gets none.
- Discounts that produce fractions of a cent are rounded once, at the end, to the nearest cent, halves rounded up.
- The price for the same input is always the same: no dependence on date, time or locale.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST price robots per robot per month: Compact 1,500.00, Standard 2,400.00, Heavy-duty 3,900.00 USD.
- **FR-002**: System MUST compute the list price as the model price times the quantity.
- **FR-003**: System MUST apply a volume discount to the list price: none for 1–9 robots, 5% for 10–49, 10% for 50–500.
- **FR-004**: System MUST apply a term discount after the volume discount, to the already-discounted amount: none for 12 months, 5% for 24, 10% for 36.
- **FR-005**: System MUST add 250.00 USD per robot per month for full maintenance, after both discounts and not discounted itself. Basic service adds nothing.
- **FR-006**: System MUST show the monthly price and the total over the term (monthly price times months), rounded to the cent (half up) only at the end.
- **FR-007**: System MUST show each step: list price, each discount as a percentage and an amount, the maintenance charge, the monthly price and the total.
- **FR-008**: System MUST reject a quantity that is not a whole number from 1 to 500, with "Quantity must be between 1 and 500."
- **FR-009**: System MUST reject a term other than 12, 24 or 36 months, with "Lease term must be 12, 24 or 36 months."
- **FR-010**: System MUST reject an unknown model or service level with a message naming the allowed values, and report every invalid field at once.
- **FR-011**: System MUST show all amounts in USD with two decimals and thousands separators, e.g. "48,320.00 USD".

### Requirement-to-test map _(mandatory, factory addition)_

| Requirement | Test name                                                              | Level |
| ----------- | ---------------------------------------------------------------------- | ----- |
| FR-001      | `quote: prices each model per robot per month`                         | unit  |
| FR-002      | `quote: list price is model price times quantity`                      | unit  |
| FR-003      | `quote: volume discount by fleet size at 9, 10, 49, 50 and 500 robots` | unit  |
| FR-004      | `quote: term discount applies after volume discount`                   | unit  |
| FR-005      | `quote: full maintenance is added after discounts and not discounted`  | unit  |
| FR-006      | `quote: monthly and total are exact to the cent`                       | unit  |
| FR-007      | `quote page: shows every pricing step for a valid quote`               | smoke |
| FR-008      | `quote: rejects quantity 0, 501, 2.5 and non-numbers`                  | unit  |
| FR-009      | `quote: rejects terms other than 12, 24 and 36`                        | unit  |
| FR-010      | `quote: reports every invalid field at once`                           | unit  |
| FR-011      | `quote: formats amounts as USD with two decimals and separators`       | unit  |

### Key Entities _(include if feature involves data)_

- **Quote request**: robot model, quantity, lease term in months, service level.
- **Quote**: the request plus list price, volume discount, term discount, maintenance charge, monthly price and total. Not stored in this feature.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The three worked examples in User Story 1 show exactly the stated amounts.
- **SC-002**: Every invalid input in User Story 2 shows its message and no price.
- **SC-003**: A user can get a quote in under 30 seconds from opening the page.

## Assumptions

- Prices, discounts and limits are placeholders from the owner's plan dated 2026-11-12 and will change; they are business rules, so changing them is a new spec.
- With the current prices every amount is already a whole number of cents, so the rounding rule in FR-006 cannot change any result yet. It is kept so that a future price change is rounded the agreed way; its test only proves amounts are exact to the cent.
- Prices exclude tax. One currency, USD.
- No login: anyone with the link can get a quote.
- Saving a quote and listing saved quotes are later specs (002, 003). Nothing is stored here.
- The template's example "notes" module is left alone in this feature.
