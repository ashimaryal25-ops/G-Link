# Architecture

## Current Files

```text
src/app/page.tsx
src/components/g-link-mvp-app.tsx
src/components/ui/
src/lib/
```

## Main Component

```text
src/components/g-link-mvp-app.tsx
```

Currently holds:

- types
- starter data
- app state
- student home
- club workspace
- event panel
- task panel
- meeting panel
- create panel

## Current Data

- profile
- clubs
- members
- events
- meetings
- tasks

## Current State

- selected club
- selected event
- selected meeting
- active workspace view
- create forms

## Current Storage

```text
React state -> localStorage
```

## Later File Split

```text
src/features/workspace/types.ts
src/features/workspace/starter-data.ts
src/features/workspace/student-home.tsx
src/features/workspace/club-workspace.tsx
src/features/workspace/event-panel.tsx
src/features/workspace/task-panel.tsx
src/features/workspace/meeting-panel.tsx
src/features/workspace/create-panel.tsx
```

## Later Backend

- Supabase Auth
- PostgreSQL tables
- Row-level security
- Server-side permissions
