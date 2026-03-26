"use client";

import { getCompanies, days, MeetingType } from "@/lib/data";
import { Building2, Clock, MapPin } from "lucide-react";
import clsx from "clsx";

function emailToName(email: string): string {
  const local = email.split("@")[0];
  return local.split(".").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

function simplifyLocation(location: string): string {
  if (location.includes("NAB Booth 1")) return "NAB Booth 1";
  if (location.includes("NAB Booth 2")) return "NAB Booth 2";
  if (location.includes("Partner Theater")) return "Partner Theater";
  if (location.includes("Demo Lounge")) return "Demo Lounge";
  if (location.includes("Opal Boardroom")) return "Opal Boardroom";
  if (location.includes("NAB VIP") || location.includes("Fontainebleau")) return "Fontainebleau VIP";
  if (location.includes("AWS Booth")) return "AWS Booth";
  if (location.includes("Dalet Booth")) return "Dalet Booth";
  if (location.includes("Vidispine Booth")) return "Vidispine Booth";
  if (location.includes("Bellagio")) return "The Vault at Bellagio";
  return location.split(",")[0].trim();
}

const typeColors: Record<string, string> = {
  meeting: "bg-blue-50 border-blue-100",
  partner: "bg-teal-50 border-teal-100",
  panel: "bg-violet-50 border-violet-100",
};

export default function CompaniesView({ filter = "all" }: { filter?: MeetingType | "all" }) {
  const companies = getCompanies(filter);

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Building2 className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-base font-medium">No companies for this filter</p>
        <p className="text-sm">Try selecting &quot;All&quot;, &quot;Customer Meetings&quot;, or &quot;Panels&quot;</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        {companies.length} companies &middot; {filter === "all" ? "customer meetings + panels" : filter}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => {
          const dayLabels = [
            ...new Set(
              company.meetings.map((m) => {
                const d = days.find((d) => d.day === m.day);
                return d?.shortLabel ?? `Apr ${m.day}`;
              })
            ),
          ];
          const primaryType = company.meetings[0]?.type ?? "meeting";

          return (
            <div
              key={company.name}
              className={clsx(
                "rounded-xl border p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-150",
                typeColors[primaryType] ?? "bg-white border-gray-200"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-white rounded-lg border border-white/80 flex items-center justify-center shrink-0 shadow-sm">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">{company.name}</h3>
                </div>
                <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                  {company.isHold && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                      HOLD
                    </span>
                  )}
                  {dayLabels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-white/70 text-gray-600"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meetings */}
              <div className="space-y-2.5">
                {company.meetings.map((meeting) => (
                  <div key={meeting.id} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{meeting.time}</span>
                      {meeting.location && (
                        <>
                          <span className="text-gray-300">&middot;</span>
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{simplifyLocation(meeting.location)}</span>
                        </>
                      )}
                    </div>

                    {meeting.internalAttendees.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meeting.internalAttendees.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                          >
                            {emailToName(email)}
                          </span>
                        ))}
                      </div>
                    )}

                    {meeting.externalAttendees.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meeting.externalAttendees.slice(0, 4).map((contact) => (
                          <span
                            key={contact}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-white/80 text-gray-600 border border-gray-200"
                          >
                            {contact.includes("@") ? emailToName(contact) : contact}
                          </span>
                        ))}
                        {meeting.externalAttendees.length > 4 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            +{meeting.externalAttendees.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
