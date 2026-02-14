"use client";

import type { POStatusHistory } from "../../types/po";

type POStatusTimelineProps = {
  history: POStatusHistory[];
};

export function POStatusTimeline({ history }: POStatusTimelineProps) {
  return (
    <ol className="space-y-3 border-l border-zinc-300 pl-4">
      {history.map((entry, index) => (
        <li key={`${entry.status}-${index}`} className="relative">
          <span className="absolute -left-[21px] mt-1 h-3 w-3 rounded-full bg-zinc-800" />
          <p className="text-sm font-semibold text-zinc-900">{entry.status}</p>
          <p className="text-xs text-zinc-900">
            {entry.changedAt.toLocaleString()} by {entry.changedBy}
          </p>
        </li>
      ))}
    </ol>
  );
}
