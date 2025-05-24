"use client";

import { Schedule } from "@/app/generated/prisma";
import { createContext, useContext, useState, ReactNode } from "react";

interface ScheduleContextType {
  selectedSchedule: Schedule | null;
  setSelectedSchedule: (schedule: Schedule | null) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  return (
    <ScheduleContext.Provider value={{ selectedSchedule, setSelectedSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context)
    throw new Error("useSchedule must be used within a ScheduleProvider");
  return context;
};
