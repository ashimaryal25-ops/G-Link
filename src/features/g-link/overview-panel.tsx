import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Info, ListCard } from "./common-ui";
import type { Club, Event, Meeting, Task, WorkspaceView } from "./types";

export function OverviewPanel({
  club,
  events,
  tasks,
  meetings,
  setView,
  setSelectedEventId,
  setSelectedMeetingId,
  setSelectedTaskId,
}: {
  club: Club;
  events: Event[];
  tasks: Task[];
  meetings: Meeting[];
  setView: (view: WorkspaceView) => void;
  setSelectedEventId: (id: string) => void;
  setSelectedMeetingId: (id: string) => void;
  setSelectedTaskId: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Club overview</CardTitle>
          <CardDescription>{club.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Info label="Term" value={club.term} />
        </CardContent>
      </Card>

      <ListCard title="Active events" empty="No active events.">
        {events.filter((event) => event.status !== "completed").length > 0 ? (
          events
            .filter((event) => event.status !== "completed")
            .map((event) => (
              <button
                key={event.id}
                className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary"
                onClick={() => {
                  setSelectedEventId(event.id);
                  setView("events");
                }}
              >
                <span className="block font-medium">{event.title}</span>
                <span className="text-muted-foreground">{event.date} - Lead: {event.owner}</span>
              </button>
            ))
        ) : (
          <button className="w-full rounded-md border border-dashed border-border p-4 text-left text-sm text-muted-foreground hover:bg-secondary" onClick={() => setView("create")}>
            No active events. Create the first event.
          </button>
        )}
      </ListCard>

      <ListCard title="Recent tasks" empty="No recent tasks.">
        {tasks.length > 0 ? (
          tasks.slice(0, 3).map((task) => (
            <button
              key={task.id}
              className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary"
              onClick={() => {
                setSelectedTaskId(task.id);
                setView("tasks");
              }}
            >
              <span className="block font-medium">{task.title}</span>
              <span className="text-muted-foreground">{task.assignee} - {task.status}</span>
            </button>
          ))
        ) : (
          <button className="w-full rounded-md border border-dashed border-border p-4 text-left text-sm text-muted-foreground hover:bg-secondary" onClick={() => setView("create")}>
            No tasks yet. Create the first task.
          </button>
        )}
      </ListCard>

      <ListCard title="Upcoming meetings" empty="No upcoming meetings.">
        {meetings.length > 0 ? (
          meetings.slice(0, 2).map((meeting) => (
            <button
              key={meeting.id}
              className="w-full rounded-md border border-border p-3 text-left text-sm hover:bg-secondary"
              onClick={() => {
                setSelectedMeetingId(meeting.id);
                setView("meetings");
              }}
            >
              <span className="block font-medium">{meeting.title}</span>
              <span className="text-muted-foreground">{meeting.date} - {meeting.status}</span>
            </button>
          ))
        ) : (
          <button className="w-full rounded-md border border-dashed border-border p-4 text-left text-sm text-muted-foreground hover:bg-secondary" onClick={() => setView("create")}>
            No meetings yet. Schedule the first meeting.
          </button>
        )}
      </ListCard>
    </div>
  );
}
