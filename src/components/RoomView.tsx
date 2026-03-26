"use client";

import { getLocations, getMeetingsByLocation, days, MeetingType } from "@/lib/data";
import MeetingCard from "./MeetingCard";
import { MapPin } from "lucide-react";

function simplifyLocation(loc: string): string {
  if (loc.includes("NAB Booth 1")) return "NAB Booth 1";
  if (loc.includes("NAB Booth 2")) return "NAB Booth 2";
  if (loc.includes("Partner Theater")) return "Partner Theater";
  if (loc.includes("Demo Lounge")) return "Demo Lounge";
  if (loc.includes("M&E Stage")) return "M&E Stage";
  if (loc.includes("AWS Partner")) return "AWS Partner Stage";
  if (loc.includes("Sports Summit")) return "Sports Summit Stage";
  if (loc.includes("Backblaze")) return "Backblaze Booth";
  if (loc.includes("Opal Boardroom")) return "Opal Boardroom (Fontainebleau)";
  if (loc.includes("NAB VIP") || (loc.includes("Fontainebleau") && !loc.includes("2777")))
    return "NAB VIP – Fontainebleau";
  if (loc.includes("Fontainebleau") && loc.includes("2777")) return "Fontainebleau – Breakfast";
  if (loc.includes("Marquee")) return "Marquee Nightclub";
  if (loc.includes("Bellagio")) return "The Vault at Bellagio";
  if (loc.includes("AWS Booth")) return "AWS Booth";
  if (loc.includes("Dalet Booth")) return "Dalet Booth";
  if (loc.includes("Vidispine Booth")) return "Vidispine Booth";
  return loc.length > 35 ? loc.slice(0, 35) + "…" : loc;
}

export default function RoomView({ filter = "all" }: { filter?: MeetingType | "all" }) {
  const locations = getLocations(filter);

  return (
    <div className="space-y-10">
      {locations.map((loc) => {
        const locMeetings = getMeetingsByLocation(loc, filter);
        const byDay = days
          .map((d) => ({ ...d, meetings: locMeetings.filter((m) => m.day === d.day) }))
          .filter((d) => d.meetings.length > 0);

        return (
          <div key={loc}>
            <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <h2 className="text-lg font-bold text-gray-900">{simplifyLocation(loc)}</h2>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 ml-6 truncate">{loc}</p>
              <p className="text-sm text-gray-400 ml-6">{locMeetings.length} events</p>
            </div>

            <div className="space-y-6">
              {byDay.map(({ day, shortLabel, meetings }) => (
                <div key={day}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{shortLabel}</h3>
                  <div className="space-y-3">
                    {meetings.map((m) => (
                      <MeetingCard key={m.id} meeting={m} showDate />
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
