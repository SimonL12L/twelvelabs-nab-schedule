"use client";

import { searchMeetings, days, MeetingType } from "@/lib/data";
import MeetingCard from "./MeetingCard";
import { SearchX } from "lucide-react";

export default function SearchView({ query, filter }: { query: string; filter: MeetingType | "all" }) {
  const results = searchMeetings(query, filter);

  const byDay = days
    .map((d) => ({ ...d, meetings: results.filter((m) => m.day === d.day) }))
    .filter((d) => d.meetings.length > 0);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchX className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-base font-medium text-gray-400">No results for &ldquo;{query}&rdquo;</p>
        <p className="text-sm text-gray-400 mt-1">Try a company name, person, or location</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-500">
        <span className="font-semibold text-gray-800">{results.length}</span>{" "}
        {results.length === 1 ? "result" : "results"} for &ldquo;<span className="font-medium">{query}</span>&rdquo;
      </p>

      {byDay.map(({ day, label, meetings }) => (
        <div key={day}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{label}</h2>
          <div className="space-y-3">
            {meetings.map((m) => (
              <MeetingCard key={m.id} meeting={m} showDate />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
