"use client";

import { useState } from "react";
import DayView from "@/components/DayView";
import RoomView from "@/components/RoomView";
import PeopleView from "@/components/PeopleView";
import CompaniesView from "@/components/CompaniesView";
import CheckInView from "@/components/CheckInView";
import FilterBar from "@/components/FilterBar";
import { meetings, MeetingType } from "@/lib/data";
import { Building2, CalendarDays, MapPin, Users, RefreshCw, ClipboardCheck } from "lucide-react";
import clsx from "clsx";

type View = "day" | "room" | "people" | "companies" | "checkin";

const tabs: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "day", label: "By Day", icon: CalendarDays },
  { id: "room", label: "By Room", icon: MapPin },
  { id: "people", label: "By Person", icon: Users },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "checkin", label: "Check-In", icon: ClipboardCheck },
];

export default function Home() {
  const [view, setView] = useState<View>("day");
  const [filter, setFilter] = useState<MeetingType | "all">("all");

  // Type counts for the filter bar
  const counts = meetings.reduce(
    (acc, m) => {
      acc[m.type] = (acc[m.type] ?? 0) + 1;
      acc.__total = (acc.__total ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-slate-950 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <span className="text-white font-black text-sm tracking-tight">TL</span>
                </div>
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 opacity-30 blur-sm -z-10" />
              </div>
              {/* Title */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">NAB 2026</h1>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    TwelveLabs
                  </span>
                </div>
                <p className="text-sm text-slate-400">April 19–22 · Las Vegas</p>
              </div>
            </div>

          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Meetings", value: (counts.meeting ?? 0) + (counts.partner ?? 0) },
              { label: "Customer Meetings", value: counts.meeting ?? 0 },
              { label: "Partner Meetings", value: counts.partner ?? 0 },
              { label: "Team Members", value: new Set(meetings.flatMap((m) => m.internalAttendees)).size },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-900 rounded-xl border border-slate-800 px-4 py-3">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Last updated */}
          <div className="mt-3 flex items-center gap-1.5 text-slate-500 text-xs">
            <RefreshCw className="w-3 h-3" />
            <span>Last updated: Apr 8, 2026</span>
          </div>
        </div>
      </header>

      {/* ── Nav / Controls ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 pt-3 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 whitespace-nowrap",
                  view === id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Filter bar */}
          <div className="py-3">
            <FilterBar active={filter} onChange={setFilter} counts={counts} />
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {view === "day" && <DayView filter={filter} />}
        {view === "room" && <RoomView filter={filter} />}
        {view === "people" && <PeopleView filter={filter} />}
        {view === "companies" && <CompaniesView filter={filter} />}
        {view === "checkin" && <CheckInView />}
      </main>
    </div>
  );
}
