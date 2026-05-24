# Data Model

This model assumes PostgreSQL/Supabase. Names are intentionally plain so implementation can map them directly to tables.

## Ownership Hierarchy

```text
club
  -> club_term
  -> club_membership
  -> event
    -> meeting
    -> task
    -> budget_entry
      -> receipt
    -> collaboration
```

## Core Tables

### clubs

Represents a student organization.

- `id`
- `name`
- `slug`
- `campus_id`
- `description`
- `created_at`

### club_terms

Represents a semester, academic year, or officer-board term. This is what lets the archive explain how a club operated under different exec boards.

- `id`
- `club_id`
- `name`
- `starts_at`
- `ends_at`
- `status`: `planned`, `active`, `archived`
- `created_at`

### users

Represents an account.

- `id`
- `email`
- `full_name`
- `created_at`

### club_memberships

Connects users to clubs with role-based access.

- `id`
- `club_id`
- `user_id`
- `role`: `president`, `vice_president`, `secretary`, `treasurer`, `event_chair`, `member`, `advisor`
- `status`: `active`, `invited`, `removed`
- `starts_at` nullable
- `ends_at` nullable
- `created_at`

### events

Represents an event, initiative, or program that tasks and money can attach to.

- `id`
- `club_id`
- `club_term_id` nullable
- `title`
- `description`
- `starts_at`
- `ends_at`
- `location`
- `status`: `draft`, `planned`, `active`, `completed`, `cancelled`
- `created_by`
- `created_at`

### meetings

Represents a meeting record.

- `id`
- `club_id`
- `club_term_id` nullable
- `event_id` nullable
- `title`
- `meeting_at`
- `raw_notes`
- `formatted_minutes`
- `status`: `draft`, `reviewed`, `approved`
- `created_by`
- `approved_by` nullable
- `created_at`

### meeting_attendees

Tracks attendance and institutional recordkeeping.

- `id`
- `meeting_id`
- `user_id` nullable
- `display_name`
- `attendance_status`: `present`, `absent`, `guest`

### tasks

Represents operational work.

- `id`
- `club_id`
- `club_term_id` nullable
- `event_id` nullable
- `meeting_id` nullable
- `title`
- `description`
- `owner_id` nullable
- `status`: `todo`, `in_progress`, `blocked`, `done`, `cancelled`
- `priority`: `low`, `medium`, `high`
- `due_at` nullable
- `source`: `manual`, `minutes_ai`, `proposal_ai`, `audit_ai`
- `created_by`
- `created_at`

### budget_entries

Represents budget requests, allocations, expenses, reimbursements, and adjustments.

- `id`
- `club_id`
- `club_term_id` nullable
- `event_id`
- `title`
- `description`
- `entry_type`: `request`, `allocation`, `expense`, `reimbursement`, `adjustment`
- `category`
- `amount_cents`
- `currency`
- `status`: `draft`, `submitted`, `approved`, `rejected`, `spent`, `reimbursed`
- `vendor` nullable
- `submitted_at` nullable
- `approved_at` nullable
- `created_by`
- `created_at`

### task_comments

Stores operational updates on tasks. These comments become useful archive material for future officers.

- `id`
- `task_id`
- `club_id`
- `event_id` nullable
- `author_id`
- `body`
- `created_at`

### receipts

Stores receipt metadata and links uploaded files to budget entries.

- `id`
- `budget_entry_id`
- `club_id`
- `event_id`
- `file_url`
- `vendor`
- `amount_cents`
- `purchased_at`
- `uploaded_by`
- `created_at`

### funding_rules

Stores rules that the proposal reviewer checks.

- `id`
- `campus_id`
- `name`
- `description`
- `rule_type`: `cap`, `lead_time`, `category_requirement`, `documentation_requirement`, `restricted_item`
- `parameters_json`
- `source_document_url` nullable
- `active`
- `created_at`

### proposal_reviews

Stores AI review output for funding requests.

- `id`
- `club_id`
- `event_id`
- `created_by`
- `proposal_snapshot_json`
- `result`: `pass`, `warning`, `fail`
- `summary`
- `created_at`

### proposal_review_findings

Stores specific issues found by the reviewer.

- `id`
- `proposal_review_id`
- `severity`: `info`, `warning`, `blocking`
- `rule_id` nullable
- `title`
- `explanation`
- `recommended_fix`

### audit_checks

Stores event or semester audit results.

- `id`
- `club_id`
- `event_id` nullable
- `scope`: `event`, `semester`, `annual`
- `result`: `complete`, `missing_items`, `risk`
- `summary`
- `created_at`

### audit_check_items

Stores granular audit issues.

- `id`
- `audit_check_id`
- `object_type`: `meeting`, `task`, `budget_entry`, `receipt`, `event`
- `object_id`
- `severity`: `info`, `warning`, `blocking`
- `title`
- `recommended_fix`
- `resolved_at` nullable

### event_collaborations

Allows Club A to invite Club B into a specific event workspace.

- `id`
- `event_id`
- `owner_club_id`
- `partner_club_id`
- `status`: `invited`, `accepted`, `declined`, `removed`
- `permissions_json`
- `created_at`

### handoff_notes

Stores officer transition notes and lessons learned.

- `id`
- `club_id`
- `club_term_id` nullable
- `author_id`
- `role_scope`: `president`, `vice_president`, `secretary`, `treasurer`, `event_chair`, `general`
- `title`
- `body`
- `linked_event_id` nullable
- `created_at`

### archive_snapshots

Stores generated snapshots for completed terms, events, or annual reports. These should not replace live records; they provide stable historical summaries.

- `id`
- `club_id`
- `club_term_id` nullable
- `event_id` nullable
- `scope`: `event`, `semester`, `academic_year`, `officer_transition`
- `title`
- `summary`
- `snapshot_json`
- `created_by`
- `created_at`

## Access Rules

- Club members can only see their club's data.
- Cross-club event collaborators can only see the shared event surface, not the full partner club workspace.
- Treasurer-level budget actions should be role-gated.
- Advisor/Senate reviewer access should be read-only unless explicitly configured.
- Archived records should remain readable to future authorized officers even after prior officers leave.
- Former officers should not keep access unless their membership remains active, but their historical authorship should stay attached to records.
