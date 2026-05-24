"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, CheckSquare, NotebookTabs, Plus, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ClubRole = "president" | "vice president" | "secretary" | "treasurer" | "event coordinator" | "member" | "advisor";
type TaskStatus = "todo" | "in progress" | "blocked" | "done" | "cancelled";
type EventStatus = "draft" | "planned" | "active" | "completed" | "cancelled";
type WorkspaceView = "overview" | "events" | "tasks" | "meetings" | "create";

type Profile = { fullName: string; email: string };
type Club = { id: string; name: string; description: string; campus: string; role: ClubRole; term: string };
type Member = { id: string; clubId: string; name: string; email: string; role: ClubRole; status: "active" | "invited" };
type Event = {
  id: string;
  clubId: string;
  title: string;
  description: string;
  plannedBudget: number;
  actualBudget: number;
  date: string;
  location: string;
  owner: string;
  status: EventStatus;
};
type Meeting = {
  id: string;
  clubId: string;
  eventId?: string;
  title: string;
  date: string;
  rawNotes: string;
  finalMinutes: string;
  decisions: string;
  status: "draft" | "reviewed" | "approved";
};
type Task = {
  id: string;
  clubId: string;
  eventId?: string;
  meetingId?: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
};
type AppData = {
  profile: Profile;
  clubs: Club[];
  members: Member[];
  events: Event[];
  meetings: Meeting[];
  tasks: Task[];
};

const storageKey = "g-link-app-mvp-data";
const taskStatuses: TaskStatus[] = ["todo", "in progress", "blocked", "done", "cancelled"];
const eventStatuses: EventStatus[] = ["draft", "planned", "active", "completed", "cancelled"];

const starterData: AppData = {
  profile: { fullName: "Jordan Carter", email: "jordan@gettysburg.edu" },
  clubs: [
    {
      id: "club-bsu",
      name: "Black Student Union",
      description: "Exec board workspace for events, tasks, meetings, and event budget records.",
      campus: "Gettysburg College",
      role: "president",
      term: "Spring 2026",
    },
    {
      id: "club-intl",
      name: "International Club",
      description: "Planning space for club events and meeting follow-ups.",
      campus: "Gettysburg College",
      role: "event coordinator",
      term: "Spring 2026",
    },
  ],
  members: [
    { id: "member-1", clubId: "club-bsu", name: "Jordan Carter", email: "jordan@gettysburg.edu", role: "president", status: "active" },
    { id: "member-2", clubId: "club-bsu", name: "Maya Chen", email: "maya@gettysburg.edu", role: "treasurer", status: "active" },
    { id: "member-3", clubId: "club-bsu", name: "Alex Rivera", email: "alex@gettysburg.edu", role: "secretary", status: "active" },
    { id: "member-4", clubId: "club-intl", name: "Jordan Carter", email: "jordan@gettysburg.edu", role: "event coordinator", status: "active" },
  ],
  events: [
    {
      id: "event-1",
      clubId: "club-bsu",
      title: "Spring Showcase",
      description: "Annual cultural showcase with speaker, food, and student performances.",
      plannedBudget: 650,
      actualBudget: 0,
      date: "2026-03-28",
      location: "CUB Ballroom",
      owner: "Jordan Carter",
      status: "active",
    },
  ],
  meetings: [
    {
      id: "meeting-1",
      clubId: "club-bsu",
      eventId: "event-1",
      title: "Spring Showcase Planning",
      date: "2026-02-12",
      rawNotes: "Need speaker, catering quote, room setup. Maya will check budget rules.",
      finalMinutes: "The board reviewed showcase logistics and assigned follow-up tasks.",
      decisions: "Use CUB Ballroom if available. Keep catering under the approved event cap.",
      status: "approved",
    },
  ],
  tasks: [
    {
      id: "task-1",
      clubId: "club-bsu",
      eventId: "event-1",
      meetingId: "meeting-1",
      title: "Confirm speaker availability",
      description: "Ask the preferred speaker for March 28 availability and price.",
      assignee: "Jordan Carter",
      dueDate: "2026-02-20",
      status: "in progress",
    },
    {
      id: "task-2",
      clubId: "club-bsu",
      eventId: "event-1",
      meetingId: "meeting-1",
      title: "Request catering quote",
      description: "Get a written quote for the funding request.",
      assignee: "Maya Chen",
      dueDate: "2026-02-22",
      status: "todo",
    },
  ],
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(value);
}

