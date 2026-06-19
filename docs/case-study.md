# Technical Case Study

## Challenge

The first prototype displayed too many unrelated tools at once. Events, meetings, tasks, budgets, and profile details all competed for attention.

## Product Decision

The interface was reorganized around a smaller navigation model:

```text
Student Home -> Club Workspace -> Event / Meeting / Task
```

Events became the operational center. Meetings and tasks can connect back to an event, while Student Home summarizes work across clubs.

## Engineering Decisions

### Feature-based components

The initial app logic lived in one large component. It was split into feature files for events, meetings, tasks, creation, Student Home, and the club workspace.

The parent component still owns prototype state, which keeps the data flow explicit:

```text
parent state -> typed props -> feature panel -> callback -> parent update
```

### Connected records

Tasks are not plain checklist strings. Each task can include:

- club
- event
- source meeting
- assignee
- due date
- status

This makes the same task discoverable from multiple useful contexts.

### Explicit edit modes

Event, meeting, and task details are read-only by default. Edit and Save/Cancel states reduce accidental changes and create a consistent interaction pattern.

### Prototype persistence

`localStorage` was chosen to validate the workflow before adding authentication, database migrations, and authorization rules. The storage boundary is isolated in the main app component so it can later be replaced by Supabase.

### Scope control

Several ideas were deliberately deferred:

- attendee tracking
- detailed budget line items
- receipts and reimbursements
- AI-generated minutes
- email and calendar integrations
- social discovery between clubs

The current build tests the core operational workflow first.

## Technical Problems Solved

- prevented malformed saved data from trapping the app on its loading screen
- handled older saved event data without displaying `$NaN`
- synchronized navigation between linked events, meetings, and tasks
- separated meeting scheduling from live note-taking
- replaced free-text task assignment with selectable club members
- added responsive navigation and stable empty states

## Current Limitation

The prototype runs entirely in one browser. It does not yet provide multi-user synchronization, production authentication, or server-enforced permissions.

## Next Technical Step

Move the existing domain model to Supabase:

1. Authenticated users
2. Club memberships and roles
3. Events, meetings, and tasks
4. Row-level security
5. Server-validated mutations

The current component boundaries and shared TypeScript types provide the starting contract for that migration.
