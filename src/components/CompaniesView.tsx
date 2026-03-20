"use client";

import { getCompanies, days } from "@/lib/data";
import { Building2, Clock, MapPin } from "lucide-react";
import clsx from "clsx";

function emailToName(email: string): string {
  const local = email.split("@")[0];
  const parts = local.split(".");
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

function simplifyLocation(location: string): string {
  if (location.includes("NAB Booth 1")) return "NAB Booth 1";
  if (location.includes("NAB Booth 2")) return "NAB Booth 2";
  if (location.includes("Demo Lounge")) return "Demo Lounge";
  if (location.includes("Opal Boardroom")) return "Opal Boardroom";
  if (location.includes("NAB VIP")) return "NAB VIP – Fontainebleau";
  return location.split(",")[0].trim();
}

export default function CompaniesView() {
  const companies = getCompanies();

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {companies.length} companies &middot; customer meetings only
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

          return (
            <div
              key={company.name}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-150"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {company.name}
                  </h3>
                </div>
                <div className="flex gap-1 shrink-0">
                  {company.isHold && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                      HOLD
                    </span>
                  )}
                  {dayLabels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meetings */}
              <div className="space-y-2">
                {company.meetings.map((meeting) => (
                  <div key={meeting.id} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{meeting.time}</span>
                      <span className="text-gray-300">&middot;</span>
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{simplifyLocation(meeting.location)}</span>
                    </div>

                    {meeting.internalAttendees.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meeting.internalAttendees.map((email) => (
                          <span
                            key={email}
                            className={clsx(
                              "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium",
                              "bg-blue-50 text-blue-700"
                            )}
                          >
                            {emailToName(email)}
                          </span>
                        ))}
                      </div>
                    )}

                    {meeting.externalAttendees.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meeting.externalAttendees.slice(0, 3).map((contact) => (
                          <span
                            key={contact}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                          >
                            {contact.includes("@") ? contact.split("@")[0] : contact}
                          </span>
                        ))}
                        {meeting.externalAttendees.length > 3 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            +{meeting.externalAttendees.length - 3} more
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
