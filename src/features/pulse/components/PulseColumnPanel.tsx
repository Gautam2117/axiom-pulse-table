"use client";

import * as React from "react";
import { usePulseColumn } from "@/features/pulse/hooks/usePulseColumn";
import type { PulseColumn } from "@/features/pulse/types";
import { ColumnHeader } from "@/features/pulse/components/ColumnHeader";
import { TokenList } from "@/features/pulse/components/TokenList";
import { ColumnErrorBoundary } from "@/components/ColumnErrorBoundary";

export function PulseColumnPanel({
  column,
  title,
  hint,
}: {
  column: PulseColumn;
  title: string;
  hint: string;
}) {
  const q = usePulseColumn(column);
  const retry = React.useCallback(() => {
    q.refetch();
  }, [q]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04]">
      <ColumnHeader column={column} title={title} hint={hint} isLoading={q.isLoading} />

      <div className="h-[72dvh] lg:h-[76dvh]">
        <ColumnErrorBoundary onRetry={retry}>
          <TokenList
            column={column}
            items={q.data?.items ?? []}
            isLoading={q.isLoading}
            isError={q.isError}
            errorMessage={q.error instanceof Error ? q.error.message : "Failed to load"}
            onRetry={retry}
          />
        </ColumnErrorBoundary>
      </div>
    </div>
  );
}
