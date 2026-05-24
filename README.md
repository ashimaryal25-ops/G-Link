# G-Link

G-Link is a vertical SaaS for student organizations. Its purpose is to become the single source of truth for a club's documentation, tasks, events, budgets, receipts, compliance history, and institutional memory.

The product is not a social network. It is a logistics and governance system for club officers who need to run meetings, assign work, track spending, prepare funding requests, and survive audits without rebuilding the same information in five separate tools.

## Real Objective

Doing the work should automatically handle the bureaucracy.

When an officer takes meeting notes, G-Link should turn those notes into institutional minutes, extract action items, connect those tasks to events, and keep the club's operational record current. When money is requested or spent, G-Link should tie the budget line to an event, receipt, task, and approval trail so the semester-end report is already mostly complete.

Because student organizations change leadership every semester or year, G-Link should also preserve how the club operated before. New exec boards should be able to review prior meetings, recurring events, budgets, task timelines, vendors, mistakes, and final reports so they do not have to relearn the club from scratch.

## Product Pillars

1. **Documentation: The Secretary's Slate**
   - Meeting minutes workspace.
   - Raw notes become formatted institutional records.
   - Decisions, motions, attendees, events, budget discussions, and action items are extracted into structured data.

2. **Tasks: The Operations Engine**
   - Shared board for E-board work.
   - Tasks can be created manually or automatically extracted from minutes.
   - Every task can belong to a club, event, meeting, owner, and due date.

3. **Budget: The Financial Ledger**
   - Club funds are tracked as event-linked ledger entries, not disconnected spreadsheet rows.
   - Requests, approvals, receipts, reimbursements, and spending categories share one history.
   - Every dollar should be traceable to a purpose, event, and supporting document.

4. **Logic Gate: Proposal Review and Audit**
   - AI reviews proposed spending against Student Senate bylaws and local funding rules.
   - AI flags likely rejection risks before submission.
   - Audit checks compare minutes, tasks, budget entries, receipts, and event records for missing evidence.

5. **Connection Layer**
   - Clubs can collaborate on a specific shared event without merging all club data.
   - Co-sponsored events have shared tasks, shared budget visibility, and clear ownership.
   - Notifications are high-signal because they come from real operational assignments.

6. **Institutional Memory**
   - Completed meetings, events, budgets, tasks, comments, receipts, and reports remain searchable archives.
   - New officers can review how previous boards planned events, spent money, contacted partners, and handled problems.
   - Recurring events can be cloned from prior years with their old task lists, budgets, and notes as a starting point.

## Suggested Stack

- **Frontend:** React PWA with responsive desktop/mobile workflows.
- **Backend:** Supabase or another PostgreSQL-backed service.
- **Database:** Relational PostgreSQL model with clubs, events, meetings, tasks, budget entries, receipts, documents, memberships, and collaborations.
- **AI Layer:** Parser and linter, not just chat.
- **Deployment:** Vercel for the web app, Supabase for database/auth/storage.

## Repo Map

- [docs/product-brief.md](docs/product-brief.md): Product definition and user outcomes.
- [docs/data-model.md](docs/data-model.md): Core relational model.
- [docs/ai-protocol.md](docs/ai-protocol.md): AI parser, reviewer, and audit responsibilities.
- [docs/institutional-memory.md](docs/institutional-memory.md): Archive and officer-transition logic.
- [docs/mvp-plan.md](docs/mvp-plan.md): Recommended build sequence.
- [docs/user-flows.md](docs/user-flows.md): Primary workflows for club officers.
