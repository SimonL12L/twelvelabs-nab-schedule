"use client";

import { meetings, days, getPeople, getLocations } from "@/lib/data";
import { Calendar, MapPin, Users, Building2 } from "lucide-react";

export default function StatsBar() {
  const stats = [
    { icon: Calendar, label: "Events", value: meetings.length },
    { icon: Building2, label: "Days", value: days.length },
    { icon: MapPin, label: "Locations", value: getLocations().length },
    { icon: Users, label: "Team Members", value: getPeople().length },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
