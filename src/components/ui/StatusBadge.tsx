import { statusColors, statusLabels, type ProjectStatus } from "@/content/projects";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const color = statusColors[status];
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-faint">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      {statusLabels[status]}
    </span>
  );
}