function safeNumber(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function canCreateTask(role: ClubRole) {
  return ["president", "vice president", "secretary", "event coordinator"].includes(role);
}

function canCreateEvent(role: ClubRole) {
  return ["president", "vice president", "event coordinator"].includes(role);
}

function canCreateMeeting(role: ClubRole) {
  return ["president", "vice president", "secretary"].includes(role);
}

export function GLinkMvpApp() {
  const [data, setData] = useState<AppData>(starterData);
  const [loaded, setLoaded] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [view, setView] = useState<WorkspaceView>("overview");
  const [selectedEventId, setSelectedEventId] = useState(starterData.events[0]?.id ?? "");
  const [selectedMeetingId, setSelectedMeetingId] = useState(starterData.meetings[0]?.id ?? "");
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: today(), location: "", owner: "", plannedBudget: "", actualBudget: "" });
  const [meetingForm, setMeetingForm] = useState({ title: "", date: today(), rawNotes: "", finalMinutes: "", decisions: "", eventId: "" });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignee: "", dueDate: today(), eventId: "", meetingId: "" });

  useEffect(() => {
    queueMicrotask(() => {
      const saved = window.localStorage.getItem(storageKey);

      if (saved) {
        try {
          setData(JSON.parse(saved) as AppData);
        } catch {
          setData(starterData);
        }
      }

      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, loaded]);

  const selectedClub = data.clubs.find((club) => club.id === selectedClubId);
  const clubMembers = useMemo(() => data.members.filter((member) => member.clubId === selectedClub?.id), [data.members, selectedClub?.id]);
  const clubEvents = useMemo(() => data.events.filter((event) => event.clubId === selectedClub?.id), [data.events, selectedClub?.id]);
  const clubMeetings = useMemo(() => data.meetings.filter((meeting) => meeting.clubId === selectedClub?.id), [data.meetings, selectedClub?.id]);
  const clubTasks = useMemo(() => data.tasks.filter((task) => task.clubId === selectedClub?.id), [data.tasks, selectedClub?.id]);
  const selectedEvent = clubEvents.find((event) => event.id === selectedEventId) ?? clubEvents[0];
  const selectedMeeting = clubMeetings.find((meeting) => meeting.id === selectedMeetingId) ?? clubMeetings[0];
  const myTasks = data.tasks.filter((task) => task.assignee.toLowerCase() === data.profile.fullName.toLowerCase());

  function openClub(clubId: string) {
    const firstEvent = data.events.find((event) => event.clubId === clubId);
    const firstMeeting = data.meetings.find((meeting) => meeting.clubId === clubId);
    setSelectedClubId(clubId);
    setSelectedEventId(firstEvent?.id ?? "");
    setSelectedMeetingId(firstMeeting?.id ?? "");
    setView("overview");
  }

  function addEvent() {
    if (!selectedClub || !eventForm.title.trim() || !canCreateEvent(selectedClub.role)) return;
    const eventId = makeId("event");
    const event: Event = {
      id: eventId,
      clubId: selectedClub.id,
      title: eventForm.title.trim(),
      description: eventForm.description.trim(),
      plannedBudget: Number(eventForm.plannedBudget || 0),
      actualBudget: Number(eventForm.actualBudget || 0),
      date: eventForm.date,
      location: eventForm.location.trim(),
      owner: eventForm.owner.trim() || data.profile.fullName,
      status: "planned",
    };
    setData((current) => ({ ...current, events: [...current.events, event] }));
    setSelectedEventId(eventId);
    setEventForm({ title: "", description: "", date: today(), location: "", owner: "", plannedBudget: "", actualBudget: "" });
    setView("events");
  }

  function addMeeting() {
    if (!selectedClub || !meetingForm.title.trim() || !canCreateMeeting(selectedClub.role)) return;
    const meetingId = makeId("meeting");
    const meeting: Meeting = { id: meetingId, clubId: selectedClub.id, status: "draft", ...meetingForm, eventId: meetingForm.eventId || undefined };
    setData((current) => ({ ...current, meetings: [...current.meetings, meeting] }));
    setSelectedMeetingId(meetingId);
    setMeetingForm({ title: "", date: today(), rawNotes: "", finalMinutes: "", decisions: "", eventId: "" });
    setView("meetings");
  }

  function addTask() {
    if (!selectedClub || !taskForm.title.trim() || !canCreateTask(selectedClub.role)) return;
    const task: Task = {
      id: makeId("task"),
      clubId: selectedClub.id,
      eventId: taskForm.eventId || undefined,
      meetingId: taskForm.meetingId || undefined,
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      assignee: taskForm.assignee.trim() || data.profile.fullName,
      dueDate: taskForm.dueDate,
      status: "todo",
    };
    setData((current) => ({ ...current, tasks: [...current.tasks, task] }));
    setTaskForm({ title: "", description: "", assignee: "", dueDate: today(), eventId: "", meetingId: "" });
    setView("tasks");
  }

  function updateTaskStatus(taskId: string, status: TaskStatus) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    }));
  }

  function updateEvent(eventId: string, updates: Partial<Event>) {
    setData((current) => ({
      ...current,
      events: current.events.map((event) => (event.id === eventId ? { ...event, ...updates } : event)),
    }));
  }

  if (!selectedClub) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <Header eyebrow="G-Link" title="Student Home" description="Your clubs, roles, tasks, events, and meetings." />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <LabeledInput label="Full name" value={data.profile.fullName} onChange={(value) => setData({ ...data, profile: { ...data.profile, fullName: value } })} />
                <LabeledInput label="Email" value={data.profile.email} onChange={(value) => setData({ ...data, profile: { ...data.profile, email: value } })} />
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Metric icon={Users} label="Clubs" value={data.clubs.length.toString()} />
              <Metric icon={CheckSquare} label="My tasks" value={myTasks.length.toString()} />
              <Metric icon={CalendarDays} label="Upcoming events" value={data.events.filter((event) => event.status !== "completed").length.toString()} />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Your clubs</CardTitle>
                  <CardDescription>Pick one club to enter its workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.clubs.map((club) => (
                    <button key={club.id} className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left hover:bg-secondary" onClick={() => openClub(club.id)}>
                      <span>
                        <span className="block font-medium">{club.name}</span>
                        <span className="text-sm text-muted-foreground">{club.campus} - {club.term}</span>
                      </span>
                      <Badge variant="secondary">{club.role}</Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <ListCard title="My tasks" empty="No tasks assigned to you.">
                  {myTasks.map((task) => <RecordLine key={task.id} title={task.title} detail={`${nameOf(data.clubs, task.clubId)} - ${task.status} - due ${task.dueDate}`} />)}
                </ListCard>
                <ListCard title="Upcoming meetings" empty="No upcoming meetings.">
                  {data.meetings.filter((meeting) => meeting.status !== "approved").map((meeting) => <RecordLine key={meeting.id} title={meeting.title} detail={`${nameOf(data.clubs, meeting.clubId)} - ${meeting.date}`} />)}
                </ListCard>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedClubId(null)}>
            <ArrowLeft className="size-4" />
            Student Home
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>{selectedClub.name}</CardTitle>
              <CardDescription>{selectedClub.role} - {selectedClub.term}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <WorkspaceButton active={view === "overview"} label="Overview" onClick={() => setView("overview")} />
              <WorkspaceButton active={view === "events"} label="Events" onClick={() => setView("events")} />
              <WorkspaceButton active={view === "tasks"} label="Tasks" onClick={() => setView("tasks")} />
              <WorkspaceButton active={view === "meetings"} label="Meetings" onClick={() => setView("meetings")} />
              <WorkspaceButton active={view === "create"} label="Create" onClick={() => setView("create")} />
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Metric icon={Users} label="Execs" value={clubMembers.filter((member) => member.role !== "member").length.toString()} />
            <Metric icon={CalendarDays} label="Events" value={clubEvents.length.toString()} />
            <Metric icon={CheckSquare} label="Tasks" value={clubTasks.filter((task) => task.status !== "done").length.toString()} />
            <Metric icon={NotebookTabs} label="Meetings" value={clubMeetings.length.toString()} />
          </div>

          {view === "overview" ? (
            <OverviewPanel club={selectedClub} members={clubMembers} events={clubEvents} tasks={clubTasks} meetings={clubMeetings} setView={setView} setSelectedEventId={setSelectedEventId} />
          ) : null}
          {view === "events" ? (
            <EventsPanel
              event={selectedEvent}
              events={clubEvents}
              tasks={clubTasks}
              meetings={clubMeetings}
              setSelectedEventId={setSelectedEventId}
              openMeeting={(meetingId) => {
                setSelectedMeetingId(meetingId);
                setView("meetings");
              }}
              updateEvent={updateEvent}
            />
          ) : null}
          {view === "tasks" ? <TasksPanel tasks={clubTasks} events={clubEvents} meetings={clubMeetings} updateTaskStatus={updateTaskStatus} /> : null}
          {view === "meetings" ? <MeetingsPanel meeting={selectedMeeting} meetings={clubMeetings} events={clubEvents} tasks={clubTasks} setSelectedMeetingId={setSelectedMeetingId} /> : null}
          {view === "create" ? (
            <CreatePanel
              role={selectedClub.role}
              events={clubEvents}
              meetings={clubMeetings}
              eventForm={eventForm}
              meetingForm={meetingForm}
              taskForm={taskForm}
              setEventForm={setEventForm}
              setMeetingForm={setMeetingForm}
              setTaskForm={setTaskForm}
              addEvent={addEvent}
              addMeeting={addMeeting}
              addTask={addTask}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}

function OverviewPanel({
  club,
  members,
  events,
  tasks,
  meetings,
  setView,
  setSelectedEventId,
}: {
  club: Club;
  members: Member[];
  events: Event[];
  tasks: Task[];
  meetings: Meeting[];
  setView: (view: WorkspaceView) => void;
  setSelectedEventId: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Club overview</CardTitle>
          <CardDescription>{club.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Info label="Campus" value={club.campus} />
          <Info label="Term" value={club.term} />
        </CardContent>
      </Card>
      <ListCard title="Exec members" empty="No members yet.">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
            <span>
              <span className="block font-medium">{member.name}</span>
              <span className="text-muted-foreground">{member.email}</span>
            </span>
            <Badge variant={member.role === "member" ? "outline" : "secondary"}>{member.role}</Badge>
          </div>
        ))}
      </ListCard>
      <ListCard title="Active events" empty="No active events.">
        {events.filter((event) => event.status !== "completed").map((event) => (
          <button key={event.id} className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary" onClick={() => {
            setSelectedEventId(event.id);
            setView("events");
          }}>
            <span className="block font-medium">{event.title}</span>
            <span className="text-muted-foreground">{event.date} - Lead: {event.owner}</span>
          </button>
        ))}
      </ListCard>
      <ListCard title="Tasks and meetings" empty="No tasks or meetings.">
        {tasks.slice(0, 3).map((task) => <RecordLine key={task.id} title={task.title} detail={`${task.assignee} - ${task.status}`} />)}
        {meetings.slice(0, 2).map((meeting) => <RecordLine key={meeting.id} title={meeting.title} detail={`${meeting.date} - ${meeting.status}`} />)}
      </ListCard>
    </div>
  );
}

