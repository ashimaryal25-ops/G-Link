# MVP Plan

## MVP Definition

The first version should prove one basic thing: a student officer can open G-Link, see their clubs, enter a club workspace, and understand what is happening with that club's events, meetings, and tasks.

This version is not trying to solve every club problem yet. Campus-wide networking, AI compliance review, email sending, full archives, and detailed budget workflows can come later.

## MVP Product Sentence

G-Link gives student officers one home for their clubs and one workspace where each club can manage events, tasks, meetings, and simple budget totals.

## Current MVP Focus

The first build should prove this loop:

```text
Student Home -> Club Workspace -> Event Workspace -> Meetings and Tasks
```

The app should not feel like separate tools pasted together. Events, meetings, and tasks should connect naturally.

## Must-Have MVP Features

### 1. Auth and Student Home

Every user should have one account and may belong to multiple clubs.

Build:

- Sign up and sign in.
- User profile with name and email.
- Home dashboard showing all clubs the student belongs to.
- Cross-club task list for the logged-in student.
- Upcoming meetings across clubs.
- Upcoming events across clubs.
- Recent task comments or updates relevant to the user.
- Pending club invites.

Success criteria:

- A student in three clubs can sign in once and see what they personally need to do across all three.

### 2. Club Workspaces

Each club gets its own operating space.

Build:

- Club creation.
- Club profile: name, description, campus, optional logo.
- Club navigation: Overview, Meetings, Events, Tasks, Budget, Members, Archive, Settings.
- Role-based membership: president, vice president, secretary, treasurer, event chair, member, advisor.
- Invite member by email.
- Remove/deactivate member.
- Basic permissions by role.

Success criteria:

- An exec can create a club workspace, invite officers, and keep regular members separate from exec roles.

### 3. Meetings

Meetings are the source record for decisions and tasks.

Build:

- Create meeting.
- Meeting title, date, location, and status.
- Raw notes field.
- Final minutes field.
- Decisions section.
- Linked event, optional.
- Tasks created from the meeting.
- Meeting archive after completion.

AI in MVP:

- Optional only after the manual meeting flow works.
- If included, keep it simple: format raw notes into minutes and suggest tasks.
- AI output must remain draft until a human accepts it.

Success criteria:

- A secretary can record a meeting and turn it into approved minutes with linked tasks.

### 4. Events

Events are the command center for club operations.

Build:

- Create event.
- Event title, description, date/time, location, and status.
- Event owner or lead.
- Linked meetings.
- Event-specific task list.
- Event-specific budget.
- Event comments/updates.
- Event archive after completion.

Success criteria:

- A president or event chair can open one event page and see what has to be done, who is doing it, what it costs, and what was already discussed.

### 5. Tasks and Comments

Tasks should be independent objects that can appear in multiple places.

Build:

- Create task manually.
- Task title, description, assignee, due date, status, priority.
- Optional event link.
- Optional meeting source.
- Task comments.
- Status updates: todo, in progress, blocked, done, cancelled.
- Views:
  - My tasks across all clubs.
  - Club task board.
  - Event task list.
  - Meeting-created tasks.

Success criteria:

- A task like "bring speaker" can appear in the event page, the meeting it came from, the assignee's home dashboard, and the club task board.

### 6. Simple Event Budget

The MVP budget should be structured, but not overcomplicated.

Build:

- Planned amount on the event.
- Actual amount on the event.
- Budget summary per event.

Not MVP:

- Full accounting.
- Budget line item ledger.
- Bank syncing.
- Payment processing.
- Reimbursement automation.
- Receipt management.
- Student Senate compliance reviewer.

Success criteria:

- A club officer can see what an event was expected to cost and what it actually cost.

### 7. Archive and Handoff

The archive is core because exec boards change.

Build:

- Completed meeting archive.
- Completed event archive.
- Completed task history.
- Budget history by event.
- Task comments preserved as operational memory.
- Officer handoff notes.
- Club term or academic-year grouping.

Success criteria:

- A new treasurer, secretary, or president can review the previous board's events, budgets, notes, and lessons before planning the next semester.

### 8. Basic In-App Notifications

Notifications should be simple and tied to real work.

Build:

- Task assigned to you.
- Task due soon.
- Comment added to your task.
- Meeting created or updated.
- Event created or updated.

Not MVP:

- Push notifications.
- SMS.
- Email sending.
- Complex notification preferences.

Success criteria:

- A member can tell what changed since they last opened G-Link.

## Communication Scope

Real Outlook/Gmail sending is not part of the MVP.

MVP may include a lightweight communication helper only if the core workspace is done:

- Select recipients from club members.
- Generate or write an announcement draft.
- Copy recipient list.
- Copy message body.
- Store the draft under a club or event.

This avoids OAuth, school admin approval, deliverability issues, and sensitive email permissions during the first product test.

## Explicitly Out Of Scope For MVP

- Real Outlook/Gmail sending.
- Full club-to-club chatroom.
- Campus-wide social feed.
- Cross-club shared event workspaces.
- Shared cross-club budgets.
- Proposal reviewer against bylaws.
- Full audit automation.
- Annual report generator.
- Mobile app store release.
- Payment processing.
- Complex analytics.

## Recommended Build Order

### Milestone 1: App Shell and Data Foundation

Build:

- React PWA scaffold.
- Supabase connection.
- Auth.
- Database tables for users, clubs, memberships, club terms, events, meetings, tasks, task comments, budget entries, and handoff notes.
- Basic protected routes.

Done when:

- A signed-in user can create a club and see the club workspace.

### Milestone 2: Multi-Club Home and Memberships

Build:

- Student home dashboard.
- Club list for the user.
- Invite member flow.
- Role display and basic role permissions.

Done when:

- A user can belong to more than one club and switch between them cleanly.

### Milestone 3: Meetings and Tasks

Build:

- Meeting CRUD.
- Raw notes and final minutes.
- Attendees and decisions.
- Manual task creation from meeting.
- My Tasks and Club Tasks views.
- Task comments.

Done when:

- A meeting can produce tasks that show up in the right places.

### Milestone 4: Events

Build:

- Event CRUD.
- Event detail page.
- Link meetings to events.
- Link tasks to events.
- Event comments.

Done when:

- An event page becomes the central view for event work.

### Milestone 5: Budget

Build:

- Event budget lines.
- Planned vs actual amount.
- Category, vendor, and status.
- Receipt note or placeholder.
- Event budget summary.

Done when:

- An event has a usable financial record.

### Milestone 6: Archive and Handoff

Build:

- Mark meetings/events complete.
- Archive views.
- Club term grouping.
- Officer handoff notes.
- Clone prior event into new draft event, if time allows.

Done when:

- A new officer can learn from completed club history.

### Milestone 7: Optional AI Assist

Build only after the manual flows are stable:

- Format raw notes into minutes.
- Suggest tasks from meeting notes.

Done when:

- AI helps reduce typing but does not control the workflow or invent records.

## MVP Acceptance Test

The MVP is good enough when this story works end to end:

1. A student signs in and joins two clubs.
2. One club creates a meeting.
3. The secretary records notes and final minutes.
4. The meeting creates three tasks.
5. One task is linked to an event.
6. The assignee sees the task on their home dashboard.
7. The assignee comments with an update and marks the task done.
8. The treasurer adds event budget lines.
9. The event is completed and archived.
10. A new officer can open the archive and understand what happened.
