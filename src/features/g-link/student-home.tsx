import { CalendarDays, CheckSquare, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { AppTopBar } from "./app-chrome";
import { ListCard, Metric } from "./common-ui";
import { nameOf } from "./helpers";
import type { AppData, Task } from "./types";

export function StudentHome({
  data,
  myTasks,
  onOpenClub,
  onOpenEvent,
  onOpenTask,
  onOpenMeeting,
  onSignOut,
  onResetData,
}: {
  data: AppData;
  myTasks: Task[];
  onOpenClub: (clubId: string) => void;
  onOpenEvent: (eventId: string) => void;
  onOpenTask: (taskId: string) => void;
  onOpenMeeting: (meetingId: string) => void;
  onSignOut: () => void;
  onResetData: () => void;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-5">
        <AppTopBar eyebrow="G-Link" title="Student Home" description="Your clubs, roles, tasks, events, and meetings." profile={data.profile} onSignOut={onSignOut} onResetData={onResetData} />
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
                  <button key={club.id} className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left hover:bg-secondary" onClick={() => onOpenClub(club.id)}>
                    <span>
                      <span className="block font-medium">{club.name}</span>
                      <span className="text-sm text-muted-foreground">{club.term}</span>
                    </span>
                    <Badge variant="secondary">{club.role}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <ListCard title="My tasks" empty="No tasks assigned to you.">
                {myTasks.map((task) => (
                  <button key={task.id} className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary" onClick={() => onOpenTask(task.id)}>
                    <span className="block font-medium">{task.title}</span>
                    <span className="text-muted-foreground">{nameOf(data.clubs, task.clubId)} - {task.status} - due {task.dueDate}</span>
                  </button>
                ))}
              </ListCard>
              <ListCard title="Upcoming events" empty="No upcoming events.">
                {data.events
                  .filter((event) => event.status !== "completed" && event.status !== "cancelled")
                  .map((event) => (
                    <button key={event.id} className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary" onClick={() => onOpenEvent(event.id)}>
                      <span className="block font-medium">{event.title}</span>
                      <span className="text-muted-foreground">{nameOf(data.clubs, event.clubId)} - {event.date}</span>
                    </button>
                  ))}
              </ListCard>
              <ListCard title="Upcoming meetings" empty="No upcoming meetings.">
                {data.meetings
                  .filter((meeting) => meeting.status !== "approved")
                  .map((meeting) => (
                    <button key={meeting.id} className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary" onClick={() => onOpenMeeting(meeting.id)}>
                      <span className="block font-medium">{meeting.title}</span>
                      <span className="text-muted-foreground">{nameOf(data.clubs, meeting.clubId)} - {meeting.date}</span>
                    </button>
                  ))}
              </ListCard>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
