# AI Protocol

The AI layer is a structured parser and governance linter. It should create explainable records, not opaque chat output.

## AI Roles

### 1. Minutes Parser

Input:

- Raw meeting notes.
- Club context.
- Optional event context.
- Known member names and roles.

Output:

- Formatted minutes.
- Decisions made.
- Motions and votes when present.
- Events mentioned.
- Tasks with likely owners and due dates.
- Budget items mentioned.
- Ambiguities that require human confirmation.

Rules:

- Never silently invent attendees, approvals, vote counts, dollar amounts, or dates.
- Mark uncertain extracted fields as `needs_confirmation`.
- Preserve original raw notes.
- Generated minutes remain draft until a human approves them.

### 2. Task Extractor

Input:

- Meeting minutes or raw notes.
- Existing tasks for the same event or meeting.

Output:

- New task suggestions.
- Suggested updates to existing tasks.
- Duplicate warnings.

Rules:

- Do not create tasks automatically without a review step in early MVP.
- Every AI-created task should reference its source meeting.
- Each task should have a concrete verb, owner if available, and due date if stated or inferable from explicit context.

### 3. Proposal Reviewer

Input:

- Event details.
- Budget entries.
- Expected attendance.
- Proposal text.
- Funding rules/bylaws.
- Lead time and submission deadline.

Output:

- Pass/warning/fail result.
- Specific findings mapped to funding rules.
- Missing documentation checklist.
- Recommended fixes.

Rules:

- Cite the rule or bylaw source for every compliance finding when source text exists.
- Separate hard blockers from risk warnings.
- Do not claim approval is guaranteed.
- Show what changed between review runs when possible.

Example finding:

```json
{
  "severity": "blocking",
  "title": "Food request exceeds per-person cap",
  "rule_id": "food-cap-2026",
  "explanation": "The request is $14.50 per attendee while the configured cap is $12.00.",
  "recommended_fix": "Reduce the food line to $360 for 30 attendees or add another approved funding source."
}
```

### 4. Audit Protocol

Input:

- Event records.
- Meeting minutes.
- Tasks.
- Budget entries.
- Receipts.
- Proposal reviews.

Output:

- Missing evidence list.
- Inconsistencies.
- Report readiness score.
- Suggested repair tasks.

Checks:

- Every completed event has at least one record of approval or planning discussion.
- Every spent budget entry has a receipt.
- Receipt totals match budget entry totals within configured tolerance.
- Reimbursements have claimant, receipt, and approval trail.
- Co-sponsored event costs identify the responsible club.
- Tasks marked done have enough context to support report generation.

## Human Review Boundary

AI can draft, flag, and recommend. Humans approve minutes, submit proposals, finalize budgets, and resolve audit exceptions.

