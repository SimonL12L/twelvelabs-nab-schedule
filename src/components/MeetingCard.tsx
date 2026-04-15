"use client";

import { useState, useEffect, useRef } from "react";
import { Meeting, emailToName } from "@/lib/data";
import {
  Clock, MapPin, Users, Building2, Mic2, UtensilsCrossed,
  PartyPopper, Lock, Handshake, Theater,
  ChevronDown, FileText, Send, Trash2,
} from "lucide-react";
import clsx from "clsx";

const typeConfig: Record<Meeting["type"], { bg: string; border: string; badge: string; badgeText: string; icon: React.ElementType }> = {
  meeting: { bg: "bg-white", border: "border-blue-200", badge: "bg-blue-50 text-blue-700", badgeText: "Customer Meeting", icon: Building2 },
  partner: { bg: "bg-white", border: "border-teal-200", badge: "bg-teal-50 text-teal-700", badgeText: "Partner Meeting", icon: Handshake },
  theater: { bg: "bg-white", border: "border-orange-200", badge: "bg-orange-50 text-orange-700", badgeText: "Partner Theater", icon: Theater },
  panel: { bg: "bg-white", border: "border-violet-200", badge: "bg-violet-50 text-violet-700", badgeText: "Panel / Speaking", icon: Mic2 },
  dinner: { bg: "bg-white", border: "border-amber-200", badge: "bg-amber-50 text-amber-700", badgeText: "Customer Dinner", icon: UtensilsCrossed },
  event: { bg: "bg-white", border: "border-emerald-200", badge: "bg-emerald-50 text-emerald-700", badgeText: "Event", icon: PartyPopper },
  internal: { bg: "bg-gray-50", border: "border-gray-300", badge: "bg-gray-100 text-gray-600", badgeText: "Internal", icon: Lock },
};

const BRIEF_TYPES: Meeting["type"][] = ["meeting", "partner", "theater", "dinner"];

interface Comment {
  id: string;
  text: string;
  ts: number;
}

interface Notes {
  brief: string;
  comments: Comment[];
}

const EMPTY_NOTES: Notes = { brief: "", comments: [] };

function loadNotes(id: string): Notes {
  if (typeof window === "undefined") return EMPTY_NOTES;
  try {
    const raw = localStorage.getItem(`nab_notes_${id}`);
    return raw ? (JSON.parse(raw) as Notes) : EMPTY_NOTES;
  } catch {
    return EMPTY_NOTES;
  }
}

function persistNotes(id: string, notes: Notes) {
  try {
    localStorage.setItem(`nab_notes_${id}`, JSON.stringify(notes));
  } catch {}
}

export default function MeetingCard({ meeting, showDate }: { meeting: Meeting; showDate?: boolean }) {
  const config = typeConfig[meeting.type];
  const Icon = config.icon;
  const showBrief = BRIEF_TYPES.includes(meeting.type);

  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Notes>(EMPTY_NOTES);
  const [draft, setDraft] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setNotes(loadNotes(meeting.id));
  }, [meeting.id]);

  const hasBrief = notes.brief.trim().length > 0;
  const commentCount = notes.comments.length;

  function handleBriefChange(text: string) {
    const updated = { ...notes, brief: text };
    setNotes(updated);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persistNotes(meeting.id, updated), 500);
  }

  function submitComment() {
    const text = draft.trim();
    if (!text) return;
    const comment: Comment = { id: Date.now().toString(), text, ts: Date.now() };
    const updated = { ...notes, comments: [...notes.comments, comment] };
    setNotes(updated);
    persistNotes(meeting.id, updated);
    setDraft("");
  }

  function deleteComment(id: string) {
    const updated = { ...notes, comments: notes.comments.filter((c) => c.id !== id) };
    setNotes(updated);
    persistNotes(meeting.id, updated);
  }

  return (
    <div className={clsx("rounded-xl border-l-4 shadow-sm transition-shadow duration-200", config.bg, config.border, open ? "shadow-md" : "hover:shadow-md")}>
      {/* ── Card body ──────────────────────────────────────────────────────── */}
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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
            <h3 className="font-semibold text-gray-900 text-base leading-snug">{meeting.company}</h3>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {meeting.time}
            </div>
            {showDate && <div className="text-xs text-gray-500 mt-0.5">{meeting.date}</div>}
          </div>
        </div>

        {/* Location */}
        <div className="mt-3 flex items-start gap-1.5 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
          <span className="leading-tight">{meeting.location}</span>
        </div>

        {/* Attendees */}
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

        {/* Brief toggle */}
        {showBrief && (
          <button
            onClick={() => setOpen((v) => !v)}
            className={clsx(
              "mt-3 w-full flex items-center justify-between gap-2 text-xs font-medium px-3 py-2.5 rounded-lg transition-colors min-h-[40px]",
              open
                ? "bg-slate-100 text-slate-700"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 active:bg-slate-100"
            )}
          >
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Brief & Notes</span>
              {(hasBrief || commentCount > 0) && !open && (
                <span className="bg-blue-100 text-blue-600 text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
                  {commentCount > 0 ? `${commentCount} note${commentCount !== 1 ? "s" : ""}` : "has brief"}
                </span>
              )}
            </div>
            <ChevronDown className={clsx("w-3.5 h-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")} />
          </button>
        )}
      </div>

      {/* ── Expanded brief section ──────────────────────────────────────────── */}
      {showBrief && open && (
        <div className="border-t border-gray-100 px-4 pb-4 space-y-4">
          {/* Brief */}
          <div className="pt-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Meeting Brief
            </label>
            <textarea
              value={notes.brief}
              onChange={(e) => handleBriefChange(e.target.value)}
              placeholder="Add meeting context, goals, key talking points, customer background…"
              rows={5}
              className="w-full text-base sm:text-sm text-gray-800 placeholder-gray-300 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-colors leading-relaxed"
            />
            <p className="text-[11px] text-gray-300 mt-1">Saved locally on this device</p>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Notes
            </label>

            {notes.comments.length > 0 && (
              <div className="space-y-2 mb-3">
                {notes.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{c.text}</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {new Date(c.ts).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        {" · "}
                        {new Date(c.ts).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-gray-300 hover:text-red-400 active:text-red-500 transition-colors shrink-0 mt-0.5 p-1 -mr-1 rounded"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitComment();
                  }
                }}
                placeholder="Add a note…"
                className="flex-1 text-base sm:text-sm text-gray-800 placeholder-gray-300 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-colors"
              />
              <button
                onClick={submitComment}
                disabled={!draft.trim()}
                className="flex items-center justify-center w-11 h-11 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                aria-label="Add note"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
