# Anansi Agent Learning Protocol

Use this after meaningful feedback, reference intake, prompt tests, output evaluations, or user corrections.

## Trigger Learning When

- the team or the creative lead says an output is wrong, weak, generic, shallow, or not useful
- a prompt succeeds or fails in a model or render system
- a reference reveals a reusable taste, story, shot, or prompt pattern
- the agent confuses artifact types or misses required detail
- a project introduces a recurring rule

## Required Loop

1. Capture the concrete experience.
2. Notice what worked, failed, or changed perception.
3. Explain the reusable lesson.
4. Structure it into a rule, directive, template, rubric, retrieval card, or prompt pattern.
5. Test the revised behavior on the next output.
6. Re-perceive the result and update again only if needed.

## Learning Record

```md
## Learning Record

- Trigger:
- Agent affected:
- Concrete example:
- What failed or worked:
- Reusable lesson:
- Rule/template/retrieval update:
- Files or notes updated:
- Next test:
- Public-safe:
```

## Runway Render Learning Targets

- prompt payload structure
- variant strategy
- output quality evaluation
- failure-mode diagnosis
- revision instructions
- model-specific adaptation

## Client Feedback Learning

When feedback belongs to a named client, first update `22 Local Style Memory/Clients/<Client Name>/Feedback Log.md`.

- One occurrence stays a project note.
- Two similar occurrences become a candidate pattern in the client's `Pattern Ledger.md`.
- Three similar occurrences or one explicit standing instruction become a stable rule in the client's `Client Style Profile.md`.
- Client-specific render preferences should become prompt constraints for that client, not global Runway rules, unless the team or the creative lead explicitly generalizes them.

## Filing

- raw/private Runway tests: `05 Manual Runway Tests/`
- reusable prompt rules: `02 Extracted Patterns/`
- quality/rubric updates: `10 Rubrics/`
- the creative lead prompt revision rules: `12 the creative lead Creative Director/`
- agent behavior changes: update the relevant skill/template/directive

## Rule

If a correction changes how the agent should behave next time, update the governing directive, template, or skill. The next output should visibly reflect the correction.
