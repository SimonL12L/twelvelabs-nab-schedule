"use client";

import { MeetingType } from "@/lib/data";
import clsx from "clsx";

type FilterOption = {
  value: MeetingType | "all";
  label: string;
  active: string;
  dot: string;
};

const options: FilterOption[] = [
  { value: "all", label: "All", active: "bg-slate-800 text-white border-slate-800", dot: "bg-slate-400" },
  { value: "meeting", label: "Customer Meetings", active: "bg-blue-600 text-white border-blue-600", dot: "bg-blue-400" },
  { value: "partner", label: "Partner Meetings", active: "bg-teal-600 text-white border-teal-600", dot: "bg-teal-400" },
  { value: "theater", label: "Partner Theater", active: "bg-orange-500 text-white border-orange-500", dot: "bg-orange-400" },
  { value: "panel", label: "Panels & Speaking", active: "bg-violet-600 text-white border-violet-600", dot: "bg-violet-400" },
  { value: "dinner", label: "Dinners", active: "bg-amber-500 text-white border-amber-500", dot: "bg-amber-400" },
  { value: "event", label: "Events", active: "bg-emerald-600 text-white border-emerald-600", dot: "bg-emerald-400" },
  { value: "internal", label: "Internal", active: "bg-gray-500 text-white border-gray-500", dot: "bg-gray-400" },
];

export default function FilterBar({
  active,
  onChange,
  counts,
}: {
  active: MeetingType | "all";
  onChange: (v: MeetingType | "all") => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mr-1">Filter</span>
      {options.map(({ value, label, active: activeClass, dot }) => {
        const count = value === "all" ? counts.__total : counts[value];
        const isActive = active === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={clsx(
              "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150",
              isActive
                ? activeClass
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {!isActive && <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dot)} />}
            {label}
            {count !== undefined && (
              <span
                className={clsx(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
