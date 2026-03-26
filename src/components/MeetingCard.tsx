"use client";

import { Meeting } from "@/lib/data";
import { Clock, MapPin, Users, Building2, Mic2, UtensilsCrossed, PartyPopper, Lock, Handshake } from "lucide-react";
import clsx from "clsx";

const typeConfig: Record<Meeting["type"], { bg: string; border: string; badge: string; badgeText: string; icon: React.ElementType }> = {
  meeting: { bg: "bg-white", border: "border-blue-200", badge: "bg-blue-50 text-blue-700", badgeText: "Customer Meeting", icon: Building2 },
  partner: { bg: "bg-white", border: "border-teal-200", badge: "bg-teal-50 text-teal-700", badgeText: "Partner Meeting", icon: Handshake },
  panel: { bg: "bg-white", border: "border-violet-200", badge: "bg-violet-50 text-violet-700", badgeText: "Panel / Speaking", icon: Mic2 },
  dinner: { bg: "bg-white", border: "border-amber-200", badge: "bg-amber-50 text-amber-700", badgeText: "Customer Dinner", icon: UtensilsCrossed },
  event: { bg: "bg-white", border: "border-emerald-200", badge: "bg-emerald-50 text-emerald-700", badgeText: "Event", icon: PartyPopper },
  internal: { bg: "bg-gray-50", border: "border-gray-300", badge: "bg-gray-100 text-gray-600", badgeText: "Internal", icon: Lock },
};

function emailToName(email: string): string {
  const local = email.split("@")[0];
  const parts = local.split(".");
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

export default function MeetingCard({ meeting, showDate }: { meeting: Meeting; showDate?: boolean }) {
  const config = typeConfig[meeting.type];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        "rounded-xl border-l-4 p-4 shadow-sm hover:shadow-md transition-all duration-200",
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={clsx("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", config.badge)}>
              <Icon className="w-3 h-3" />
              {config.badgeText}
            </span>
            {meeting.company.includes("HOLD") && (
              <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                HOLD
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 text-base truncate">{meeting.company}</h3>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {meeting.time}
          </div>
          {showDate && <div className="text-xs text-gray-500 mt-0.5">{meeting.date}</div>}
        </div>
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-sm text-gray-500">
        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
        <span className="leading-tight">{meeting.location}</span>
      </div>

      {(meeting.internalAttendees.length > 0 || meeting.externalAttendees.length > 0) && (
        <div className="mt-3 space-y-2">
          {meeting.internalAttendees.length > 0 && (
            <div className="flex items-start gap-1.5">
              <Users className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-400" />
              <div className="flex flex-wrap gap-1">
                {meeting.internalAttendees.map((email) => (
                  <span key={email} className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {emailToName(email)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {meeting.externalAttendees.length > 0 && (
            <div className="flex items-start gap-1.5">
              <Users className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {meeting.externalAttendees.map((contact) => (
                  <span key={contact} className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {contact.includes("@") ? emailToName(contact) : contact}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
