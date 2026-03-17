"use client";

import { getLocations, getMeetingsByLocation, days } from "@/lib/data";
import MeetingCard from "./MeetingCard";
import { MapPin } from "lucide-react";

function simplifyLocation(loc: string): string {
  if (loc.includes("Booth 1")) return "NAB Booth 1";
  if (loc.includes("Booth 2")) return "NAB Booth 2";
  if (loc.includes("Demo Lounge")) return "Demo Lounge";
  if (loc.includes("M&E Stage")) return "M&E Stage";
  if (loc.includes("AWS Partner")) return "AWS Partner Stage";
  if (loc.includes("Sports Summit")) return "Sports Summit Stage";
  if (loc.includes("Fontainebleau")) return "Fontainebleau VIP";
  if (loc.includes("Marquee")) return "Marquee Nightclub";
  return loc.length > 30 ? loc.slice(0, 30) + "…" : loc;
}

export default function RoomView() {
  const locations = getLocations();

  return (
    <div className="space-y-10">
      {locations.map((loc) => {
        const locMeetings = getMeetingsByLocation(loc);
        // Group by day
        const byDay = days
          .map((d) => ({
            ...d,
            meetings: locMeetings.filter((m) => m.day === d.day),
          }))
          .filter((d) => d.meetings.length > 0);

        return (
          <div key={loc}>
            <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-3 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-gray-900">{simplifyLocation(loc)}</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 ml-7">{loc}</p>
              <p className="text-sm text-gray-500 ml-7">{locMeetings.length} events</p>
            </div>

            <div className="space-y-6">
              {byDay.map(({ day, shortLabel, meetings }) => (
                <div key={day}>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 ml-1">{shortLabel}</h3>
                  <div className="space-y-3">
                    {meetings.map((m) => (
                      <MeetingCard key={m.id} meeting={m} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
