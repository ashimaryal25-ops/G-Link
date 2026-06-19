# Product Brief

## Product

G-Link is a connected operations workspace for student club executive boards.

## Problem

Club work is usually split across:

- group chats
- shared documents
- spreadsheets
- email
- individual memory

That makes ownership unclear and officer transitions difficult.

## Core User

A student executive who needs to answer:

- What is happening in this club?
- What do I personally need to do?
- What needs to happen for this event?
- What was decided in the meeting?
- Who owns the follow-up?

## Current Product Loop

```text
Student Home
  -> Club Workspace
    -> Event
      -> Meeting
        -> Assigned Task
```

## Current MVP

- multi-club Student Home
- club roles and executive board display
- event creation, detail, editing, and budget totals
- meeting creation, notes, conclusions, and event linking
- personal and club task views
- task assignment, editing, status, and record links
- browser persistence for prototype testing

## Product Principle

Records should connect instead of becoming isolated entries.

Examples:

- a task can reference the meeting that created it
- a meeting can reference the event it supports
- an event shows its related meetings and tasks
- a student sees assigned work across clubs

## Not Built Yet

- real authentication
- shared database
- production permissions
- archive and officer handoff
- notifications
- calendar / Zoom integration
- email integration
- cross-club collaboration
- AI assistance

## Success Test

The first real validation is not feature count. It is whether a club executive board can use G-Link after a meeting and clearly understand what happens next.