function EventsPanel({
  event,
  events,
  tasks,
  meetings,
  setSelectedEventId,
  openMeeting,
  updateEvent,
}: {
  event: Event | undefined;
  events: Event[];
  tasks: Task[];
  meetings: Meeting[];
  setSelectedEventId: (id: string) => void;
  openMeeting: (id: string) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
}) {
  if (!event) return <EmptyState title="No event selected" detail="Create an event first." />;

  const eventTasks = tasks.filter((task) => task.eventId === event.id);
  const eventMeetings = meetings.filter((meeting) => meeting.eventId === event.id);

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
      <ListCard title="Club events" empty="No events yet.">
        {events.map((item) => (
          <button key={item.id} className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary data-[active=true]:border-primary data-[active=true]:bg-secondary" data-active={item.id === event.id} onClick={() => setSelectedEventId(item.id)}>
            <span className="block font-medium">{item.title}</span>
            <span className="text-muted-foreground">{item.date}</span>
          </button>
        ))}
      </ListCard>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.date} - {event.location || "No location"} - Lead: {event.owner}</CardDescription>
            </div>
            <LabeledSelect compact label="Status" value={event.status} options={eventStatuses} onChange={(value) => updateEvent(event.id, { status: value as EventStatus })} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Info label="Description" value={event.description || "No description."} />
            <Info label="Budget" value={`${money(safeNumber(event.plannedBudget))} planned / ${money(safeNumber(event.actualBudget))} actual`} />
            <Info label="Status" value={event.status} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ListBlock title="Tasks" empty="No tasks linked.">
              {eventTasks.map((task) => <RecordLine key={task.id} title={task.title} detail={`${task.assignee} - ${task.status} - due ${task.dueDate}`} />)}
            </ListBlock>
            <ListBlock title="Related meetings" empty="No meetings linked.">
              {eventMeetings.map((meeting) => (
                <button
                  key={meeting.id}
                  className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary"
                  onClick={() => openMeeting(meeting.id)}
                >
                  <span className="block font-medium">{meeting.title}</span>
                  <span className="mt-1 block text-muted-foreground">{meeting.date} - {meeting.status}</span>
                </button>
              ))}
            </ListBlock>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TasksPanel({ tasks, events, meetings, updateTaskStatus }: { tasks: Task[]; events: Event[]; meetings: Meeting[]; updateTaskStatus: (id: string, status: TaskStatus) => void }) {
  return (
    <ListCard title="Club tasks" empty="No tasks yet.">
      {tasks.map((task) => (
        <div key={task.id} className="rounded-md border border-border p-3 text-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="mt-1 text-muted-foreground">{task.assignee} - due {task.dueDate}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {task.eventId ? <Badge variant="secondary">Event: {nameOf(events, task.eventId)}</Badge> : null}
                {task.meetingId ? <Badge variant="outline">Meeting: {nameOf(meetings, task.meetingId)}</Badge> : null}
              </div>
            </div>
            <LabeledSelect compact label="Status" value={task.status} options={taskStatuses} onChange={(value) => updateTaskStatus(task.id, value as TaskStatus)} />
          </div>
        </div>
      ))}
    </ListCard>
  );
}

