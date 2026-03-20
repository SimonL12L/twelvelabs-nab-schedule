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
  day: number; // 19, 20, 21, 22
}

function parseList(raw: string): string[] {
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
  type: Meeting["type"];
}> = [
  // ── April 19 ──────────────────────────────────────────────────────────────
  {
    company: "NAB: Breakfast + Morning Meeting",
    internal: "",
    external: "",
    location: "Fontainebleau Las Vegas, 2777 S Las Vegas Blvd",
    date: "April 19, 2026",
    time: "8:00 AM",
    type: "event",
  },
  {
    company: "NAB Expo",
    internal: "",
    external: "",
    location: "Las Vegas Convention Center",
    date: "April 19, 2026",
    time: "10:00 AM",
    type: "event",
  },
  {
    company: "WBD (Mark Nakano)",
    internal:
      "danger@twelvelabs.io\njordan.woods@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
    external: "Mark Nakano",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026",
    time: "11:00 AM",
    type: "meeting",
  },
  {
    company: "Apple",
    internal:
      "ethan.heerwagen@twelvelabs.io\nsoyoung.lee@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external:
      "Tony Ha\nmjwood@apple.com\nbsines@apple.com\nDJ West\nGordy Gibson\nmiki_f@apple.com\nsvilbert@apple.com\nctaieb@apple.com\ndkiniry@apple.com\nmguzman@apple.com\nmnes@apple.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau Las Vegas",
    date: "April 19, 2026",
    time: "11:00 AM",
    type: "meeting",
  },
  {
    company: "MLS (HOLD)",
    internal:
      "brice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "Keith Agabob",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026",
    time: "12:00 PM",
    type: "meeting",
  },
  {
    company: "Disney",
    internal:
      "danger@twelvelabs.io\ndavid.morel@twelvelabs.io\njuddy.talt@twelvelabs.io",
    external: "Rosario Arbeleche\nKieren Portley",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026",
    time: "12:00 PM",
    type: "meeting",
  },
  {
    company: "ITN",
    internal:
      "dan.germain@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "Jon Roberts\nHannah Taylor",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026",
    time: "1:00 PM",
    type: "meeting",
  },
  {
    company: "South Park",
    internal:
      "ethan.heerwagen@twelvelabs.io\nallie.shelton@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "lydquid@mac.com\nbrucehowell2@me.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026",
    time: "2:00 PM",
    type: "meeting",
  },
  {
    company: "Vubiquity",
    internal:
      "danger@twelvelabs.io\nbobby.mohr@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "nfrink@vubiquity.com\njancheta-tilley@vubiquity.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026",
    time: "3:00 PM",
    type: "meeting",
  },
  {
    company: "CBS Case Study – M&E Stage",
    internal: "simon.lecointe@twelvelabs.io\ntravis.couture@twelvelabs.io",
    external: "",
    location: "M&E Stage, NAB Show",
    date: "April 19, 2026",
    time: "3:15 PM",
    type: "panel",
  },
  {
    company: "AWS Partner Stage Panel w/ Sardius",
    internal: "soyoung.lee@twelvelabs.io",
    external: "",
    location: "AWS Partner Stage, NAB Show",
    date: "April 19, 2026",
    time: "3:15 PM",
    type: "panel",
  },
  {
    company: "Reuters Imagen",
    internal: "allie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "Olivia Cianci",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026",
    time: "4:00 PM",
    type: "meeting",
  },
  {
    company: "TwelveLabs Happy Hour / Rodeo Launch",
    internal: "",
    external: "",
    location: "Las Vegas, NV",
    date: "April 19, 2026",
    time: "6:30 PM",
    type: "event",
  },
  // ── April 20 ──────────────────────────────────────────────────────────────
  {
    company: "NAB: Breakfast + Morning Meeting",
    internal: "",
    external: "",
    location: "Fontainebleau Las Vegas, 2777 S Las Vegas Blvd",
    date: "April 20, 2026",
    time: "7:45 AM",
    type: "event",
  },
  {
    company: "NAB Expo",
    internal: "",
    external: "",
    location: "Las Vegas Convention Center",
    date: "April 20, 2026",
    time: "9:00 AM",
    type: "event",
  },
  {
    company: "Qvest (Vanessa Fiola)",
    internal:
      "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "Vanessa Fiola",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026",
    time: "9:00 AM",
    type: "meeting",
  },
  {
    company: "CBS",
    internal:
      "ethan.heerwagen@twelvelabs.io\nbrice.penven@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "lhg@cbsnews.com\najg@cbsnews.com\ndaganr@cbsnews.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "9:00 AM",
    type: "meeting",
  },
  {
    company: "Graham Media",
    internal:
      "brice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "asimpson@grahammedia.com",
    location: "TwelveLabs Booth #W1923 – Demo Lounge",
    date: "April 20, 2026",
    time: "10:00 AM",
    type: "meeting",
  },
  {
    company: "Mr. Master",
    internal: "amie.araghi@twelvelabs.io",
    external: "Maria Laing",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "10:00 AM",
    type: "meeting",
  },
  {
    company: "Brandlive",
    internal: "amie.araghi@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "skhyle@brandlive.com\neli@brandlive.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "11:00 AM",
    type: "meeting",
  },
  {
    company: "Catapult (HOLD)",
    internal: "ethan.heerwagen@twelvelabs.io\nkc@twelvelabs.io",
    external: "",
    location: "TwelveLabs Event – NAB VIP, Fontainebleau / Demo Lounge",
    date: "April 20, 2026",
    time: "11:00 AM",
    type: "meeting",
  },
  {
    company: "The New York Times",
    internal: "allie.bernacchi@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "Abe Sater",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026",
    time: "11:00 AM",
    type: "meeting",
  },
  {
    company: "Sports Summit Stage Panel w/ Prime Sports",
    internal: "soyoung.lee@twelvelabs.io",
    external: "",
    location: "Sports Summit Stage, NAB Show",
    date: "April 20, 2026",
    time: "11:15 AM",
    type: "panel",
  },
  {
    company: "NFL",
    internal:
      "chad.rounsavall@twelvelabs.io\nethan.heerwagen@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026",
    time: "12:00 PM",
    type: "meeting",
  },
  {
    company: "ABC / Disney",
    internal:
      "dan.germain@twelvelabs.io\nsimon.lecointe@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "Mike Marzio\nNancy Berni\nJohn McNally",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "12:00 PM",
    type: "meeting",
  },
  {
    company: "Sinclair",
    internal: "ethan.heerwagen@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "eensign@sbgtv.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "1:00 PM",
    type: "meeting",
  },
  {
    company: "Qvest (Mike Rivera)",
    internal: "chad.rounsavall@twelvelabs.io",
    external: "Michael Rivera",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026",
    time: "2:00 PM",
    type: "meeting",
  },
  {
    company: "NBCU",
    internal: "soyoung.lee@twelvelabs.io\nethan.heerwagen@twelvelabs.io",
    external: "Matt Varney\nAntony Dickson",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026",
    time: "2:30 PM",
    type: "meeting",
  },
  {
    company: "Dalet",
    internal:
      "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nkc@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "",
    location: "TwelveLabs Event – NAB VIP, Fontainebleau",
    date: "April 20, 2026",
    time: "3:30 PM",
    type: "meeting",
  },
  {
    company: "Bernie Gershon VIP Exec Dinner",
    internal:
      "soyoung.lee@twelvelabs.io\nmaddi.santos@twelvelabs.io\nbobby.mohr@twelvelabs.io",
    external: "",
    location: "Las Vegas, NV",
    date: "April 20, 2026",
    time: "6:00 PM",
    type: "dinner",
  },
  {
    company: "Customer Dinner – Don's Prime",
    internal: "",
    external: "",
    location: "Don's Prime, Las Vegas",
    date: "April 20, 2026",
    time: "7:00 PM",
    type: "dinner",
  },
  {
    company: "Customer Dinner – Mother Wolf",
    internal: "",
    external: "",
    location: "Mother Wolf, Las Vegas",
    date: "April 20, 2026",
    time: "7:00 PM",
    type: "dinner",
  },
  {
    company: "Customer Dinner – Nobu",
    internal: "",
    external: "",
    location: "Nobu, Las Vegas",
    date: "April 20, 2026",
    time: "7:00 PM",
    type: "dinner",
  },
  // ── April 21 ──────────────────────────────────────────────────────────────
  {
    company: "NAB: Breakfast + Morning Meeting",
    internal: "",
    external: "",
    location: "Fontainebleau Las Vegas, 2777 S Las Vegas Blvd",
    date: "April 21, 2026",
    time: "7:45 AM",
    type: "event",
  },
  {
    company: "NAB Expo",
    internal: "",
    external: "",
    location: "Las Vegas Convention Center",
    date: "April 21, 2026",
    time: "9:00 AM",
    type: "event",
  },
  {
    company: "Riot Games",
    internal: "danger@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "jschoen@riotgames.com\nKendall Ginsbach",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026",
    time: "10:00 AM",
    type: "meeting",
  },
  {
    company: "Protege – M&E Stage Case Study",
    internal: "jae@twelvelabs.io\nsoyoung.lee@twelvelabs.io",
    external: "",
    location: "M&E Stage, NAB Show",
    date: "April 21, 2026",
    time: "11:15 AM",
    type: "panel",
  },
  {
    company: "Fremantle / AWS (HOLD)",
    internal:
      "dan.germain@twelvelabs.io\njuddy.talt@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "jhummzn@amazon.co.uk",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026",
    time: "2:00 PM",
    type: "meeting",
  },
  {
    company: "Sardius",
    internal:
      "jae@twelvelabs.io\ndanger@twelvelabs.io\nbrice.penven@twelvelabs.io",
    external: "mari@sardius.media\nAri Burt\nJason Shore",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026",
    time: "3:00 PM",
    type: "meeting",
  },
  {
    company: "AWS / Presidio Exec Happy Hour",
    internal: "emily.kurze@twelvelabs.io",
    external: "",
    location: "The Library @ Marquee Nightclub, 3708 Las Vegas Blvd S",
    date: "April 21, 2026",
    time: "6:00 PM",
    type: "event",
  },
  {
    company: "Customer Dinner – Komodo",
    internal: "",
    external: "",
    location: "Komodo, Las Vegas",
    date: "April 21, 2026",
    time: "7:00 PM",
    type: "dinner",
  },
  {
    company: "Customer Dinner – Carbone Riviera",
    internal: "",
    external: "",
    location: "Carbone Riviera, Las Vegas",
    date: "April 21, 2026",
    time: "7:00 PM",
    type: "dinner",
  },
  {
    company: "Customer Dinner – Cote",
    internal: "",
    external: "",
    location: "Cote, Las Vegas",
    date: "April 21, 2026",
    time: "7:00 PM",
    type: "dinner",
  },
  // ── April 22 ──────────────────────────────────────────────────────────────
  {
    company: "NAB: Breakfast + Morning Meeting",
    internal: "",
    external: "",
    location: "Fontainebleau Las Vegas, 2777 S Las Vegas Blvd",
    date: "April 22, 2026",
    time: "7:45 AM",
    type: "event",
  },
  {
    company: "NAB Expo",
    internal: "",
    external: "",
    location: "Las Vegas Convention Center",
    date: "April 22, 2026",
    time: "9:00 AM",
    type: "event",
  },
];

