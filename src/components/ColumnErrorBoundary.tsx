"use client";

import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";

function Fallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="text-sm font-semibold">Something went wrong</div>
      <div className="max-w-[520px] text-xs text-white/60">
        {error.message || "Unexpected error"}
      </div>
      <Button variant="secondary" onClick={resetErrorBoundary}>
        Retry
      </Button>
    </div>
  );
}

export function ColumnErrorBoundary({
  onRetry,
  children,
}: {
  onRetry: () => void;
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      onReset={onRetry}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <Fallback error={error as Error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
