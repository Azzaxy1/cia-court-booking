"use client";

import { AppProgressProvider } from "@bprogress/next";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppProgressProvider
      color="#03A6A1"
      height="3px"
      options={{
        showSpinner: false,
      }}
    >
      {children}
    </AppProgressProvider>
  );
}
