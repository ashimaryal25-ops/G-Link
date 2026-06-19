# Architecture

## Current Shape

```text
src/app/page.tsx
  -> src/components/g-link-mvp-app.tsx
      -> src/features/g-link/*
      -> src/components/ui/*
```

## Main App Brain

```text
src/components/g-link-mvp-app.tsx
```

Holds:

- sign in / sign out state
- localStorage loading and saving
- selected club
- selected event
- selected meeting
- selected task
- create forms
- add / update / remove functions
- navigation helpers

Think of this file as:

```text
data + actions + current screen
```

## Feature Files

```text
src/features/g-link/types.ts
```

- data shapes
- Club
- Member
- Event
- Meeting
- Task
- form types

```text
src/features/g-link/demo-data.ts
```

- starter profile
- starter clubs
- starter members
- starter event
- starter meeting
- starter tasks

```text
src/features/g-link/student-home.tsx
```

- first screen after login
- clubs
- personal tasks
- upcoming events
- upcoming meetings

```text
src/features/g-link/club-workspace.tsx
```

- inside a selected club
- sidebar
- workspace navigation
- decides which panel is visible

```text
src/features/g-link/overview-panel.tsx
```

- club overview
- active events
- recent tasks
- upcoming meetings

```text
src/features/g-link/events-panel.tsx
```

- event list
- event detail
- edit event
- event tasks
- related meetings

```text
src/features/g-link/meetings-panel.tsx
```

- meeting list
- meeting detail
- edit meeting
- notes
- decisions / conclusions
- tasks from meeting

```text
src/features/g-link/tasks-panel.tsx
```

- your tasks
- club tasks
- edit task
- remove task
- status changes

```text
src/features/g-link/create-panel.tsx
```

- create event
- create meeting
- create task

```text
src/features/g-link/app-chrome.tsx
```

- top bar
- user badge
- exec board
- demo data notice

```text
src/features/g-link/common-ui.tsx
```

- reusable UI pieces
- metric cards
- list cards
- form fields
- empty states

```text
src/features/g-link/helpers.ts
```

- IDs
- date helper
- money formatting
- record name lookup

```text
src/features/g-link/permissions.ts
```

- role checks
- who can create event / meeting / task

## Data Flow

```text
g-link-mvp-app.tsx
  owns data
  passes data down as props
  passes action functions down as props
  child components call those functions
  parent updates state
  state saves to localStorage
```

Example:

```text
Edit task button
  -> tasks-panel.tsx
  -> updateTask(...)
  -> g-link-mvp-app.tsx updates data.tasks
  -> localStorage saves updated data
```

## Current Storage

```text
React state -> browser localStorage
```

This is only for the prototype.

## Later Backend

- Supabase Auth
- PostgreSQL tables
- Row-level security
- server-side permissions
- real saved users / clubs / events / meetings / tasks