function MeetingsPanel({ meeting, meetings, events, tasks, setSelectedMeetingId }: { meeting: Meeting | undefined; meetings: Meeting[]; events: Event[]; tasks: Task[]; setSelectedMeetingId: (id: string) => void }) {
  if (!meeting) return <EmptyState title="No meeting selected" detail="Create a meeting first." />;

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
      <ListCard title="Meetings" empty="No meetings yet.">
        {meetings.map((item) => (
          <button key={item.id} className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary data-[active=true]:border-primary data-[active=true]:bg-secondary" data-active={item.id === meeting.id} onClick={() => setSelectedMeetingId(item.id)}>
            <span className="block font-medium">{item.title}</span>
            <span className="text-muted-foreground">{item.date}</span>
          </button>
        ))}
      </ListCard>
      <Card>
        <CardHeader>
          <CardTitle>{meeting.title}</CardTitle>
          <CardDescription>{meeting.date} - {meeting.status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Info label="Linked event" value={meeting.eventId ? nameOf(events, meeting.eventId) : "No linked event"} />
          <Info label="Raw notes" value={meeting.rawNotes || "No raw notes."} />
          <Info label="Final minutes" value={meeting.finalMinutes || "No final minutes."} />
          <Info label="Decisions" value={meeting.decisions || "No decisions."} />
          <ListBlock title="Tasks from this meeting" empty="No tasks link back to this meeting.">
            {tasks.filter((task) => task.meetingId === meeting.id).map((task) => <RecordLine key={task.id} title={task.title} detail={`${task.assignee} - ${task.status}`} />)}
          </ListBlock>
        </CardContent>
      </Card>
    </div>
  );
}

