# Technical Decisions

## Manual First

- No AI yet
- Build normal event, meeting, and task flows first
- Meeting MVP uses raw notes and decisions / conclusions
- AI can come after records make sense

## Event Centered

- Events are the main workspace
- Event shows description, lead, status, budget, tasks, meetings
- Tasks and meetings should connect back to events

## Budget

- Keep budget simple for now
- Use planned budget
- Use actual budget
- No budget line item ledger yet
- No receipts yet
- No reimbursements yet

## Storage

- Use `localStorage` for prototype
- Good enough for testing flow
- Not final backend
- Supabase later

## Roles

- Store roles now
- Keep role UI simple
- Add stricter permissions later

## Not Yet

- Auth
- Database
- Full budget ledger
- Attendance
- Archive
- Notifications
- AI
