import { ArrowLeft, CalendarDays, CheckSquare, NotebookTabs, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { DemoDataNotice, ExecBoard, UserBadge } from "./app-chrome";
import { CreatePanel } from "./create-panel";
import { Metric, WorkspaceButton } from "./common-ui";
import { EventsPanel } from "./events-panel";
import { MeetingsPanel } from "./meetings-panel";
import { OverviewPanel } from "./overview-panel";
import { TasksPanel } from "./tasks-panel";
import type { Club, Event, EventForm, Meeting, MeetingForm, Member, Profile, Task, TaskForm, TaskStatus, WorkspaceView } from "./types";

export function ClubWorkspace({
  profile,
  selectedClub,
  clubMembers,
  clubEvents,
  clubMeetings,
  clubTasks,
  selectedEvent,
  selectedMeeting,
  selectedTaskId,
  view,
  eventForm,
  meetingForm,
  taskForm,
  setView,
  setSelectedClubId,
  setSelectedEventId,
  setSelectedMeetingId,
  setSelectedTaskId,
  setEventForm,
  setMeetingForm,
  setTaskForm,
  updateEvent,
  updateMeeting,
  updateTask,
  updateTaskStatus,
  removeTask,
  addEvent,
  addMeeting,
  addTask,
  onSignOut,
  onResetData,
  openTask,
}: {
  profile: Profile;
  selectedClub: Club;
  clubMembers: Member[];
  clubEvents: Event[];
  clubMeetings: Meeting[];
  clubTasks: Task[];
  selectedEvent: Event | undefined;
  selectedMeeting: Meeting | undefined;
  selectedTaskId: string;
  view: WorkspaceView;
  eventForm: EventForm;
  meetingForm: MeetingForm;
  taskForm: TaskForm;
  setView: (view: WorkspaceView) => void;
  setSelectedClubId: (id: string | null) => void;
  setSelectedEventId: (id: string) => void;
  setSelectedMeetingId: (id: string) => void;
  setSelectedTaskId: (id: string) => void;
  setEventForm: (form: EventForm) => void;
  setMeetingForm: (form: MeetingForm) => void;
  setTaskForm: (form: TaskForm) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  addEvent: () => void;
  addMeeting: () => void;
  addTask: () => void;
  onSignOut: () => void;
  onResetData: () => void;
  openTask: (id: string) => void;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-5 lg:self-start">
          <UserBadge profile={profile} onSignOut={onSignOut} />
          <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedClubId(null)}>
            <ArrowLeft className="size-4" />
            Student Home
          </Button>
          <DemoDataNotice onResetData={onResetData} />
          <Card>
            <CardHeader>
              <CardTitle>{selectedClub.name}</CardTitle>
              <CardDescription>{selectedClub.role} - {selectedClub.term}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 lg:block lg:space-y-2">
              <WorkspaceButton active={view === "overview"} label="Overview" onClick={() => setView("overview")} />
              <WorkspaceButton active={view === "events"} label="Events" onClick={() => setView("events")} />
              <WorkspaceButton active={view === "tasks"} label="Tasks" onClick={() => setView("tasks")} />
              <WorkspaceButton active={view === "meetings"} label="Meetings" onClick={() => setView("meetings")} />
              <WorkspaceButton active={view === "create"} label="Create" onClick={() => setView("create")} />
            </CardContent>
          </Card>
          <ExecBoard members={clubMembers} />
        </aside>

        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Users} label="Execs" value={clubMembers.filter((member) => member.role !== "member").length.toString()} />
            <Metric icon={CalendarDays} label="Events" value={clubEvents.length.toString()} />
            <Metric icon={CheckSquare} label="Tasks" value={clubTasks.filter((task) => task.status !== "done").length.toString()} />
            <Metric icon={NotebookTabs} label="Meetings" value={clubMeetings.length.toString()} />
          </div>

          {view === "overview" ? <OverviewPanel club={selectedClub} events={clubEvents} tasks={clubTasks} meetings={clubMeetings} setView={setView} setSelectedEventId={setSelectedEventId} setSelectedMeetingId={setSelectedMeetingId} setSelectedTaskId={setSelectedTaskId} /> : null}
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
              openTask={openTask}
              onCreateRecord={() => setView("create")}
              updateEvent={updateEvent}
            />
          ) : null}
          {view === "tasks" ? <TasksPanel tasks={clubTasks} profile={profile} members={clubMembers} events={clubEvents} meetings={clubMeetings} selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} updateTask={updateTask} updateTaskStatus={updateTaskStatus} removeTask={removeTask} onCreateRecord={() => setView("create")} /> : null}
          {view === "meetings" ? <MeetingsPanel meeting={selectedMeeting} meetings={clubMeetings} events={clubEvents} tasks={clubTasks} setSelectedMeetingId={setSelectedMeetingId} openTask={openTask} onCreateRecord={() => setView("create")} updateMeeting={updateMeeting} /> : null}
          {view === "create" ? (
            <CreatePanel
              role={selectedClub.role}
              members={clubMembers}
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
