# Failure Taxonomy

A shared vocabulary for what went wrong in a run or a PR. Its purpose is counting: the weekly Harness Improver and the human audit can only compare failures that carry the same names. A single success rate hides the difference between an agent that could not finish and one that weakened a test to pass.

Adapted from SoftFactory's `05_FAILURE_TAXONOMY_v0.1.md`. The classes use words instead of that document's letter codes, because `B1`, `D1` and `F1` already name checklist items here.

## How it is used
- **The Reviewer** names the class of every `FAIL` and `UNSURE` in its report's "Failure classes" line. The checklist item ID stays the detail; the class is the coarse count.
- **An agent that stops** (fails closed) names the stop class in report section 6.
- **A human** applies the matching label to the PR or issue: `failure:<class>`, `blocked:<class>` or `factory:<class>`. Later the workflow will do this from the Reviewer's report.
- **When a fix is decided**, whoever proposes it adds one `cause:<layer>` label. That is what stops every failure being "fixed" with one more sentence in a prompt.
- **Reports never show only a success rate.** They show the count per class. One `damage` outweighs many `incomplete`.

## Failures: the agent's work is wrong
| Class | Meaning | Caught by | Critical |
|---|---|---|---|
| `incomplete` | The PR does not deliver everything that was asked, including its report, or the agent gave up. | A1, G3 | |
| `over-budget` | The run hit a token, time or retry cap. | run caps | |
| `acceptance` | The work exists but does not meet the bar: a requirement has no passing test, or a correctness, design, security or operability item fails. | B1-B3, C1, C3, C4, D1-D6, E2, E4, F1-F3; `fail_to_pass`, `mutation_changed`, Verifier | |
| `regression` | New work passes its own tests but breaks behavior that worked before. | `full_suite`, `integration_twins`; a revert after merge | |
| `scope` | The PR changes things outside what was asked or outside what its class may touch. | A2-A4, B5, G1; `classify`, `diff_size` | on repeat |
| `gate-tampering` | The agent changed a check to get a pass: deleted, skipped or weakened a test, disabled a rule, edited sensor config, or worked around the environment. | C2, G2; `test_integrity`, `workaround_scan` | yes |
| `policy` | The agent used or tried to use something it may not: an unapproved dependency, a one-way data change, a host outside the allowlist, a path or permission outside its sandbox. | B4, E3, E5; `classify`, human labels | yes |
| `false-claim` | The report says something that is not true, or claims a check that was not run. | G4 | |
| `damage` | Something was destroyed or exposed: a committed secret, lost work, rewritten history, an irreversible change outside scope. | E1; `secret_scan` | yes |

**Critical classes are never retried automatically.** A human looks the same day. One that a deterministic gate or a human confirms also demotes the change class, whether or not the PR merged (`change-classes.yaml`, demotion). The Reviewer's word alone does not demote: it is advisory. A retry is fine for `incomplete`, `over-budget` and `acceptance`.

## Stops: the agent correctly refused to continue
These are not failures of the agent. Each one points at something a human or the factory must supply.

| Class | Meaning |
|---|---|
| `blocked:spec-unclear` | The spec cannot be carried out without guessing what was meant. |
| `blocked:needs-human` | The work depends on a decision or approval nobody has given. |
| `blocked:environment` | A tool, credential, service or setup step is missing or broken. |
| `blocked:dependency` | Other work this depends on is not finished. |
| `blocked:unsupported` | The factory cannot safely do this kind of work yet: no template fits, or the class is at L0. |

## Factory failures: the factory itself is wrong
| Class | Meaning |
|---|---|
| `factory:gate` | A gate, the Reviewer or the Verifier crashed, or gave a result that was wrong. |
| `factory:environment` | The sandbox, CI or a runner failed for reasons unrelated to the change. |
| `factory:provider` | The model was unavailable, rate-limited, or returned an invalid response. |
| `factory:records` | A report, provenance trailer or cost figure is missing or inconsistent, so the run cannot be audited. |

## Root-cause layer: where the fix belongs
One per fix. Pick the layer that, once changed, would have prevented the failure.

| Layer | The fix changes |
|---|---|
| `cause:spec` | The spec or how specs are written. |
| `cause:instructions` | A guide: `AGENTS.md`, a skill, a template's documentation. |
| `cause:sensor` | A check: a gate, a lint rule, a checklist item, a self-test case. |
| `cause:environment` | The sandbox, CI, a tool or a template's setup. |
| `cause:policy` | `change-classes.yaml`: a class, a limit, an autonomy level. |
| `cause:model` | The model or its settings. Use only when the other layers are ruled out. |
| `cause:human` | Something a human had to provide and did not. |
| `cause:unknown` | Not yet understood. Revisit before closing. |

Prefer `cause:sensor` over `cause:instructions` when both would work. A check is enforced; a sentence can be ignored.

## Not adopted yet
SoftFactory also defines planning classes (a wrong or oversized plan) and UI classes (a design implemented without approval, design drift). Add them when the Spec agent and UI work exist.

## Changelog
- 2026-11-12: first version, adapted from SoftFactory v0.1.
- 2026-11-12: a confirmed critical class demotes the change class (owner decision).
