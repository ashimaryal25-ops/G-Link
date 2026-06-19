import type { ClubRole } from "./types";

export function canCreateTask(role: ClubRole) {
  return ["president", "vice president", "secretary", "event coordinator"].includes(role);
}

export function canCreateEvent(role: ClubRole) {
  return ["president", "vice president", "event coordinator"].includes(role);
}

export function canCreateMeeting(role: ClubRole) {
  return ["president", "vice president", "secretary"].includes(role);
}
