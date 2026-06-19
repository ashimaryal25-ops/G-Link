import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Header } from "./common-ui";
import type { Member, Profile } from "./types";

export function AppTopBar({
  eyebrow,
  title,
  description,
  profile,
  onSignOut,
  onResetData,
}: {
  eyebrow: string;
  title: string;
  description: string;
  profile: Profile;
  onSignOut: () => void;
  onResetData?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
      <Header eyebrow={eyebrow} title={title} description={description} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {onResetData ? (
          <Button variant="outline" size="sm" onClick={onResetData}>
            Reset demo data
          </Button>
        ) : null}
        <UserBadge profile={profile} onSignOut={onSignOut} />
      </div>
    </div>
  );
}

export function UserBadge({ profile, onSignOut }: { profile: Profile; onSignOut: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{profile.fullName}</p>
        <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
      </div>
      <Button variant="ghost" size="sm" className="shrink-0" onClick={onSignOut}>
        Sign out
      </Button>
    </div>
  );
}

export function ExecBoard({ members }: { members: Member[] }) {
  const execMembers = members.filter((member) => member.role !== "member");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Exec board</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {execMembers.length > 0 ? (
          execMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate">{member.name}</span>
              <Badge variant="secondary">{member.role}</Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No exec members yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DemoDataNotice({ onResetData }: { onResetData: () => void }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Demo data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">Changes are saved in this browser only until Supabase is connected.</p>
        <Button variant="outline" size="sm" className="w-full" onClick={onResetData}>
          Reset demo data
        </Button>
      </CardContent>
    </Card>
  );
}
