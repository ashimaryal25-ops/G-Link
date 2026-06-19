# MVP Plan

## Goal

Prove that a student officer can open G-Link, enter a club, and understand the club's active events, meetings, and assigned work.

## Core Loop

```text
Student Home -> Club Workspace -> Event -> Meeting -> Task
```

## Implemented

- [x] demo sign-in
- [x] multi-club Student Home
- [x] club roles and executive board
- [x] club overview
- [x] create and edit events
- [x] planned and actual event budget totals
- [x] create and edit meetings
- [x] meeting notes and conclusions
- [x] link meetings to events
- [x] create, assign, edit, complete, and remove tasks
- [x] link tasks to events and meetings
- [x] personal and club task views
- [x] connected navigation between records
- [x] responsive layout and empty states
- [x] local browser persistence

## Next

- [ ] Supabase Auth
- [ ] PostgreSQL persistence
- [ ] row-level security
- [ ] server-side role checks
- [ ] real club creation and invitations
- [ ] pilot with one or two executive boards

## Later

- officer handoff archive
- notifications
- comments and updates
- calendar and meeting-link integrations
- email integration
- cross-club collaboration
- AI-assisted note formatting and task suggestions

## Acceptance Test

1. A student signs in.
2. The student opens a club.
3. An executive creates an event.
4. A meeting is linked to that event.
5. Notes and conclusions are recorded during the meeting.
6. Follow-up tasks are assigned to club members.
7. The same tasks appear in Student Home, Club Tasks, the event, and the source meeting.
8. Changes remain after refreshing the browser.
