# PR Report Template

Every agent-authored PR uses sections 0-6 as its description. The Implementer fills them in. Sections 7 and 8 come from the Reviewer and the Verifier. They are posted as separate comments, by the agent or by a workflow step on its behalf, and never in the description, because the author can edit the description.

How much a human reads depends on the autonomy level in `change-classes.yaml`. At L1: this report and the diff. At L2: this report, and the diff only when something raises a flag (Staltz #10).

Rules for whoever fills it in:
- Write in plain English, short sentences. Write so someone who has not seen the code can decide whether to merge.
- Keep sections 0-6 under 60 lines. If that is not enough, the PR is too big.
- Never leave a section out. Write "None." if it is empty, or "N/A: <class>" if it does not apply to the change class.
- Every claim needs evidence: a CI link, a command and its result, a test name, or `file:line`.
- Never claim something you did not run. "Not run" is a valid answer; a guess is not.
- If the run fails closed and opens no PR, post sections 1 and 6 as a comment on the issue instead.

Copy everything below the line, down to the end of section 6.

---

## 0. Decision needed
<!-- One line: what you are asking the human to decide. One line: the biggest risk. -->

## 1. Intent
<!-- One or two sentences: what changes for the user or system, and why. No implementation detail. -->

**Spec / issue:** <!-- link -->
**Change class:** <!-- as assigned by Triage, from factory/change-classes.yaml. CI derives its own; the riskier one wins. -->
**Autonomy level:** <!-- L1, L2, L3, as the class currently allows -->
**Run:** <!-- run ID, pinned model ID, skill@sha, attempt n of max, tokens used, minutes, transcript link -->

## 2. Requirements coverage
| Spec ID | Done? | Where (file:line) | Test |
|---|---|---|---|
| FR-001 | yes / partial / no | | `test_name` |

## 3. What changed
<!-- Bullets, one per behavior change, in English. Not a file list. -->
-

**Files touched:** <!-- count, and any outside the expected area with a one-line reason -->
**Diff size:** <!-- +added / -removed, excluding generated and lockfiles -->

## 4. Evidence it works
**Fail-to-pass:** <!-- link to CI's fail_to_pass run. Do not type results by hand; CI's run is the evidence. -->

**Checks run:**
| Check | Command | Result | Where |
|---|---|---|---|
| Format + lint | | | CI link, or "local" |
| Type check | | | |
| Tests (changed scope) | | | |
| Full suite | | not run / pass / fail | |

**Demo:** <!-- screenshot, CLI output, or curl transcript showing the behavior. "None" for non-observable changes, with a reason. -->

## 5. Risk
- **What could break:** <!-- the most likely failure in production, specifically -->
- **Blast radius:** <!-- who or what is affected if it does -->
- **Reversibility:** <!-- revert is enough / needs data fix / one-way. One-way needs the `one-way-approved` label from a code owner; saying so here is not approval. -->
- **Breaking changes:** <!-- public API, CLI, config, schema, or wire format, or "None" -->
- **Flag:** <!-- name and default, or "none" with reason -->
- **New dependencies:** <!-- name@version and why, or "None" -->

## 6. Not done, assumptions, questions
- **Deliberately not done:** <!-- things the spec could be read to include that you left out -->
- **Assumptions:** <!-- every guess you made where the spec was silent -->
- **Environment problems hit:** <!-- missing tools, broken setup, flaky tests. You must report these, not work around them. If you stopped, name the stop class from factory/FAILURE_TAXONOMY.md. -->
- **Questions for a human:**

---

## 7. Review (the Reviewer's report, posted as a separate comment)
**Summary:** <!-- First line. BLOCK count, WARN count. One sentence: merge-ready or not, and why. -->
**Failure classes:** <!-- from factory/FAILURE_TAXONOMY.md, with item IDs, e.g. scope (A2), false-claim (G4). "none" if clean. -->
**Reviewed commit:** <!-- head SHA. A review of an older commit does not count. -->
**Reviewer:** <!-- run ID, pinned model ID -->
**Checklist version:** <!-- git SHA of factory/REVIEW_CHECKLIST.md -->

| ID | Verdict | Evidence |
|---|---|---|
| A1 | PASS / FAIL / N/A / UNSURE | `file:line` or CI link, one sentence |

**Other observations (max 3, non-blocking):**
-

## 8. Verification (the Verifier's verdict, posted as a separate comment)
**Verdict:** PASS / FAIL
**Verified commit:** <!-- head SHA -->
**Verifier:** <!-- run ID, pinned model ID, run n of max_verifier_runs_per_pr -->
**Holdout scenarios:** <!-- n run, n passed. Counts only. Never names or contents: each one would tell the Implementer what to tune for. -->
**Built artifact checked against spec:** <!-- what was run, and what was seen -->

---

<!-- Commit trailers the Implementer adds to every commit:
Factory-Run: <run id>
Factory-Model: <pinned model id, never an alias>
Factory-Skill: <skill name>@<git sha>
Factory-Spec: <spec id>
Factory-Class: <change class>
-->
