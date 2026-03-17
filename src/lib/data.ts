export interface Meeting {
  id: string;
  company: string;
  internalAttendees: string[];
  externalAttendees: string[];
  location: string;
  date: string; // "April 19, 2026" etc.
  time: string; // "1:00 PM" etc.
  isoDate: string; // for sorting
  type: "meeting" | "panel" | "dinner" | "event";
  day: number; // 19, 20, 21
}

function classifyMeeting(company: string, location: string): Meeting["type"] {
  const c = company.toLowerCase();
  const l = location.toLowerCase();
  if (c.includes("dinner") || l.includes("dinner")) return "dinner";
  if (c.includes("panel") || c.includes("stage") || c.includes("case study")) return "panel";
  if (c.includes("happy hour") || c.includes("launch") || c.includes("vip")) return "event";
  return "meeting";
}

function parseEmails(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(/[\n,]+/)
    .map((e) => e.trim())
    .filter(Boolean);
}

function getDay(date: string): number {
  const match = date.match(/April\s+(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function toIso(date: string, time: string): string {
  const day = getDay(date);
  const [_, h, m, ampm] = time.match(/(\d+):(\d+)\s*(AM|PM)/) || [];
  let hour = parseInt(h);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return `2026-04-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${m}:00`;
}

const rawMeetings: Array<{
  company: string;
  internal: string;
  external: string;
  location: string;
  date: string;
  time: string;
}> = [
  {
    company: "ITN",
    internal: "dan.germain@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "jon.roberts@itn.co.uk\nhannah.taylor@itn.co.uk",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026",
    time: "1:00 PM",
  },
  {
    company: "South Park",
    internal: "ethan.heerwagen@twelvelabs.io\nallie.shelton@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "lydquid@mac.com\nbrucehowell2@me.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026",
    time: "2:00 PM",
  },
  {
    company: "CBS (M&E Stage Case Study)",
    internal: "simon.lecointe@twelvelabs.io\ntravis@twelvelabs.io",
    external: "",
    location: "M&E Stage, NAB Show",
    date: "April 19, 2026",
    time: "3:15 PM",
  },
  {
    company: "Sardius (AWS Partner Stage Panel)",
    internal: "soyoung@twelvelabs.io",
    external: "",
    location: "AWS Partner Stage, NAB Show",
    date: "April 19, 2026",
    time: "3:15 PM",
  },
  {
    company: "NAB TwelveLabs Happy Hour / Rodeo Launch",
    internal: "",
    external: "",
    location: "Las Vegas, NV",
    date: "April 19, 2026",
    time: "6:30 PM",
  },
  {
    company: "CBS",
    internal: "ethan.heerwagen@twelvelabs.io\nbrice.penven@twelvelabs.io\nsimon@twelvelabs.io",
    external: "lhg@cbsnews.com\najg@cbsnews.com\ndaganr@cbsnews.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "9:00 AM",
  },
  {
    company: "Graham Media",
    internal: "brice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "asimpson@grahammedia.com",
    location: "TwelveLabs Booth #W1923 – Demo Lounge",
    date: "April 20, 2026",
    time: "10:00 AM",
  },
  {
    company: "Mr. Master",
    internal: "amie.araghi@twelvelabs.io",
    external: "marialaing@mrmaster.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "10:00 AM",
  },
  {
    company: "Brandlive",
    internal: "amie.araghi@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "skhyle@brandlive.com\neli@brandlive.com",
    location: "NAB West Hall Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "11:00 AM",
  },
  {
    company: "Prime Sports (Sports Summit Stage Panel)",
    internal: "soyoung@twelvelabs.io",
    external: "",
    location: "Sports Summit Stage, NAB Show",
    date: "April 20, 2026",
    time: "11:15 AM",
  },
  {
    company: "NFL",
    internal: "chad.rounsavall@twelvelabs.io\nethan.heerwagen@twelvelabs.io\nsimon@twelvelabs.io",
    external: "",
    location: "NAB West Hall Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026",
    time: "12:00 PM",
  },
  {
    company: "ABC / Disney",
    internal: "dan.germain@twelvelabs.io\nsimon@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "mike.b.marzio@disney.com\nnancy.berni@disney.com\njohn.d.mcnally@abc.com",
    location: "NAB West Hall Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "12:00 PM",
  },
  {
    company: "Dalet",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io",
    external: "",
    location: "TwelveLabs Event – NAB VIP, Fontainebleau",
    date: "April 20, 2026",
    time: "3:30 PM",
  },
  {
    company: "Bernie Gershon VIP Exec Dinner",
    internal: "soyoung@twelvelabs.io\nmaddi.santos@twelvelabs.io\nbobby@twelvelabs.io",
    external: "",
    location: "Las Vegas, NV",
    date: "April 20, 2026",
    time: "6:00 PM",
  },
  {
    company: "Customer Dinner – Don's Prime",
    internal: "",
    external: "",
    location: "Don's Prime, Las Vegas",
    date: "April 20, 2026",
    time: "7:00 PM",
  },
  {
    company: "Customer Dinner – Mother Wolf",
    internal: "",
    external: "",
    location: "Mother Wolf, Las Vegas",
    date: "April 20, 2026",
    time: "7:00 PM",
  },
  {
    company: "Customer Dinner – Nobu",
    internal: "",
    external: "",
    location: "Nobu, Las Vegas",
    date: "April 20, 2026",
    time: "7:00 PM",
  },
  {
    company: "Protege (M&E Stage Case Study)",
    internal: "jae@twelvelabs.io\nsoyoung@twelvelabs.io",
    external: "",
    location: "M&E Stage, NAB Show",
    date: "April 21, 2026",
    time: "11:15 AM",
  },
  {
    company: "Fremantle / AWS (HOLD)",
    internal: "dan.germain@twelvelabs.io\njuddy.talt@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "jhummzn@amazon.co.uk",
    location: "NAB West Hall Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026",
    time: "2:00 PM",
  },
  {
    company: "AWS / Presidio Exec Happy Hour (Co-Sponsoring)",
    internal: "emily.kurze@twelvelabs.io",
    external: "",
    location: "The Library @ Marquee Nightclub, 3708 Las Vegas Blvd S, Las Vegas, NV 89109",
    date: "April 21, 2026",
    time: "6:00 PM",
  },
  {
    company: "Customer Dinner – Komodo",
    internal: "",
    external: "",
    location: "Komodo, Las Vegas",
    date: "April 21, 2026",
    time: "7:00 PM",
  },
  {
    company: "Customer Dinner – Carbone Riviera",
    internal: "",
    external: "",
    location: "Carbone Riviera, Las Vegas",
    date: "April 21, 2026",
    time: "7:00 PM",
  },
  {
    company: "Customer Dinner – Cote",
    internal: "",
    external: "",
    location: "Cote, Las Vegas",
    date: "April 21, 2026",
    time: "7:00 PM",
  },
];

export const meetings: Meeting[] = rawMeetings.map((m, i) => ({
  id: `mtg-${i}`,
  company: m.company,
  internalAttendees: parseEmails(m.internal),
  externalAttendees: parseEmails(m.external),
  location: m.location,
  date: m.date,
  time: m.time,
  isoDate: toIso(m.date, m.time),
  type: classifyMeeting(m.company, m.location),
  day: getDay(m.date),
}));

// Unique days
export const days = [
  { day: 19, label: "Sat, April 19", shortLabel: "Apr 19" },
  { day: 20, label: "Sun, April 20", shortLabel: "Apr 20" },
  { day: 21, label: "Mon, April 21", shortLabel: "Apr 21" },
];

// Unique locations (simplified)
export function getLocations(): string[] {
  const locs = new Set(meetings.map((m) => m.location));
  return Array.from(locs).sort();
}

// Unique internal people
export function getPeople(): { email: string; name: string }[] {
  const emails = new Set<string>();
  meetings.forEach((m) => m.internalAttendees.forEach((e) => emails.add(e)));
  return Array.from(emails)
    .sort()
    .map((email) => {
      const local = email.split("@")[0];
      const parts = local.split(".");
      const name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
      return { email, name };
    });
}

// Group meetings
export function getMeetingsByDay(day: number): Meeting[] {
  return meetings.filter((m) => m.day === day).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

export function getMeetingsByPerson(email: string): Meeting[] {
  return meetings
    .filter((m) => m.internalAttendees.includes(email))
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

export function getMeetingsByLocation(location: string): Meeting[] {
  return meetings
    .filter((m) => m.location === location)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}