function CreatePanel({
  role,
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
  events: Event[];
  meetings: Meeting[];
  eventForm: { title: string; description: string; date: string; location: string; owner: string; plannedBudget: string; actualBudget: string };
  meetingForm: { title: string; date: string; rawNotes: string; finalMinutes: string; decisions: string; eventId: string };
  taskForm: { title: string; description: string; assignee: string; dueDate: string; eventId: string; meetingId: string };
  setEventForm: (form: { title: string; description: string; date: string; location: string; owner: string; plannedBudget: string; actualBudget: string }) => void;
  setMeetingForm: (form: { title: string; date: string; rawNotes: string; finalMinutes: string; decisions: string; eventId: string }) => void;
  setTaskForm: (form: { title: string; description: string; assignee: string; dueDate: string; eventId: string; meetingId: string }) => void;
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
      description: "Record notes and decisions, then optionally link the meeting to an event.",
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

      {!createType ? (
        <p className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
          Pick Event, Meeting, or Task above to open the right form.
        </p>
      ) : null}

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
          <LabeledTextarea label="Raw notes" value={meetingForm.rawNotes} onChange={(value) => setMeetingForm({ ...meetingForm, rawNotes: value })} />
          <LabeledTextarea label="Final minutes" value={meetingForm.finalMinutes} onChange={(value) => setMeetingForm({ ...meetingForm, finalMinutes: value })} />
          <LabeledTextarea label="Decisions" value={meetingForm.decisions} onChange={(value) => setMeetingForm({ ...meetingForm, decisions: value })} />
          <LabeledSelect label="Linked event" value={meetingForm.eventId} options={["", ...events.map((event) => event.id)]} labels={{ "": "No linked event", ...Object.fromEntries(events.map((event) => [event.id, event.title])) }} onChange={(value) => setMeetingForm({ ...meetingForm, eventId: value })} />
        </FormCard>
      ) : null}

      {createType === "task" ? (
        <FormCard title="Create task" action="Save task" onSubmit={addTask}>
          <LabeledInput label="Title" value={taskForm.title} onChange={(value) => setTaskForm({ ...taskForm, title: value })} />
          <LabeledTextarea label="Description" value={taskForm.description} onChange={(value) => setTaskForm({ ...taskForm, description: value })} />
          <LabeledInput label="Assignee" value={taskForm.assignee} onChange={(value) => setTaskForm({ ...taskForm, assignee: value })} />
          <LabeledInput label="Due date" type="date" value={taskForm.dueDate} onChange={(value) => setTaskForm({ ...taskForm, dueDate: value })} />
          <LabeledSelect label="Event" value={taskForm.eventId} options={["", ...events.map((event) => event.id)]} labels={{ "": "No linked event", ...Object.fromEntries(events.map((event) => [event.id, event.title])) }} onChange={(value) => setTaskForm({ ...taskForm, eventId: value })} />
          <LabeledSelect label="Meeting" value={taskForm.meetingId} options={["", ...meetings.map((meeting) => meeting.id)]} labels={{ "": "No linked meeting", ...Object.fromEntries(meetings.map((meeting) => [meeting.id, meeting.title])) }} onChange={(value) => setTaskForm({ ...taskForm, meetingId: value })} />
        </FormCard>
      ) : null}
    </div>
  );
}

