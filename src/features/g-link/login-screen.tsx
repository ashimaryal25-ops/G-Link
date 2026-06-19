import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Info, LabeledInput } from "./common-ui";
import type { Profile } from "./types";

export function LoginScreen({
  form,
  setForm,
  onSubmit,
}: {
  form: Profile;
  setForm: (form: Profile) => void;
  onSubmit: () => void;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-[1fr_420px]">
        <section className="space-y-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">G-Link</p>
            <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-normal">One workspace for club exec work.</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">Sign in to see your clubs, tasks, events, and meetings in one place.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Info label="Home" value="Clubs and personal tasks" />
            <Info label="Club" value="Exec workspace" />
            <Info label="Event" value="Tasks, meetings, budget" />
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>This is local demo login until real auth is connected.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <LabeledInput label="Full name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
            <LabeledInput label="Email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <Button className="w-full" onClick={onSubmit}>
              Enter workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
