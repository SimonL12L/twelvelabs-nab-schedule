export type MeetingType = "meeting" | "panel" | "dinner" | "event" | "internal";

export interface Meeting {
  id: string;
  company: string;
  internalAttendees: string[];
  externalAttendees: string[];
  location: string;
  date: string;
  time: string;
  isoDate: string;
  type: MeetingType;
  day: number;
}

function parseList(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  return raw.split(/[\n,]+/).map((e) => e.trim()).filter(Boolean);
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

// Parse "First Last <email>" → display name; plain email → email string
function parseContact(raw: string): string {
  const match = raw.match(/^(.+?)\s*<[^>]+>$/);
  return match ? match[1].trim() : raw.trim();
}

const rawMeetings: Array<{
  company: string;
  internal: string;
  external: string;
  location: string;
  date: string;
  time: string;
  type: MeetingType;
}> = [
  // ── April 19 ──────────────────────────────────────────────────────────────
  {
    company: "NAB: Breakfast + Morning Meeting",
    internal: "", external: "",
    location: "Fontainebleau Las Vegas, 2777 S Las Vegas Blvd",
    date: "April 19, 2026", time: "8:00 AM", type: "event",
  },
  {
    company: "NAB Expo",
    internal: "", external: "",
    location: "Las Vegas Convention Center",
    date: "April 19, 2026", time: "10:00 AM", type: "event",
  },
  {
    company: "WBD (Mark Nakano)",
    internal: "danger@twelvelabs.io\njordan.woods@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
    external: "mark.nakano@wbd.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "EIKON Group",
    internal: "amie.araghi@twelvelabs.io\nbrice.penven@twelvelabs.io",
    external: "piers.godden@eikon.group",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 19, 2026", time: "11:00 AM", type: "panel",
  },
  {
    company: "Lunch at Fontainebleau",
    internal: "", external: "",
    location: "NAB VIP – Fontainebleau",
    date: "April 19, 2026", time: "11:30 AM", type: "event",
  },
  {
    company: "MLS (HOLD)",
    internal: "brice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io\njesse.white@twelvelabs.io",
    external: "keith.agabob@mlssoccer.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "Disney",
    internal: "danger@twelvelabs.io\ndavid.morel@twelvelabs.io\njuddy.talt@twelvelabs.io",
    external: "rosario.arbeleche@disney.com\nkieren.portley@disney.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "Monks",
    internal: "john.reigart@twelvelabs.io\ndanny@twelvelabs.io\nbrice.penven@twelvelabs.io",
    external: "brian.tagami@monks.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "ITN",
    internal: "dan.germain@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "jon.roberts@itn.co.uk\nhannah.taylor@itn.co.uk",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "South Park",
    internal: "ethan.heerwagen@twelvelabs.io\nallie.shelton@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "lydquid@mac.com\nbrucehowell2@me.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "2:00 PM", type: "meeting",
  },
  {
    company: "TrackIt",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "chris@trackit.io\nchris.koh@trackit.io\nbrad@trackit.io",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 19, 2026", time: "2:00 PM", type: "panel",
  },
  {
    company: "Vubiquity",
    internal: "danger@twelvelabs.io\nbobby@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "nfrink@vubiquity.com\njancheta-tilley@vubiquity.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "3:00 PM", type: "meeting",
  },
  {
    company: "AWS (Michael Dinwoodie)",
    internal: "allie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "",
    location: "AWS Booth",
    date: "April 19, 2026", time: "3:00 PM", type: "meeting",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 19, 2026", time: "3:00 PM", type: "panel",
  },
  {
    company: "M&E Stage – Soyoung Speaking",
    internal: "soyoung@twelvelabs.io\nyoon.kim@twelvelabs.io\nmaninder@twelvelabs.io",
    external: "",
    location: "M&E Stage, NAB Show",
    date: "April 19, 2026", time: "3:15 PM", type: "panel",
  },
  {
    company: "AWS Partner Stage Panel w/ Sardius (Jae)",
    internal: "jae@twelvelabs.io\nyoon.kim@twelvelabs.io\nmaninder@twelvelabs.io",
    external: "",
    location: "AWS Partner Stage, NAB Show",
    date: "April 19, 2026", time: "3:15 PM", type: "panel",
  },
  {
    company: "Reuters Imagen",
    internal: "allie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "olivia.cianci@thomsonreuters.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "Imagine Consulting",
    internal: "yoon.kim@twelvelabs.io\nrobert.mohr@twelvelabs.io",
    external: "jin@imaizumi.net",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 19, 2026", time: "4:30 PM", type: "meeting",
  },
  {
    company: "TwelveLabs Happy Hour / Rodeo Launch",
    internal: "", external: "",
    location: "Las Vegas, NV",
    date: "April 19, 2026", time: "6:30 PM", type: "event",
  },
  // ── April 20 ──────────────────────────────────────────────────────────────
  {
    company: "NAB: Breakfast + Morning Meeting",
    internal: "", external: "",
    location: "Fontainebleau Las Vegas, 2777 S Las Vegas Blvd",
    date: "April 20, 2026", time: "7:45 AM", type: "event",
  },
  {
    company: "NAB Expo",
    internal: "", external: "",
    location: "Las Vegas Convention Center",
    date: "April 20, 2026", time: "9:00 AM", type: "event",
  },
  {
    company: "Qvest (Vanessa Fiola)",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "Vanessa Fiola <vanessa@qvest.com>\navery.pfeiffer@qvest.com\nfares.birke@qvest.com\nNico Bayless-Opipari <nico@qvest.com>",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "9:00 AM", type: "meeting",
  },
  {
    company: "CBS",
    internal: "ethan.heerwagen@twelvelabs.io\nbrice.penven@twelvelabs.io\nsimon@twelvelabs.io",
    external: "lhg@cbsnews.com\najg@cbsnews.com\ndaganr@cbsnews.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "9:00 AM", type: "meeting",
  },
  {
    company: "Graham Media",
    internal: "brice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "asimpson@grahammedia.com",
    location: "TwelveLabs Booth #W1923 – Demo Lounge",
    date: "April 20, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Mr. Master",
    internal: "amie.araghi@twelvelabs.io",
    external: "marialaing@mrmaster.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Sky",
    internal: "ethan.heerwagen@twelvelabs.io\nyoon.kim@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nrobert.mohr@twelvelabs.io\nsimon.lecointe@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "tania.crecco@sky.uk",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Brandlive",
    internal: "amie.araghi@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "skhyle@brandlive.com\neli@brandlive.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "Catapult",
    internal: "ethan.heerwagen@twelvelabs.io\nkc@twelvelabs.io",
    external: "dave.wilson@catapult.com\nlee.cadman@catapult.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "Vidispine",
    internal: "john.reigart@twelvelabs.io\nemily.kurze@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nbrice.penven@twelvelabs.io\nbelinda.merritt@twelvelabs.io\nchad.rounsavall@twelvelabs.io\njesse.white@twelvelabs.io",
    external: "annika.kimpel@vidispine.com\nexhibition@vidispine.com\nkarsten.schragmann@vidispine.com",
    location: "Vidispine Booth #W1643",
    date: "April 20, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "The New York Times",
    internal: "allie.bernacchi@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "Abe Sater <abraham.sater@nytimes.com>",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "Sports Summit Stage Panel w/ Scoreplay (Soyoung)",
    internal: "soyoung@twelvelabs.io\njae@twelvelabs.io\nmaninder@twelvelabs.io\nyoon.kim@twelvelabs.io",
    external: "",
    location: "Sports Summit Stage, NAB Show",
    date: "April 20, 2026", time: "11:15 AM", type: "panel",
  },
  {
    company: "Lunch at Fontainebleau",
    internal: "", external: "",
    location: "NAB VIP – Fontainebleau",
    date: "April 20, 2026", time: "11:30 AM", type: "event",
  },
  {
    company: "NFL Films",
    internal: "chad.rounsavall@twelvelabs.io\nethan.heerwagen@twelvelabs.io\nsimon@twelvelabs.io\njesse.white@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "ABC / Disney",
    internal: "dan.germain@twelvelabs.io\nsimon@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "mike.b.marzio@disney.com\nnancy.berni@disney.com\njohn.d.mcnally@abc.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "12:00 PM", type: "panel",
  },
  {
    company: "SnapStream",
    internal: "amie.araghi@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "daniel@snapstream.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Sinclair",
    internal: "ethan.heerwagen@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nsoyoung@twelvelabs.io",
    external: "eensign@sbgtv.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Backblaze Booth – Jordan Speaking",
    internal: "emily.kurze@twelvelabs.io\njordan.woods@twelvelabs.io\nbelinda.merritt@twelvelabs.io\nmaninder@twelvelabs.io",
    external: "",
    location: "Backblaze Booth, NAB Show",
    date: "April 20, 2026", time: "1:00 PM", type: "panel",
  },
  {
    company: "TrackIt",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "chris@trackit.io\nchris.koh@trackit.io\nbrad@trackit.io",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "1:00 PM", type: "panel",
  },
  {
    company: "Lionsgate",
    internal: "soyoung@twelvelabs.io\nbrice.penven@twelvelabs.io\njuddy.talt@twelvelabs.io",
    external: "drevkin@lionsgate.com\njportnoy@lionsgate.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "1:45 PM", type: "meeting",
  },
  {
    company: "Quickplay",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "sean.lynch@quickplay.com\naj.joiner@quickplay.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "2:00 PM", type: "panel",
  },
  {
    company: "AWS + FOX",
    internal: "chad.rounsavall@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
    external: "",
    location: "Meeting Room 4, AWS Booth #W1701",
    date: "April 20, 2026", time: "2:00 PM", type: "meeting",
  },
  {
    company: "NBCU",
    internal: "soyoung@twelvelabs.io\nethan.heerwagen@twelvelabs.io",
    external: "matt.varney@nbcuni.com\nantony.dickson@nbcuni.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "2:30 PM", type: "meeting",
  },
  {
    company: "NASCAR",
    internal: "jae@twelvelabs.io\ndanger@twelvelabs.io\ndavid.morel@twelvelabs.io\njesse.white@twelvelabs.io",
    external: "pcarroll@nascar.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "3:00 PM", type: "meeting",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "3:00 PM", type: "panel",
  },
  {
    company: "Apple",
    internal: "ethan.heerwagen@twelvelabs.io\nsoyoung@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "tony_ha@apple.com\nmjwood@apple.com\nbsines@apple.com\ndj_west@apple.com\ngordy_gibson@apple.com\nmiki_f@apple.com\nsvilbert@apple.com\nctaieb@apple.com\ndkiniry@apple.com\nmguzman@apple.com\nmnes@apple.com\njeremy.smith@apple.com\nsbottoms@apple.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 20, 2026", time: "3:30 PM", type: "meeting",
  },
  {
    company: "Dalet",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nkc@twelvelabs.io\nbrice.penven@twelvelabs.io",
    external: "",
    location: "Dalet Booth #W1519",
    date: "April 20, 2026", time: "3:30 PM", type: "meeting",
  },
  {
    company: "Qvest (Mike Rivera)",
    internal: "chad.rounsavall@twelvelabs.io",
    external: "michael.rivera@qvest.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "Arrk Media",
    internal: "dan.germain@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "phil.hodgetts@arrkmedia.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "NBA",
    internal: "ethan.heerwagen@twelvelabs.io\njesse.white@twelvelabs.io\nadrienne@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "vcerejo@nba.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "4:30 PM", type: "meeting",
  },
  {
    company: "Bi-Weekly APAC Pipeline Review",
    internal: "soyoung@twelvelabs.io\ndongwoon.song@twelvelabs.io\ndave@twelvelabs.io\njennifer.lee@twelvelabs.io\ntravis@twelvelabs.io\nhyemin.lee@twelvelabs.io\nmaninder@twelvelabs.io\nbongmu.lee@twelvelabs.io\nandy.sohn@twelvelabs.io\nminwoo.lee@twelvelabs.io\ndanny@twelvelabs.io\nrobert.mohr@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "",
    location: "",
    date: "April 20, 2026", time: "4:00 PM", type: "internal",
  },
  {
    company: "Bernie Gershon VIP Exec Dinner",
    internal: "soyoung@twelvelabs.io\nmaddi.santos@twelvelabs.io\nbobby@twelvelabs.io",
    external: "",
    location: "Las Vegas, NV",
    date: "April 20, 2026", time: "6:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Don's Prime",
    internal: "", external: "",
    location: "Don's Prime, Las Vegas",
    date: "April 20, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Mother Wolf",
    internal: "", external: "",
    location: "Mother Wolf, Las Vegas",
    date: "April 20, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Nobu",
    internal: "", external: "",
    location: "Nobu, Las Vegas",
    date: "April 20, 2026", time: "7:00 PM", type: "dinner",
  },
  // ── April 21 ──────────────────────────────────────────────────────────────
  {
    company: "NAB: Breakfast + Morning Meeting",
    internal: "", external: "",
    location: "Fontainebleau Las Vegas, 2777 S Las Vegas Blvd",
    date: "April 21, 2026", time: "7:45 AM", type: "event",
  },
  {
    company: "NAB Expo",
    internal: "", external: "",
    location: "Las Vegas Convention Center",
    date: "April 21, 2026", time: "9:00 AM", type: "event",
  },
  {
    company: "Riot Games",
    internal: "danger@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "jschoen@riotgames.com\nkendall.ginsbach@riotgames.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Hexaglobe",
    internal: "amie.araghi@twelvelabs.io\njordan.woods@twelvelabs.io",
    external: "Pierre-Alexandre Entraygues <paentraygues@hexaglobe.com>",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Quickplay",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "sean.lynch@quickplay.com\naj.joiner@quickplay.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "10:00 AM", type: "panel",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "11:00 AM", type: "panel",
  },
  {
    company: "Protege – M&E Stage Case Study (Soyoung)",
    internal: "jae@twelvelabs.io\nsoyoung@twelvelabs.io\nmaninder@twelvelabs.io\nyoon.kim@twelvelabs.io",
    external: "",
    location: "M&E Stage, NAB Show",
    date: "April 21, 2026", time: "11:15 AM", type: "panel",
  },
  {
    company: "Lunch at Fontainebleau",
    internal: "", external: "",
    location: "NAB VIP – Fontainebleau",
    date: "April 21, 2026", time: "11:30 AM", type: "event",
  },
  {
    company: "MEDIAGENIX",
    internal: "amie.araghi@twelvelabs.io\nbrice.penven@twelvelabs.io",
    external: "emmanuel.muller@mediagenix.tv\nivan.verbesselt@mediagenix.tv",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Banijay",
    internal: "dan.germain@twelvelabs.io\njuddy.talt@twelvelabs.io\nyoon.kim@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "donna.mulvey-jones@banijayuk.com\ngraysonm@amazon.co.uk",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Fremantle / AWS (HOLD)",
    internal: "dan.germain@twelvelabs.io\njuddy.talt@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "jhummzn@amazon.co.uk",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "2:00 PM", type: "meeting",
  },
  {
    company: "MUX (HOLD)",
    internal: "amie.araghi@twelvelabs.io\njohn.reigart@twelvelabs.io",
    external: "lhedden@mux.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "2:00 PM", type: "meeting",
  },
  {
    company: "AWS + Versant",
    internal: "soyoung@twelvelabs.io\nethan.heerwagen@twelvelabs.io",
    external: "",
    location: "Meeting Room 4, AWS Booth #W1701",
    date: "April 21, 2026", time: "2:30 PM", type: "meeting",
  },
  {
    company: "Sardius",
    internal: "jae@twelvelabs.io\ndanger@twelvelabs.io\nbrice.penven@twelvelabs.io",
    external: "mari@sardius.media\nAri Burt <ari@sardius.media>\nJason Shore <jason@sardius.media>",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "3:00 PM", type: "meeting",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "3:00 PM", type: "panel",
  },
  {
    company: "Lionsgate (Drinks)",
    internal: "soyoung@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "",
    location: "The Vault at Bellagio",
    date: "April 21, 2026", time: "5:00 PM", type: "meeting",
  },
  {
    company: "AWS / Presidio Exec Happy Hour",
    internal: "emily.kurze@twelvelabs.io",
    external: "",
    location: "The Library @ Marquee Nightclub, 3708 Las Vegas Blvd S",
    date: "April 21, 2026", time: "6:00 PM", type: "event",
  },
  {
    company: "Customer Dinner – Komodo",
    internal: "", external: "",
    location: "Komodo, Las Vegas",
    date: "April 21, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Carbone Riviera",
    internal: "", external: "",
    location: "Carbone Riviera, Las Vegas",
    date: "April 21, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Cote",
    internal: "", external: "",
    location: "Cote, Las Vegas",
    date: "April 21, 2026", time: "7:00 PM", type: "dinner",
  },
  // ── April 22 ──────────────────────────────────────────────────────────────
  {
    company: "NAB: Breakfast + Morning Meeting",
    internal: "", external: "",
    location: "Fontainebleau Las Vegas, 2777 S Las Vegas Blvd",
    date: "April 22, 2026", time: "7:45 AM", type: "event",
  },
  {
    company: "NAB Expo",
    internal: "", external: "",
    location: "Las Vegas Convention Center",
    date: "April 22, 2026", time: "9:00 AM", type: "event",
  },
  {
    company: "Lunch at Fontainebleau",
    internal: "", external: "",
    location: "NAB VIP – Fontainebleau",
    date: "April 22, 2026", time: "11:30 AM", type: "event",
  },
  {
    company: "Qibb",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nbelinda.merritt@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "scott.goldman@qibb.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 22, 2026", time: "11:30 AM", type: "meeting",
  },
];

export const meetings: Meeting[] = rawMeetings.map((m, i) => ({
  id: `mtg-${i}`,
  company: m.company,
  internalAttendees: parseList(m.internal),
  externalAttendees: parseList(m.external).map(parseContact),
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

export function filterMeetings(list: Meeting[], filter: MeetingType | "all"): Meeting[] {
  if (filter === "all") return list;
  return list.filter((m) => m.type === filter);
}

export function getLocations(filter: MeetingType | "all" = "all"): string[] {
  const filtered = filterMeetings(meetings, filter);
  const locs = new Set(filtered.filter((m) => m.location).map((m) => m.location));
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
    .replace(/\s*\(Drinks\)/gi, "")
    .replace(/\s*\([^)]+\)/, "")
    .trim();
}

export interface Company {
  name: string;
  meetings: Meeting[];
  isHold: boolean;
}

export function getCompanies(filter: MeetingType | "all" = "all"): Company[] {
  // For companies tab: include meetings + panels; exclude internal, event, dinner
  const relevantTypes: MeetingType[] =
    filter === "all"
      ? ["meeting", "panel"]
      : ["dinner", "event", "internal"].includes(filter)
      ? []
      : [filter as MeetingType];

  const relevant = meetings.filter((m) => relevantTypes.includes(m.type));
  const map = new Map<string, { meetings: Meeting[]; isHold: boolean }>();

  for (const meeting of relevant) {
    const name = normalizeCompanyName(meeting.company);
    if (!map.has(name)) map.set(name, { meetings: [], isHold: false });
    const entry = map.get(name)!;
    entry.meetings.push(meeting);
    if (meeting.company.toUpperCase().includes("HOLD")) entry.isHold = true;
  }

  return Array.from(map.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getMeetingsByDay(day: number, filter: MeetingType | "all" = "all"): Meeting[] {
  return filterMeetings(
    meetings.filter((m) => m.day === day),
    filter
  ).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

export function getMeetingsByPerson(email: string, filter: MeetingType | "all" = "all"): Meeting[] {
  return filterMeetings(
    meetings.filter((m) => m.internalAttendees.includes(email)),
    filter
  ).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}

export function getMeetingsByLocation(location: string, filter: MeetingType | "all" = "all"): Meeting[] {
  return filterMeetings(
    meetings.filter((m) => m.location === location),
    filter
  ).sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}
