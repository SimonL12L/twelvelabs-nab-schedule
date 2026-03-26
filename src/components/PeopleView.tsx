"use client";

import { getPeople, getMeetingsByPerson, days, MeetingType } from "@/lib/data";
import MeetingCard from "./MeetingCard";
import { User } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function PeopleView({ filter = "all" }: { filter?: MeetingType | "all" }) {
  const people = getPeople();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedMeetings = selected ? getMeetingsByPerson(selected, filter) : [];
  const allMeetings = selected ? getMeetingsByPerson(selected) : [];
  const byDay = days
    .map((d) => ({ ...d, meetings: selectedMeetings.filter((m) => m.day === d.day) }))
    .filter((d) => d.meetings.length > 0);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* People list */}
      <div className="md:w-64 shrink-0">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
          Team Members
        </h3>
        <div className="space-y-1">
          {people.map(({ email, name }) => {
            const total = getMeetingsByPerson(email).length;
            const filtered = getMeetingsByPerson(email, filter).length;
            return (
              <button
                key={email}
                onClick={() => setSelected(email === selected ? null : email)}
                className={clsx(
                  "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150 flex items-center justify-between",
                  selected === email
                    ? "bg-blue-600 text-white shadow-sm"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <User className={clsx("w-3.5 h-3.5 shrink-0", selected === email ? "text-blue-200" : "text-gray-400")} />
                  <span className="truncate font-medium text-sm">{name}</span>
                </div>
                <span
                  className={clsx(
                    "text-xs font-semibold px-1.5 py-0.5 rounded-full shrink-0 ml-1",
                    selected === email ? "bg-blue-500 text-blue-100" : "bg-gray-100 text-gray-500"
                  )}
                >
                  {filter === "all" ? total : `${filtered}/${total}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule */}
      <div className="flex-1 min-w-0">
        {!selected ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <User className="w-12 h-12 mb-3" />
            <p className="text-base font-medium text-gray-400">Select a team member</p>
            <p className="text-sm text-gray-400">to view their schedule</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {people.find((p) => p.email === selected)?.name}
              </h2>
              <p className="text-sm text-gray-400">
                {selectedMeetings.length} of {allMeetings.length} meetings shown · {byDay.length} days
              </p>
            </div>
            {byDay.map(({ day, label, meetings }) => (
              <div key={day}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{label}</h3>
                <div className="space-y-3">
                  {meetings.map((m) => (
                    <MeetingCard key={m.id} meeting={m} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
