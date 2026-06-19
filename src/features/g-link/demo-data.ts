import type { AppData } from "./types";

export const starterData: AppData = {
  profile: { fullName: "Jordan Carter", email: "jordan@gettysburg.edu" },
  clubs: [
    {
      id: "club-bsu",
      name: "Black Student Union",
      description: "Exec board workspace for events, tasks, meetings, and event budget records.",
      role: "president",
      term: "Spring 2026",
    },
    {
      id: "club-intl",
      name: "International Club",
      description: "Planning space for club events and meeting follow-ups.",
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
