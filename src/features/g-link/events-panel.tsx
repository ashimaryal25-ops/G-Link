"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { EmptyState, Info, LabeledInput, LabeledSelect, LabeledTextarea, ListBlock, ListCard } from "./common-ui";
import { eventStatuses, money, safeNumber } from "./helpers";
import type { Event, EventStatus, Meeting, Task } from "./types";

export function EventsPanel({
  event,
  events,
  tasks,
  meetings,
  setSelectedEventId,
  openMeeting,
  openTask,
  onCreateRecord,
  updateEvent,
}: {
  event: Event | undefined;
  events: Event[];
  tasks: Task[];
  meetings: Meeting[];
  setSelectedEventId: (id: string) => void;
  openMeeting: (id: string) => void;
  openTask: (id: string) => void;
  onCreateRecord: () => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
}) {
  if (!event) return <EmptyState title="No event selected" detail="Create an event first." actionLabel="Create event" onAction={onCreateRecord} />;

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
      <ListCard title="Club events" empty="No events yet.">
        {events.map((item) => (
          <button
            key={item.id}
            className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary data-[active=true]:border-primary data-[active=true]:bg-secondary"
            data-active={item.id === event.id}
            onClick={() => setSelectedEventId(item.id)}
          >
            <span className="block font-medium">{item.title}</span>
            <span className="text-muted-foreground">{item.date}</span>
          </button>
        ))}
      </ListCard>

      <EventDetail key={event.id} event={event} tasks={tasks} meetings={meetings} openMeeting={openMeeting} openTask={openTask} updateEvent={updateEvent} />
    </div>
  );
}

function EventDetail({
  event,
  tasks,
  meetings,
  openMeeting,
  openTask,
  updateEvent,
}: {
  event: Event;
  tasks: Task[];
  meetings: Meeting[];
  openMeeting: (id: string) => void;
  openTask: (id: string) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
}) {
  const eventTasks = tasks.filter((task) => task.eventId === event.id);
  const eventMeetings = meetings.filter((meeting) => meeting.eventId === event.id);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: event.title,
    description: event.description,
    plannedBudget: safeNumber(event.plannedBudget).toString(),
    actualBudget: safeNumber(event.actualBudget).toString(),
    date: event.date,
    location: event.location,
    owner: event.owner,
    status: event.status,
  });

  function saveEventEdits() {
    updateEvent(event.id, {
      title: draft.title.trim() || event.title,
      description: draft.description.trim(),
      plannedBudget: Number(draft.plannedBudget || 0),
      actualBudget: Number(draft.actualBudget || 0),
      date: draft.date,
      location: draft.location.trim(),
      owner: draft.owner.trim() || event.owner,
      status: draft.status,
    });
    setIsEditing(false);
  }

  function cancelEventEdits() {
    setDraft({
      title: event.title,
      description: event.description,
      plannedBudget: safeNumber(event.plannedBudget).toString(),
      actualBudget: safeNumber(event.actualBudget).toString(),
      date: event.date,
      location: event.location,
      owner: event.owner,
      status: event.status,
    });
    setIsEditing(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.date} - {event.location || "No location"} - Lead: {event.owner}</CardDescription>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelEventEdits}>
                Cancel
              </Button>
              <Button onClick={saveEventEdits}>Save changes</Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit event
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <LabeledInput label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
              <LabeledInput label="Date" type="date" value={draft.date} onChange={(value) => setDraft({ ...draft, date: value })} />
              <LabeledInput label="Location" value={draft.location} onChange={(value) => setDraft({ ...draft, location: value })} />
              <LabeledInput label="Lead" value={draft.owner} onChange={(value) => setDraft({ ...draft, owner: value })} />
              <LabeledInput label="Planned budget" type="number" value={draft.plannedBudget} onChange={(value) => setDraft({ ...draft, plannedBudget: value })} />
              <LabeledInput label="Actual budget" type="number" value={draft.actualBudget} onChange={(value) => setDraft({ ...draft, actualBudget: value })} />
            </div>
            <LabeledSelect label="Status" value={draft.status} options={eventStatuses} onChange={(value) => setDraft({ ...draft, status: value as EventStatus })} />
            <LabeledTextarea label="Description" value={draft.description} onChange={(value) => setDraft({ ...draft, description: value })} />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            <Info label="Description" value={event.description || "No description."} />
            <Info label="Budget" value={`${money(safeNumber(event.plannedBudget))} planned / ${money(safeNumber(event.actualBudget))} actual`} />
            <Info label="Status" value={event.status} />
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <ListBlock title="Tasks" empty="No tasks linked.">
            {eventTasks.map((task) => (
              <button key={task.id} className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary" onClick={() => openTask(task.id)}>
                <span className="block font-medium">{task.title}</span>
                <span className="text-muted-foreground">{task.assignee} - {task.status} - due {task.dueDate}</span>
              </button>
            ))}
          </ListBlock>
          <ListBlock title="Related meetings" empty="No meetings linked.">
            {eventMeetings.map((meeting) => (
              <button key={meeting.id} className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary" onClick={() => openMeeting(meeting.id)}>
                <span className="block font-medium">{meeting.title}</span>
                <span className="mt-1 block text-muted-foreground">{meeting.date} - {meeting.status}</span>
              </button>
            ))}
          </ListBlock>
        </div>
      </CardContent>
    </Card>
  );
}
