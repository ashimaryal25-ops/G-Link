"use client";

import { useEffect, useMemo, useState } from "react";

import { ClubWorkspace } from "@/features/g-link/club-workspace";
import { starterData } from "@/features/g-link/demo-data";
import { makeId, sessionKey, storageKey, today } from "@/features/g-link/helpers";
import { LoginScreen } from "@/features/g-link/login-screen";
import { canCreateEvent, canCreateMeeting, canCreateTask } from "@/features/g-link/permissions";
import { StudentHome } from "@/features/g-link/student-home";
import type { AppData, Event, EventForm, Meeting, MeetingForm, Task, TaskForm, TaskStatus, WorkspaceView } from "@/features/g-link/types";

export function GLinkMvpApp() {
  const [data, setData] = useState<AppData>(starterData);
  const [loaded, setLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [view, setView] = useState<WorkspaceView>("overview");
  const [selectedEventId, setSelectedEventId] = useState(starterData.events[0]?.id ?? "");
  const [selectedMeetingId, setSelectedMeetingId] = useState(starterData.meetings[0]?.id ?? "");
  const [selectedTaskId, setSelectedTaskId] = useState(starterData.tasks[0]?.id ?? "");
  const [loginForm, setLoginForm] = useState(starterData.profile);
  const [eventForm, setEventForm] = useState<EventForm>({ title: "", description: "", date: today(), location: "", owner: "", plannedBudget: "", actualBudget: "" });
  const [meetingForm, setMeetingForm] = useState<MeetingForm>({ title: "", date: today(), eventId: "" });
  const [taskForm, setTaskForm] = useState<TaskForm>({ title: "", description: "", assignee: "", dueDate: today(), eventId: "", meetingId: "" });

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);

        if (saved) {
          try {
            const savedData = JSON.parse(saved) as AppData;
            setData(savedData);
            if (savedData.profile) setLoginForm(savedData.profile);
          } catch {
            setData(starterData);
          }
        }

        setIsSignedIn(window.localStorage.getItem(sessionKey) === "true");
      } catch {
        setData(starterData);
        setIsSignedIn(false);
      } finally {
        setLoaded(true);
      }
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

  function signIn() {
    if (!loginForm.fullName.trim() || !loginForm.email.trim()) return;

    setData((current) => ({
      ...current,
      profile: {
        fullName: loginForm.fullName.trim(),
        email: loginForm.email.trim(),
      },
    }));
    setIsSignedIn(true);
    window.localStorage.setItem(sessionKey, "true");
  }

  function signOut() {
    setIsSignedIn(false);
    setSelectedClubId(null);
    window.localStorage.setItem(sessionKey, "false");
  }

  function resetDemoData() {
    if (!window.confirm("Reset demo data back to the starter G-Link records?")) return;

    setData(starterData);
    setLoginForm(starterData.profile);
    setSelectedClubId(null);
    setSelectedEventId(starterData.events[0]?.id ?? "");
    setSelectedMeetingId(starterData.meetings[0]?.id ?? "");
    setSelectedTaskId(starterData.tasks[0]?.id ?? "");
    setView("overview");
    setEventForm({ title: "", description: "", date: today(), location: "", owner: "", plannedBudget: "", actualBudget: "" });
    setMeetingForm({ title: "", date: today(), eventId: "" });
    setTaskForm({ title: "", description: "", assignee: "", dueDate: today(), eventId: "", meetingId: "" });
    window.localStorage.setItem(storageKey, JSON.stringify(starterData));
  }

  function openClub(clubId: string) {
    const firstEvent = data.events.find((event) => event.clubId === clubId);
    const firstMeeting = data.meetings.find((meeting) => meeting.clubId === clubId);
    const firstTask = data.tasks.find((task) => task.clubId === clubId);
    setSelectedClubId(clubId);
    setSelectedEventId(firstEvent?.id ?? "");
    setSelectedMeetingId(firstMeeting?.id ?? "");
    setSelectedTaskId(firstTask?.id ?? "");
    setView("overview");
  }

  function openTask(taskId: string) {
    const task = data.tasks.find((item) => item.id === taskId);
    if (!task) return;

    setSelectedClubId(task.clubId);
    setSelectedTaskId(task.id);
    if (task.eventId) setSelectedEventId(task.eventId);
    if (task.meetingId) setSelectedMeetingId(task.meetingId);
    setView("tasks");
  }

  function openMeeting(meetingId: string) {
    const meeting = data.meetings.find((item) => item.id === meetingId);
    if (!meeting) return;

    setSelectedClubId(meeting.clubId);
    setSelectedMeetingId(meeting.id);
    if (meeting.eventId) setSelectedEventId(meeting.eventId);
    setView("meetings");
  }

  function openEvent(eventId: string) {
    const event = data.events.find((item) => item.id === eventId);
    if (!event) return;

    setSelectedClubId(event.clubId);
    setSelectedEventId(event.id);
    setView("events");
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
    const meeting: Meeting = {
      id: meetingId,
      clubId: selectedClub.id,
      title: meetingForm.title.trim(),
      date: meetingForm.date,
      rawNotes: "",
      decisions: "",
      status: "draft",
      eventId: meetingForm.eventId || undefined,
    };
    setData((current) => ({ ...current, meetings: [...current.meetings, meeting] }));
    setSelectedMeetingId(meetingId);
    setMeetingForm({ title: "", date: today(), eventId: "" });
    setView("meetings");
  }

  function addTask() {
    if (!selectedClub || !taskForm.title.trim() || !canCreateTask(selectedClub.role)) return;
    const defaultAssignee = clubMembers[0]?.name ?? data.profile.fullName;

    const task: Task = {
      id: makeId("task"),
      clubId: selectedClub.id,
      eventId: taskForm.eventId || undefined,
      meetingId: taskForm.meetingId || undefined,
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      assignee: taskForm.assignee.trim() || defaultAssignee,
      dueDate: taskForm.dueDate,
      status: "todo",
    };
    setData((current) => ({ ...current, tasks: [...current.tasks, task] }));
    setSelectedTaskId(task.id);
    setTaskForm({ title: "", description: "", assignee: "", dueDate: today(), eventId: "", meetingId: "" });
    setView("tasks");
  }

  function updateTaskStatus(taskId: string, status: TaskStatus) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    }));
  }

  function updateTask(taskId: string, updates: Partial<Task>) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
    }));
  }

  function removeTask(taskId: string) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId),
    }));
    if (selectedTaskId === taskId) setSelectedTaskId("");
  }

  function updateEvent(eventId: string, updates: Partial<Event>) {
    setData((current) => ({
      ...current,
      events: current.events.map((event) => (event.id === eventId ? { ...event, ...updates } : event)),
    }));
  }

  function updateMeeting(meetingId: string, updates: Partial<Meeting>) {
    setData((current) => ({
      ...current,
      meetings: current.meetings.map((meeting) => (meeting.id === meetingId ? { ...meeting, ...updates } : meeting)),
    }));
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Loading G-Link...</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return <LoginScreen form={loginForm} setForm={setLoginForm} onSubmit={signIn} />;
  }

  if (!selectedClub) {
    return <StudentHome data={data} myTasks={myTasks} onOpenClub={openClub} onOpenEvent={openEvent} onOpenTask={openTask} onOpenMeeting={openMeeting} onSignOut={signOut} onResetData={resetDemoData} />;
  }

  return (
    <ClubWorkspace
      profile={data.profile}
      selectedClub={selectedClub}
      clubMembers={clubMembers}
      clubEvents={clubEvents}
      clubMeetings={clubMeetings}
      clubTasks={clubTasks}
      selectedEvent={selectedEvent}
      selectedMeeting={selectedMeeting}
      selectedTaskId={selectedTaskId}
      view={view}
      eventForm={eventForm}
      meetingForm={meetingForm}
      taskForm={taskForm}
      setView={setView}
      setSelectedClubId={setSelectedClubId}
      setSelectedEventId={setSelectedEventId}
      setSelectedMeetingId={setSelectedMeetingId}
      setSelectedTaskId={setSelectedTaskId}
      setEventForm={setEventForm}
      setMeetingForm={setMeetingForm}
      setTaskForm={setTaskForm}
      updateEvent={updateEvent}
      updateMeeting={updateMeeting}
      updateTask={updateTask}
      updateTaskStatus={updateTaskStatus}
      removeTask={removeTask}
      addEvent={addEvent}
      addMeeting={addMeeting}
      addTask={addTask}
      onSignOut={signOut}
      onResetData={resetDemoData}
      openTask={openTask}
    />
  );
}