function Header({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <header>
      <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
      <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </header>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-md bg-secondary p-2">
          <Icon className="size-4 text-primary" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkspaceButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" data-active={active} onClick={onClick}>
      {label}
    </button>
  );
}

function FormCard({ title, action, children, onSubmit }: { title: string; action: string; children: React.ReactNode; onSubmit: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
        <Button onClick={onSubmit}><Plus className="size-4" />{action}</Button>
      </CardContent>
    </Card>
  );
}

function ListCard({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ListBlock empty={empty}>{children}</ListBlock>
      </CardContent>
    </Card>
  );
}

function ListBlock({ title, empty, children }: { title?: string; empty: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];

  return (
    <section className="space-y-2">
      {title ? <h3 className="text-sm font-medium">{title}</h3> : null}
      {items.length > 0 ? items : <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">{empty}</p>}
    </section>
  );
}

function RecordLine({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-border p-3 text-sm">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-muted-foreground">{detail}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{detail}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function LabeledInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function LabeledTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function LabeledSelect({
  label,
  value,
  options,
  labels = {},
  compact = false,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
  compact?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className={compact ? "grid min-w-36 gap-1 text-xs font-medium text-muted-foreground" : "grid gap-1.5 text-sm font-medium"}>
      {label}
      <select className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{labels[option] ?? option}</option>)}
      </select>
    </label>
  );
}

function nameOf(records: Array<{ id: string; name?: string; title?: string }>, id: string) {
  const record = records.find((item) => item.id === id);
  return record?.name ?? record?.title ?? "Unknown";
}
