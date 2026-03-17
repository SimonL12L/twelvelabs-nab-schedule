"use client";

import { useState } from "react";
import DayView from "@/components/DayView";
import RoomView from "@/components/RoomView";
import PeopleView from "@/components/PeopleView";
import StatsBar from "@/components/StatsBar";
import { CalendarDays, MapPin, Users } from "lucide-react";
import clsx from "clsx";

type View = "day" | "room" | "people";

const tabs: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "day", label: "By Day", icon: CalendarDays },
  { id: "room", label: "By Room", icon: MapPin },
  { id: "people", label: "By Person", icon: Users },
];

export default function Home() {
  const [view, setView] = useState<View>("day");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TL</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">NAB 2026</h1>
                  <p className="text-sm text-gray-500">TwelveLabs Team Schedule &middot; April 19–21, Las Vegas</p>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-400">Last updated</p>
              <p className="text-sm text-gray-600 font-medium">Mar 16, 4:45 PM PT</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <StatsBar />

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 inline-flex gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                view === id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {view === "day" && <DayView />}
          {view === "room" && <RoomView />}
          {view === "people" && <PeopleView />}
        </div>
      </main>
    </div>
  );
}
