"use client";

import { useState, useEffect } from "react";
import { meetings, Meeting } from "@/lib/data";
import { Clock, MapPin, CheckCircle2, Circle, Users } from "lucide-react";
import clsx from "clsx";

const DAYS = [
  { day: 19, label: "Sun Apr 19" },
  { day: 20, label: "Mon Apr 20" },
  { day: 21, label: "Tue Apr 21" },
  { day: 22, label: "Wed Apr 22" },
];

const BOOTH_LOCATIONS = [
  { key: "all", label: "All Locations" },
  { key: "NAB Booth 1", label: "NAB Booth 1" },
  { key: "NAB Booth 2", label: "NAB Booth 2" },
  { key: "Partner Theater", label: "Partner Theater" },
  { key: "Fontainebleau", label: "VIP / Fontainebleau" },
];

function getLocationCategory(location: string): string | null {
  if (location.includes("NAB Booth 1")) return "NAB Booth 1";
  if (location.includes("NAB Booth 2")) return "NAB Booth 2";
  if (location.includes("Partner Theater")) return "Partner Theater";
  if (location.includes("Fontainebleau") || location.includes("NAB VIP")) return "Fontainebleau";
  return null;
}

function emailToName(email: string): string {
  const local = email.split("@")[0];
  return local.split(".").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

function getContactName(contact: string): string {
  return contact.includes("@") ? emailToName(contact) : contact;
}

type CheckInState = Record<string, string[]>; // meetingId → checked-in contacts

export default function CheckInView() {
  const [selectedDay, setSelectedDay] = useState<number>(19);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [checkedIn, setCheckedIn] = useState<CheckInState>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nab-checkin-2026");
      if (saved) setCheckedIn(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleContact = (meetingId: string, contact: string) => {
    setCheckedIn((prev) => {
      const current = prev[meetingId] ?? [];
      const updated = current.includes(contact)
        ? current.filter((c) => c !== contact)
        : [...current, contact];
      const next = { ...prev, [meetingId]: updated };
      try {
        localStorage.setItem("nab-checkin-2026", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const filteredMeetings = meetings
    .filter((m) => {
      if (m.type !== "meeting" && m.type !== "partner") return false;
      if (m.day !== selectedDay) return false;
      const category = getLocationCategory(m.location);
      if (!category) return false;
      if (selectedLocation !== "all" && category !== selectedLocation) return false;
      return true;
    })
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  // Group by location when showing all, flat when filtered
  const grouped: { locationKey: string; label: string; items: Meeting[] }[] =
    selectedLocation === "all"
      ? BOOTH_LOCATIONS.filter((l) => l.key !== "all").map((loc) => ({
          locationKey: loc.key,
          label: loc.label,
          items: filteredMeetings.filter((m) => getLocationCategory(m.location) === loc.key),
        })).filter((g) => g.items.length > 0)
      : [
          {
            locationKey: selectedLocation,
            label: BOOTH_LOCATIONS.find((l) => l.key === selectedLocation)?.label ?? selectedLocation,
            items: filteredMeetings,
          },
        ];

  const totalMeetings = filteredMeetings.length;
  const totalCheckedIn = filteredMeetings.filter((m) => {
    const contacts = [...m.externalAttendees, ...m.internalAttendees];
    const checked = checkedIn[m.id] ?? [];
    return contacts.length > 0 && contacts.every((c) => checked.includes(c));
  }).length;

  return (
    <div className="space-y-5">
      {/* Day filter */}
      <div className="flex flex-wrap gap-2">
        {DAYS.map(({ day, label }) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150",
              selectedDay === day
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Location filter */}
      <div className="flex flex-wrap gap-2">
        {BOOTH_LOCATIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedLocation(key)}
            className={clsx(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
              selectedLocation === key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-medium text-gray-700">{totalMeetings}</span> meetings
        {totalCheckedIn > 0 && (
          <>
            <span className="text-gray-300">·</span>
            <span className="text-emerald-600 font-medium">{totalCheckedIn} fully checked in</span>
          </>
        )}
      </div>

      {/* Grouped meeting list */}
      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <MapPin className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-base font-medium">No meetings at this location</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ locationKey, label, items }) => (
            <div key={locationKey}>
              {selectedLocation === "all" && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{label}</h2>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">{items.length} meetings</span>
                </div>
              )}

              <div className="space-y-3">
                {items.map((meeting) => {
                  const checked = checkedIn[meeting.id] ?? [];
                  const allContacts = [...meeting.externalAttendees, ...meeting.internalAttendees];
                  const checkedCount = allContacts.filter((c) => checked.includes(c)).length;
                  const isComplete = allContacts.length > 0 && checkedCount === allContacts.length;

                  return (
                    <div
                      key={meeting.id}
                      className={clsx(
                        "rounded-xl border p-4 transition-all duration-200",
                        isComplete
                          ? "bg-emerald-50 border-emerald-200"
                          : meeting.type === "partner"
                          ? "bg-white border-teal-200"
                          : "bg-white border-blue-200"
                      )}
                    >
                      {/* Meeting header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 text-sm">{meeting.company}</h3>
                            {meeting.company.toUpperCase().includes("HOLD") && (
                              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-red-100 text-red-600">HOLD</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {meeting.time}
                            </span>
                            {selectedLocation === "all" && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {getLocationCategory(meeting.location)}
                              </span>
                            )}
                          </div>
                        </div>
                        {allContacts.length > 0 && (
                          <div
                            className={clsx(
                              "shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full",
                              isComplete
                                ? "bg-emerald-100 text-emerald-700"
                                : checkedCount > 0
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                            )}
                          >
                            {checkedCount}/{allContacts.length}
                          </div>
                        )}
                      </div>

                      {/* Attendee checklist */}
                      <div className="space-y-3">
                        {meeting.externalAttendees.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Guests</p>
                            <div className="space-y-1.5">
                              {meeting.externalAttendees.map((contact) => {
                                const isChecked = checked.includes(contact);
                                return (
                                  <button
                                    key={contact}
                                    onClick={() => toggleContact(meeting.id, contact)}
                                    className={clsx(
                                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left",
                                      isChecked
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    )}
                                  >
                                    {isChecked ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                                    )}
                                    <span className="font-medium">{getContactName(contact)}</span>
                                    {isChecked && <span className="ml-auto text-xs text-emerald-600">Arrived</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {meeting.internalAttendees.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                              <Users className="w-3 h-3" /> TwelveLabs
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {meeting.internalAttendees.map((email) => {
                                const isChecked = checked.includes(email);
                                return (
                                  <button
                                    key={email}
                                    onClick={() => toggleContact(meeting.id, email)}
                                    className={clsx(
                                      "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border transition-all duration-150",
                                      isChecked
                                        ? "bg-blue-100 text-blue-700 border-blue-200"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    )}
                                  >
                                    {isChecked ? (
                                      <CheckCircle2 className="w-3 h-3" />
                                    ) : (
                                      <Circle className="w-3 h-3 text-gray-300" />
                                    )}
                                    {emailToName(email)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
