import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Header({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <header>
      <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
      <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </header>
  );
}

export function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
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

export function WorkspaceButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-secondary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground" data-active={active} onClick={onClick}>
      {label}
    </button>
  );
}

export function FormCard({ title, action, children, onSubmit }: { title: string; action: string; children: ReactNode; onSubmit: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
        <Button onClick={onSubmit}>
          <Plus className="size-4" />
          {action}
        </Button>
      </CardContent>
    </Card>
  );
}

export function ListCard({ title, empty, children }: { title: string; empty: string; children: ReactNode }) {
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

export function ListBlock({
  title,
  empty,
  emptyActionLabel,
  onEmptyAction,
  children,
}: {
  title?: string;
  empty: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  children: ReactNode;
}) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];

  return (
    <section className="space-y-2">
      {title ? <h3 className="text-sm font-medium">{title}</h3> : null}
      {items.length > 0 ? (
        items
      ) : (
        <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          <p>{empty}</p>
          {emptyActionLabel && onEmptyAction ? (
            <Button variant="outline" size="sm" className="mt-3" onClick={onEmptyAction}>
              {emptyActionLabel}
            </Button>
          ) : null}
        </div>
      )}
    </section>
  );
}

export function RecordLine({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-border p-3 text-sm">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-muted-foreground">{detail}</p>
    </div>
  );
}

export function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

export function EmptyState({ title, detail, actionLabel, onAction }: { title: string; detail: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{detail}</CardDescription>
        {actionLabel && onAction ? (
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </CardHeader>
    </Card>
  );
}

export function LabeledInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function LabeledTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function LabeledSelect({
  label,
  value,
  options,
  labels = {},
  disabledOptions = [],
  compact = false,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
  disabledOptions?: string[];
  compact?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className={compact ? "grid min-w-36 gap-1 text-xs font-medium text-muted-foreground" : "grid gap-1.5 text-sm font-medium"}>
      {label}
      <select className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option} disabled={disabledOptions.includes(option)}>
            {labels[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}
