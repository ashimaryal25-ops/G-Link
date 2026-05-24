# User Flows

## Flow 1: Secretary Runs a Meeting

1. Secretary opens the club workspace.
2. Secretary creates or opens the meeting record.
3. Secretary types raw notes during the meeting.
4. Secretary runs AI formatting.
5. G-Link returns formatted minutes, decision list, task suggestions, and budget mentions.
6. Secretary reviews uncertain fields.
7. Secretary approves the minutes.
8. Approved tasks move into the task board with source links back to the meeting.

Success state:

- The club has clean minutes.
- Tasks are assigned.
- Event and budget references are connected.

## Flow 2: Treasurer Prepares a Funding Request

1. Treasurer opens an event.
2. Treasurer adds expected attendance, budget lines, vendors, and proposal notes.
3. Treasurer runs Proposal Reviewer.
4. G-Link checks the request against funding rules.
5. G-Link returns blockers, warnings, missing documents, and recommended fixes.
6. Treasurer edits the proposal and reruns the review.
7. Treasurer exports or copies the cleaned request for Senate submission.

Success state:

- The treasurer sees likely rejection issues before submitting.
- Findings are specific and tied to rules.

## Flow 3: Club Completes an Event

1. Event chair marks event tasks complete.
2. Treasurer uploads receipts against budget entries.
3. G-Link runs an event audit.
4. G-Link flags missing receipts, mismatched amounts, unresolved tasks, or missing approval notes.
5. Officers resolve issues or create repair tasks.
6. Event is marked report-ready.

Success state:

- The event has enough documentation to support semester or annual reporting.

## Flow 4: Two Clubs Co-Sponsor an Event

1. Club A creates an event.
2. Club A invites Club B to collaborate on that event.
3. Club B accepts.
4. G-Link creates a shared event view.
5. Officers from both clubs assign tasks and track shared logistics.
6. Budget visibility follows configured permissions.
7. Notifications are triggered by real assignments and due dates.

Success state:

- Both clubs coordinate in one event workspace.
- Each club keeps unrelated internal records private.

## Flow 5: Annual Report

1. Officer opens reporting.
2. G-Link scans completed events, minutes, tasks, budget entries, receipts, and proposal reviews.
3. G-Link generates a readiness report.
4. Missing items become repair tasks.
5. Once resolved, G-Link generates the final report.

Success state:

- The report is generated from verified operational history instead of manual reconstruction.
