"use client";

import { days, getMeetingsByDay, MeetingType } from "@/lib/data";
import MeetingCard from "./MeetingCard";

export default function DayView({ filter = "all" }: { filter?: MeetingType | "all" }) {
  return (
    <div className="space-y-10">
      {days.map(({ day, label }) => {
        const dayMeetings = getMeetingsByDay(day, filter);
        if (dayMeetings.length === 0) return null;

        const timeGroups: Record<string, typeof dayMeetings> = {};
        dayMeetings.forEach((m) => {
          if (!timeGroups[m.time]) timeGroups[m.time] = [];
          timeGroups[m.time].push(m);
        });

        return (
          <div key={day}>
            <div className="sticky top-[97px] sm:top-[105px] z-10 bg-gray-50/95 backdrop-blur-sm py-2.5 mb-4 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">{label}</h2>
              <p className="text-xs sm:text-sm text-gray-400">{dayMeetings.length} events</p>
            </div>

            <div className="relative">
              <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gray-200 hidden md:block" />
              <div className="space-y-4 sm:space-y-6">
                {Object.entries(timeGroups).map(([time, mtgs]) => (
                  <div key={time} className="relative flex gap-3 md:gap-6">
                    <div className="w-[52px] sm:w-[60px] md:w-[72px] shrink-0 text-right pt-0.5">
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-500 bg-gray-50 relative z-10 inline-block leading-tight">
                        {time}
                      </span>
                    </div>
                    <div className="hidden md:flex w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm mt-1 shrink-0 relative z-10" />
                    <div className="flex-1 space-y-3 min-w-0">
                      {mtgs.map((m) => (
                        <MeetingCard key={m.id} meeting={m} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