export const meetings: Meeting[] = rawMeetings.map((m, i) => ({
  id: `mtg-${i}`,
  company: m.company,
  internalAttendees: parseList(m.internal),
  externalAttendees: parseList(m.external),
  location: m.location,
  date: m.date,
  time: m.time,
  isoDate: toIso(m.date, m.time),
  type: m.type,
  day: getDay(m.date),
}));

export const days = [
  { day: 19, label: "Sun, April 19", shortLabel: "Apr 19" },
  { day: 20, label: "Mon, April 20", shortLabel: "Apr 20" },
  { day: 21, label: "Tue, April 21", shortLabel: "Apr 21" },
  { day: 22, label: "Wed, April 22", shortLabel: "Apr 22" },
];

export function getLocations(): string[] {
  const locs = new Set(meetings.map((m) => m.location));
  return Array.from(locs).sort();
}

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

function normalizeCompanyName(company: string): string {
  return company
    .replace(/\s*\(HOLD\)/gi, "")
    .replace(/\s*\([^)]+\)/, "")
    .trim();
}

export interface Company {
  name: string;
  meetings: Meeting[];
  isHold: boolean;
}

export function getCompanies(): Company[] {
  const customerMeetings = meetings.filter((m) => m.type === "meeting");
  const map = new Map<string, { meetings: Meeting[]; isHold: boolean }>();

  for (const meeting of customerMeetings) {
    const name = normalizeCompanyName(meeting.company);
    if (!map.has(name)) {
      map.set(name, { meetings: [], isHold: false });
    }
    const entry = map.get(name)!;
    entry.meetings.push(meeting);
    if (meeting.company.toUpperCase().includes("HOLD")) {
      entry.isHold = true;
    }
  }

  return Array.from(map.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

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
