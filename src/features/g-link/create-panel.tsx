"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { EmptyState, FormCard, LabeledInput, LabeledSelect, LabeledTextarea } from "./common-ui";
import { canCreateEvent, canCreateMeeting, canCreateTask } from "./permissions";
import type { ClubRole, Event, EventForm, Meeting, MeetingForm, Member, TaskForm } from "./types";

export function CreatePanel({
  role,
  members,
  events,
  meetings,
  eventForm,
  meetingForm,
  taskForm,
  setEventForm,
  setMeetingForm,
  setTaskForm,
  addEvent,
  addMeeting,
  addTask,
}: {
  role: ClubRole;
  members: Member[];
  events: Event[];
  meetings: Meeting[];
  eventForm: EventForm;
  meetingForm: MeetingForm;
  taskForm: TaskForm;
  setEventForm: (form: EventForm) => void;
  setMeetingForm: (form: MeetingForm) => void;
  setTaskForm: (form: TaskForm) => void;
  addEvent: () => void;
  addMeeting: () => void;
  addTask: () => void;
}) {
  const createOptions = [
    {
      key: "event",
      title: "Event",
      description: "Plan a club event and connect tasks, meetings, and budget.",
      enabled: canCreateEvent(role),
    },
    {
      key: "meeting",
      title: "Meeting",
      description: "Schedule a meeting now. Add notes later inside the meeting page.",
      enabled: canCreateMeeting(role),
    },
    {
      key: "task",
      title: "Task",
      description: "Assign work to a member and optionally connect it to an event or meeting.",
      enabled: canCreateTask(role),
    },
  ] as const;
  const availableOptions = createOptions.filter((option) => option.enabled);
  const [createType, setCreateType] = useState<(typeof availableOptions)[number]["key"] | null>(null);

  if (availableOptions.length === 0) {
    return <EmptyState title="No create access" detail="Your current club role can view assigned work, but cannot create club records yet." />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create</CardTitle>
          <CardDescription>Choose one thing to create. The form appears after you choose.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {availableOptions.map((option) => (
            <button
              key={option.key}
              className="rounded-md border border-border p-4 text-left hover:bg-secondary data-[active=true]:border-primary data-[active=true]:bg-secondary"
              data-active={createType === option.key}
              onClick={() => setCreateType(option.key)}
            >
              <span className="block font-medium">{option.title}</span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">{option.description}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      {!createType ? <p className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">Pick Event, Meeting, or Task above to open the right form.</p> : null}

      {createType === "event" ? (
        <FormCard title="Create event" action="Save event" onSubmit={addEvent}>
          <LabeledInput label="Title" value={eventForm.title} onChange={(value) => setEventForm({ ...eventForm, title: value })} />
          <LabeledTextarea label="Description" value={eventForm.description} onChange={(value) => setEventForm({ ...eventForm, description: value })} />
          <LabeledInput label="Date" type="date" value={eventForm.date} onChange={(value) => setEventForm({ ...eventForm, date: value })} />
          <LabeledInput label="Location" value={eventForm.location} onChange={(value) => setEventForm({ ...eventForm, location: value })} />
          <LabeledInput label="Lead" value={eventForm.owner} onChange={(value) => setEventForm({ ...eventForm, owner: value })} />
          <LabeledInput label="Planned budget" type="number" value={eventForm.plannedBudget} onChange={(value) => setEventForm({ ...eventForm, plannedBudget: value })} />
          <LabeledInput label="Actual budget" type="number" value={eventForm.actualBudget} onChange={(value) => setEventForm({ ...eventForm, actualBudget: value })} />
        </FormCard>
      ) : null}

      {createType === "meeting" ? (
        <FormCard title="Create meeting" action="Save meeting" onSubmit={addMeeting}>
          <LabeledInput label="Title" value={meetingForm.title} onChange={(value) => setMeetingForm({ ...meetingForm, title: value })} />
          <LabeledInput label="Date" type="date" value={meetingForm.date} onChange={(value) => setMeetingForm({ ...meetingForm, date: value })} />
          <LabeledSelect label="Linked event" value={meetingForm.eventId} options={["", ...events.map((event) => event.id)]} labels={{ "": "No linked event", ...Object.fromEntries(events.map((event) => [event.id, event.title])) }} onChange={(value) => setMeetingForm({ ...meetingForm, eventId: value })} />
        </FormCard>
      ) : null}

      {createType === "task" ? (
        <FormCard title="Create task" action="Save task" onSubmit={addTask}>
          <LabeledInput label="Title" value={taskForm.title} onChange={(value) => setTaskForm({ ...taskForm, title: value })} />
          <LabeledTextarea label="Description" value={taskForm.description} onChange={(value) => setTaskForm({ ...taskForm, description: value })} />
          <LabeledSelect
            label="Assignee"
            value={taskForm.assignee}
            options={["", ...members.map((member) => member.name)]}
            labels={{ "": "Choose assignee" }}
            disabledOptions={[""]}
            onChange={(value) => setTaskForm({ ...taskForm, assignee: value })}
          />
          <LabeledInput label="Due date" type="date" value={taskForm.dueDate} onChange={(value) => setTaskForm({ ...taskForm, dueDate: value })} />
          <LabeledSelect label="Event" value={taskForm.eventId} options={["", ...events.map((event) => event.id)]} labels={{ "": "No linked event", ...Object.fromEntries(events.map((event) => [event.id, event.title])) }} onChange={(value) => setTaskForm({ ...taskForm, eventId: value })} />
          <LabeledSelect label="Meeting" value={taskForm.meetingId} options={["", ...meetings.map((meeting) => meeting.id)]} labels={{ "": "No linked meeting", ...Object.fromEntries(meetings.map((meeting) => [meeting.id, meeting.title])) }} onChange={(value) => setTaskForm({ ...taskForm, meetingId: value })} />
        </FormCard>
      ) : null}
    </div>
  );
}
