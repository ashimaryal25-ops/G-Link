"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { EmptyState, Info, LabeledInput, LabeledSelect, LabeledTextarea, ListBlock, ListCard } from "./common-ui";
import { nameOf } from "./helpers";
import type { Event, Meeting, Task } from "./types";

const meetingStatuses: Meeting["status"][] = ["draft", "reviewed", "approved"];

export function MeetingsPanel({
  meeting,
  meetings,
  events,
  tasks,
  setSelectedMeetingId,
  openTask,
  onCreateRecord,
  updateMeeting,
}: {
  meeting: Meeting | undefined;
  meetings: Meeting[];
  events: Event[];
  tasks: Task[];
  setSelectedMeetingId: (id: string) => void;
  openTask: (id: string) => void;
  onCreateRecord: () => void;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;
}) {
  if (!meeting) return <EmptyState title="No meeting selected" detail="Create a meeting first." actionLabel="Create meeting" onAction={onCreateRecord} />;

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
      <ListCard title="Meetings" empty="No meetings yet.">
        {meetings.map((item) => (
          <button
            key={item.id}
            className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary data-[active=true]:border-primary data-[active=true]:bg-secondary"
            data-active={item.id === meeting.id}
            onClick={() => setSelectedMeetingId(item.id)}
          >
            <span className="block font-medium">{item.title}</span>
            <span className="text-muted-foreground">{item.date}</span>
          </button>
        ))}
      </ListCard>

      <MeetingDetail key={meeting.id} meeting={meeting} events={events} tasks={tasks} openTask={openTask} updateMeeting={updateMeeting} />
    </div>
  );
}

function MeetingDetail({
  meeting,
  events,
  tasks,
  openTask,
  updateMeeting,
}: {
  meeting: Meeting;
  events: Event[];
  tasks: Task[];
  openTask: (id: string) => void;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: meeting.title,
    date: meeting.date,
    eventId: meeting.eventId ?? "",
    status: meeting.status,
    rawNotes: meeting.rawNotes,
    decisions: meeting.decisions,
  });

  function saveMeetingEdits() {
    updateMeeting(meeting.id, {
      title: draft.title.trim() || meeting.title,
      date: draft.date,
      eventId: draft.eventId || undefined,
      status: draft.status,
      rawNotes: draft.rawNotes,
      decisions: draft.decisions,
    });
    setIsEditing(false);
  }

  function cancelMeetingEdits() {
    setDraft({
      title: meeting.title,
      date: meeting.date,
      eventId: meeting.eventId ?? "",
      status: meeting.status,
      rawNotes: meeting.rawNotes,
      decisions: meeting.decisions,
    });
    setIsEditing(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>{meeting.title}</CardTitle>
            <CardDescription>{meeting.date} - {meeting.status}</CardDescription>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelMeetingEdits}>
                Cancel
              </Button>
              <Button onClick={saveMeetingEdits}>Save changes</Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit meeting
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <LabeledInput label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
              <LabeledInput label="Date" type="date" value={draft.date} onChange={(value) => setDraft({ ...draft, date: value })} />
              <LabeledSelect
                label="Linked event"
                value={draft.eventId}
                options={["", ...events.map((event) => event.id)]}
                labels={{ "": "No linked event", ...Object.fromEntries(events.map((event) => [event.id, event.title])) }}
                onChange={(value) => setDraft({ ...draft, eventId: value })}
              />
              <LabeledSelect label="Status" value={draft.status} options={meetingStatuses} onChange={(value) => setDraft({ ...draft, status: value as Meeting["status"] })} />
            </div>

            <LabeledTextarea label="Raw notes" value={draft.rawNotes} onChange={(value) => setDraft({ ...draft, rawNotes: value })} />
            <LabeledTextarea label="Decisions / conclusions" value={draft.decisions} onChange={(value) => setDraft({ ...draft, decisions: value })} />
          </>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Linked event" value={meeting.eventId ? nameOf(events, meeting.eventId) : "No linked event"} />
              <Info label="Status" value={meeting.status} />
            </div>
            <Info label="Raw notes" value={meeting.rawNotes || "No raw notes yet."} />
            <Info label="Decisions / conclusions" value={meeting.decisions || "No decisions or conclusions yet."} />
          </>
        )}

        <ListBlock title="Tasks from this meeting" empty="No tasks link back to this meeting.">
          {tasks
            .filter((task) => task.meetingId === meeting.id)
            .map((task) => (
              <button key={task.id} className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary" onClick={() => openTask(task.id)}>
                <span className="block font-medium">{task.title}</span>
                <span className="text-muted-foreground">{task.assignee} - {task.status}</span>
              </button>
            ))}
        </ListBlock>
      </CardContent>
    </Card>
  );
}
