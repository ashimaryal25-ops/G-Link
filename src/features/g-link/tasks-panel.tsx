"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { EmptyState, LabeledInput, LabeledSelect, LabeledTextarea, ListCard } from "./common-ui";
import { nameOf, taskStatuses } from "./helpers";
import type { Event, Meeting, Member, Profile, Task, TaskStatus } from "./types";

export function TasksPanel({
  tasks,
  profile,
  members,
  events,
  meetings,
  selectedTaskId,
  setSelectedTaskId,
  updateTask,
  updateTaskStatus,
  removeTask,
  onCreateRecord,
}: {
  tasks: Task[];
  profile: Profile;
  members: Member[];
  events: Event[];
  meetings: Meeting[];
  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  onCreateRecord: () => void;
}) {
  const yourTasks = tasks.filter((task) => task.assignee.toLowerCase() === profile.fullName.toLowerCase());

  if (tasks.length === 0) {
    return <EmptyState title="No tasks yet" detail="Create the first club task when there is work to assign." actionLabel="Create task" onAction={onCreateRecord} />;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <ListCard title="Your tasks in this club" empty="No tasks assigned to you in this club.">
        {yourTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            members={members}
            events={events}
            meetings={meetings}
            isSelected={selectedTaskId === task.id}
            setSelectedTaskId={setSelectedTaskId}
            updateTask={updateTask}
            updateTaskStatus={updateTaskStatus}
            removeTask={removeTask}
          />
        ))}
      </ListCard>
      <ListCard title="Club tasks" empty="No club tasks yet.">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            members={members}
            events={events}
            meetings={meetings}
            isSelected={selectedTaskId === task.id}
            setSelectedTaskId={setSelectedTaskId}
            updateTask={updateTask}
            updateTaskStatus={updateTaskStatus}
            removeTask={removeTask}
          />
        ))}
      </ListCard>
    </div>
  );
}

function TaskRow({
  task,
  members,
  events,
  meetings,
  isSelected,
  setSelectedTaskId,
  updateTask,
  updateTaskStatus,
  removeTask,
}: {
  task: Task;
  members: Member[];
  events: Event[];
  meetings: Meeting[];
  isSelected: boolean;
  setSelectedTaskId: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description,
    assignee: task.assignee,
    dueDate: task.dueDate,
    eventId: task.eventId ?? "",
    meetingId: task.meetingId ?? "",
    status: task.status,
  });

  function confirmRemoveTask() {
    if (window.confirm(`Remove "${task.title}"?`)) {
      removeTask(task.id);
    }
  }

  function saveTaskEdits() {
    updateTask(task.id, {
      title: draft.title.trim() || task.title,
      description: draft.description.trim(),
      assignee: draft.assignee || task.assignee,
      dueDate: draft.dueDate,
      eventId: draft.eventId || undefined,
      meetingId: draft.meetingId || undefined,
      status: draft.status,
    });
    setIsEditing(false);
  }

  function cancelTaskEdits() {
    setDraft({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      dueDate: task.dueDate,
      eventId: task.eventId ?? "",
      meetingId: task.meetingId ?? "",
      status: task.status,
    });
    setIsEditing(false);
  }

  return (
    <div className="rounded-md border border-border p-3 text-sm data-[active=true]:border-primary data-[active=true]:bg-secondary/50" data-active={isSelected} onMouseEnter={() => setSelectedTaskId(task.id)}>
      {isEditing ? (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <LabeledInput label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
            <LabeledSelect
              label="Assignee"
              value={draft.assignee}
              options={members.length > 0 ? members.map((member) => member.name) : [task.assignee]}
              onChange={(value) => setDraft({ ...draft, assignee: value })}
            />
            <LabeledInput label="Due date" type="date" value={draft.dueDate} onChange={(value) => setDraft({ ...draft, dueDate: value })} />
            <LabeledSelect label="Status" value={draft.status} options={taskStatuses} onChange={(value) => setDraft({ ...draft, status: value as TaskStatus })} />
            <LabeledSelect label="Event" value={draft.eventId} options={["", ...events.map((event) => event.id)]} labels={{ "": "No linked event", ...Object.fromEntries(events.map((event) => [event.id, event.title])) }} onChange={(value) => setDraft({ ...draft, eventId: value })} />
            <LabeledSelect label="Meeting" value={draft.meetingId} options={["", ...meetings.map((meeting) => meeting.id)]} labels={{ "": "No linked meeting", ...Object.fromEntries(meetings.map((meeting) => [meeting.id, meeting.title])) }} onChange={(value) => setDraft({ ...draft, meetingId: value })} />
          </div>
          <LabeledTextarea label="Description" value={draft.description} onChange={(value) => setDraft({ ...draft, description: value })} />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={cancelTaskEdits}>
              Cancel
            </Button>
            <Button size="sm" onClick={saveTaskEdits}>
              Save changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-medium">{task.title}</p>
            <p className="mt-1 text-muted-foreground">{task.assignee} - due {task.dueDate}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {task.eventId ? <Badge variant="secondary">Event: {nameOf(events, task.eventId)}</Badge> : null}
              {task.meetingId ? <Badge variant="outline">Meeting: {nameOf(meetings, task.meetingId)}</Badge> : null}
            </div>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <LabeledSelect compact label="Status" value={task.status} options={taskStatuses} onChange={(value) => updateTaskStatus(task.id, value as TaskStatus)} />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={confirmRemoveTask}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
