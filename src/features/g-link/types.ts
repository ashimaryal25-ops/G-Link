export type ClubRole =
  | "president"
  | "vice president"
  | "secretary"
  | "treasurer"
  | "event coordinator"
  | "member"
  | "advisor";

export type TaskStatus = "todo" | "in progress" | "blocked" | "done" | "cancelled";
export type EventStatus = "draft" | "planned" | "active" | "completed" | "cancelled";
export type WorkspaceView = "overview" | "events" | "tasks" | "meetings" | "create";

export type Profile = { fullName: string; email: string };
export type Club = { id: string; name: string; description: string; role: ClubRole; term: string };
export type Member = {
  id: string;
  clubId: string;
  name: string;
  email: string;
  role: ClubRole;
  status: "active" | "invited";
};

export type Event = {
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

export type Meeting = {
  id: string;
  clubId: string;
  eventId?: string;
  title: string;
  date: string;
  rawNotes: string;
  decisions: string;
  status: "draft" | "reviewed" | "approved";
};

export type Task = {
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

export type AppData = {
  profile: Profile;
  clubs: Club[];
  members: Member[];
  events: Event[];
  meetings: Meeting[];
  tasks: Task[];
};

export type EventForm = {
  title: string;
  description: string;
  date: string;
  location: string;
  owner: string;
  plannedBudget: string;
  actualBudget: string;
};

export type MeetingForm = {
  title: string;
  date: string;
  eventId: string;
};

export type TaskForm = {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  eventId: string;
  meetingId: string;
};
