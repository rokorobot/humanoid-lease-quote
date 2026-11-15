# Run log

Every agent run leaves one record. The rollout stages are counted from these records (preplan Part 3, `stages` in `change-classes.yaml`), and so will the dashboard (Layer 5).

## Where
On the `run-log` branch of each repo, one file per run: `runs/<YYYY-MM>/<run id>-<attempt>-<agent>.json`. Each file is one JSON line. The branch has no common history with `main` and is never merged.

The first run in a repo creates the branch. A new file per run means runs never edit each other's records. If two runs push at the same moment, the later push is rejected and its `log` job fails. That run is then missing from the log, and the failed job shows it.

## Who writes
Today only the Reviewer (`.github/workflows/reviewer.yml`, job `log`). The job never runs the agent and never checks out PR code. A run that fails is still recorded, with `outcome: failed`. A bug in the record step never stops the review from being posted.

Not recorded yet: interactive agent sessions, such as an Implementer run from a chat. Their PR report's "Run" line is the only record.

## Fields (schema 1)
| Field | Meaning |
|---|---|
| `schema` | Always `1` for this format |
| `finished_at` | UTC time the record was written |
| `repo`, `run_id`, `attempt` | The GitHub Actions run |
| `agent` | `reviewer` |
| `model` | Pinned model ID |
| `prompt_version` | `checklist`: commit that last changed `REVIEW_CHECKLIST.md`. `workflow`: commit of the workflow file |
| `pr`, `head_sha` | The PR and the commit reviewed |
| `change_class` | As the Reviewer derived it, read from its report. `null` if not found |
| `outcome` | `clean` (0 BLOCK), `blocked` (1 or more), `unparsed` (report has no readable summary), `failed` (the review job failed), `unrecorded` (the review passed but its record step did not; the record has only the run fields) |
| `blocks`, `warns` | Counts from the report's summary line |
| `tokens` | `input`, `output`, `cache_read`, `cache_write` |
| `cost_usd`, `duration_ms`, `turns` | As reported by Claude Code. `null` when the run did not finish |

Fields that could not be read are `null`, never guessed.

## Read it
```sh
git fetch origin run-log
git archive origin/run-log runs | tar -xO | jq -s 'group_by(.outcome) | map({outcome: .[0].outcome, runs: length})'
```
