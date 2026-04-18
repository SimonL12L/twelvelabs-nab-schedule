export type MeetingType = "meeting" | "partner" | "theater" | "panel" | "dinner" | "event" | "internal";

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

function parseContact(raw: string): string {
  const match = raw.match(/^(.+?)\s*<[^>]+>$/);
  return match ? match[1].trim() : raw.trim();
}

// Partner emails: if any of these are internal attendees, the meeting is a "partner" meeting
const PARTNER_EMAILS = new Set([
  "danny.nicolopoulos@twelvelabs.io",
  "belinda.merritt@twelvelabs.io",
  "kelly.hackenburg@twelvelabs.io",
  "john.reigart@twelvelabs.io",
  "abby.chittams@twelvelabs.io",
]);

// Theater speaking slot: when ONLY these two are internal attendees at the Partner Theater
const THEATER_ATTENDEES = new Set([
  "emily.kurze@twelvelabs.io",
  "allyson.gottlieb@twelvelabs.io",
]);

export const NAME_OVERRIDES: Record<string, string> = {
  "yoon.sohn@twelvelabs.io": "Andy Sohn",
  "robert.mohr@twelvelabs.io": "Bobby Mohr",
};

export function emailToName(email: string): string {
  if (NAME_OVERRIDES[email]) return NAME_OVERRIDES[email];
  const local = email.split("@")[0];
  return local.split(".").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
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
    company: "Salesforce",
    internal: "tom@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "opopovsky@salesforce.com\nmcesca@salesforce.com\npatrick.oneill@salesforce.com\ndavid.polk@nomobo.tv\nmat.turk@nomobo.tv",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Disney (David Griggs)",
    internal: "soyoung@twelvelabs.io\ndan.germain@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "david.griggs@disney.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "LucidLink",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nbelinda.merritt@twelvelabs.io",
    external: "david.mauer@lucidlink.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 19, 2026", time: "10:00 AM", type: "partner",
  },
  {
    company: "Fonn Group",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "andre@fonngroup.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 19, 2026", time: "10:00 AM", type: "partner",
  },
  {
    company: "WBD (Mark Nakano)",
    internal: "dan.germain@twelvelabs.io\njordan.woods@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
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
    date: "April 19, 2026", time: "11:00 AM", type: "partner",
  },
  {
    company: "Lunch at Fontainebleau",
    internal: "", external: "",
    location: "NAB VIP – Fontainebleau",
    date: "April 19, 2026", time: "11:30 AM", type: "event",
  },
  {
    company: "New Media Hollywood",
    internal: "belinda.merritt@twelvelabs.io",
    external: "bobby.poole@nmh.com\nChris Speer <cspeer@nmh.com>\ncoco@nmh.com",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 19, 2026", time: "11:30 AM", type: "meeting",
  },
  {
    company: "Quickplay Exec",
    internal: "soyoung@twelvelabs.io\njae@twelvelabs.io\njohn.reigart@twelvelabs.io\nemily.kurze@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io",
    external: "sean.lynch@quickplay.com\nandre@quickplay.com\njuan@quickplay.com\npaul@quickplay.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 19, 2026", time: "11:30 AM", type: "partner",
  },
  {
    company: "MLS",
    internal: "brice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io\njesse.white@twelvelabs.io",
    external: "keith.agabob@mlssoccer.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "Disney",
    internal: "dan.germain@twelvelabs.io\ndavid.morel@twelvelabs.io\njuddy.talt@twelvelabs.io",
    external: "rosario.arbeleche@disney.com\nkieren.portley@disney.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "Scoreplay",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "josh@scoreplay.io",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 19, 2026", time: "12:00 PM", type: "partner",
  },
  {
    company: "Monks",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\njordan.woods@twelvelabs.io",
    external: "brian.tagami@monks.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "1:00 PM", type: "partner",
  },
  {
    company: "ITN",
    internal: "dan.germain@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "jon.roberts@itn.co.uk\nhannah.taylor@itn.co.uk",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Griffin Media",
    internal: "brice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "richard.cox@griffin.news",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 19, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Overcast HQ",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "georgek@overcasthq.com\nphilippe@overcasthq.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 19, 2026", time: "1:00 PM", type: "partner",
  },
  {
    company: "NHL",
    internal: "jesse.white@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "gnodine@nhl.com\nharry.skopas@cinesysinc.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "2:00 PM", type: "meeting",
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
    date: "April 19, 2026", time: "2:00 PM", type: "partner",
  },
  {
    company: "Microsoft",
    internal: "danny.nicolopoulos@twelvelabs.io\nbelinda.merritt@twelvelabs.io",
    external: "danmccrary@microsoft.com\nsimon.crownshaw@microsoft.com\nelsak@microsoft.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 19, 2026", time: "2:30 PM", type: "partner",
  },
  {
    company: "AWS",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nkelly.hackenburg@twelvelabs.io\nabby.chittams@twelvelabs.io",
    external: "trosenst@amazon.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "3:00 PM", type: "partner",
  },
  {
    company: "Vubiquity",
    internal: "dan.germain@twelvelabs.io\nrobert.mohr@twelvelabs.io\ndavid.morel@twelvelabs.io",
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
    date: "April 19, 2026", time: "3:00 PM", type: "partner",
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
    company: "Interview SVG – Chad",
    internal: "chad.rounsavall@twelvelabs.io\nmaddi.santos@twelvelabs.io",
    external: "",
    location: "NAB Show",
    date: "April 19, 2026", time: "3:45 PM", type: "panel",
  },
  {
    company: "Beamr",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io",
    external: "brandon@beamr.com\njere@beamr.com\nhaggai@beamr.com\nkobi@beamr.com\noded@beamr.com\nvim@beamr.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "4:00 PM", type: "partner",
  },
  {
    company: "Reuters Imagen",
    internal: "allie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "olivia.cianci@thomsonreuters.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "Cinesys",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "matt@cinesys.io",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 19, 2026", time: "4:00 PM", type: "partner",
  },
  {
    company: "Disney / ABC News (Nick Ross)",
    internal: "soyoung@twelvelabs.io\ndan.germain@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "nick.ross@disney.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "5:00 PM", type: "meeting",
  },
  {
    company: "TwelveLabs Happy Hour / Rodeo Launch",
    internal: "", external: "",
    location: "Las Vegas, NV",
    date: "April 19, 2026", time: "6:30 PM", type: "event",
  },
  {
    company: "Nine <> AWS <> TwelveLabs",
    internal: "jae@twelvelabs.io\nethan.heerwagen@twelvelabs.io\nyoon.kim@twelvelabs.io",
    external: "",
    location: "Entertainment Loft, Fontainebleau",
    date: "April 19, 2026", time: "10:30 AM", type: "meeting",
  },
  {
    company: "Backlight",
    internal: "soyoung@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\njohn.reigart@twelvelabs.io\nkyle.cabigon@twelvelabs.io",
    external: "kathleen.barrett@backlight.co",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 19, 2026", time: "10:45 AM", type: "meeting",
  },
  {
    company: "Disney (Mitch Jacobs) (HOLD)",
    internal: "dan.germain@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth #W1923",
    date: "April 19, 2026", time: "11:30 AM", type: "meeting",
  },
  {
    company: "Amagi",
    internal: "john.reigart@twelvelabs.io\nbelinda.merritt@twelvelabs.io",
    external: "danny.halprin@amagi.com",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 19, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "TVNZ <> AWS <> TwelveLabs",
    internal: "jae@twelvelabs.io\nsoyoung@twelvelabs.io\nyoon.kim@twelvelabs.io\nethan.heerwagen@twelvelabs.io",
    external: "jonohow@amazon.com\nmcdonagg@amazon.com",
    location: "AWS Booth",
    date: "April 19, 2026", time: "12:15 PM", type: "meeting",
  },
  {
    company: "Memnon",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nbelinda.merritt@twelvelabs.io",
    external: "heidi.shakespeare@memnon.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 19, 2026", time: "12:30 PM", type: "meeting",
  },
  {
    company: "ISBC",
    internal: "belinda.merritt@twelvelabs.io",
    external: "debby@isbc.co",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 19, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Marvel Studios",
    internal: "dan.germain@twelvelabs.io\njordan.woods@twelvelabs.io\nyoon.kim@twelvelabs.io",
    external: "lotis@marvelstudios.com\nkmitchell@marvelstudios.com\nmitch.jacobs@disney.com",
    location: "TwelveLabs Booth #W1923",
    date: "April 19, 2026", time: "2:00 PM", type: "meeting",
  },
  {
    company: "TV Azteca",
    internal: "allie.bernacchi@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "ineri@tvazteca.com.mx\nkarina.flores@tvazteca.com.mx\ncastiefr@amazon.com\nmarrsadi@amazon.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 19, 2026", time: "3:30 PM", type: "meeting",
  },
  {
    company: "SGO",
    internal: "dan.germain@twelvelabs.io\nallie.shelton@twelvelabs.io",
    external: "gmills@sgo.es",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 19, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "SBS",
    internal: "yoon.sohn@twelvelabs.io",
    external: "dylee@sbs.co.kr\nkwongsg12@sbs.co.kr\nroadhy@sbs.co.kr\nsonjs@sbs.co.kr",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 19, 2026", time: "5:00 PM", type: "meeting",
  },
  {
    company: "WBD",
    internal: "juddy.talt@twelvelabs.io\nbrice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
    external: "bernardo.martinez@wbd.com\nvivian.arenado@wbd.com\nben.rojas@wbd.com",
    location: "TwelveLabs Booth #W1923",
    date: "April 19, 2026", time: "5:00 PM", type: "meeting",
  },
  {
    company: "Marvel Studios Dinner (HOLD)",
    internal: "dan.germain@twelvelabs.io\njordan.woods@twelvelabs.io",
    external: "",
    location: "Las Vegas, NV",
    date: "April 19, 2026", time: "7:00 PM", type: "dinner",
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
    date: "April 20, 2026", time: "9:00 AM", type: "partner",
  },
  {
    company: "CBS",
    internal: "ethan.heerwagen@twelvelabs.io\nbrice.penven@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "lhg@cbsnews.com\najg@cbsnews.com\ndaganr@cbsnews.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "9:00 AM", type: "meeting",
  },
  {
    company: "M&E Stage Interview – Soyoung",
    internal: "soyoung@twelvelabs.io",
    external: "",
    location: "M&E Stage, NAB Show",
    date: "April 20, 2026", time: "9:30 AM", type: "panel",
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
    internal: "ethan.heerwagen@twelvelabs.io\nkyle.cabigon@twelvelabs.io",
    external: "dave.wilson@catapult.com\nlee.cadman@catapult.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "11:00 AM", type: "partner",
  },
  {
    company: "Vidispine",
    internal: "john.reigart@twelvelabs.io\nemily.kurze@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nbrice.penven@twelvelabs.io\nbelinda.merritt@twelvelabs.io\nchad.rounsavall@twelvelabs.io\njesse.white@twelvelabs.io",
    external: "annika.kimpel@vidispine.com\nexhibition@vidispine.com\nkarsten.schragmann@vidispine.com",
    location: "Vidispine Booth #W1643",
    date: "April 20, 2026", time: "11:00 AM", type: "partner",
  },
  {
    company: "The New York Times",
    internal: "allie.bernacchi@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "Abe Sater <abraham.sater@nytimes.com>\nelvisdj@amazon.com",
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
    internal: "chad.rounsavall@twelvelabs.io\nethan.heerwagen@twelvelabs.io\nsimon.lecointe@twelvelabs.io\njesse.white@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "ABC / Disney",
    internal: "dan.germain@twelvelabs.io\nsimon.lecointe@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "mike.b.marzio@disney.com\nnancy.berni@disney.com\njohn.d.mcnally@abc.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "NBCU Lunch",
    internal: "belinda.merritt@twelvelabs.io\nethan.heerwagen@twelvelabs.io\nsoyoung@twelvelabs.io\nyoon.kim@twelvelabs.io",
    external: "anne.chang@nbcuni.com\nbobby.micheletti@nbcuni.com\nkyle.absten@nbcuni.com\nsherwin.roque@nbcuni.com\nsteve.swisz@nbcuni.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 20, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "12:00 PM", type: "partner",
  },
  {
    company: "Disney (HOLD)",
    internal: "dan.germain@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "",
    location: "NAB VIP – Fontainebleau",
    date: "April 20, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "SnapStream",
    internal: "amie.araghi@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "daniel@snapstream.com\ngerard@snapstream.com",
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
    date: "April 20, 2026", time: "1:00 PM", type: "partner",
  },
  {
    company: "Lionsgate",
    internal: "soyoung@twelvelabs.io\nbrice.penven@twelvelabs.io\njuddy.talt@twelvelabs.io",
    external: "drevkin@lionsgate.com\njportnoy@lionsgate.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "1:45 PM", type: "meeting",
  },
  {
    company: "Apple Fitness+",
    internal: "belinda.merritt@twelvelabs.io\ndavid.morel@twelvelabs.io\nethan.heerwagen@twelvelabs.io\njuddy.talt@twelvelabs.io",
    external: "elizabeth_mckenzie@apple.com\nbhamblin@apple.com\nkevin_marchand@apple.com\nstevenmoyer@apple.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "1:45 PM", type: "meeting",
  },
  {
    company: "Quickplay",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "sean.lynch@quickplay.com\naj.joiner@quickplay.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "2:00 PM", type: "partner",
  },
  {
    company: "AWS + FOX",
    internal: "chad.rounsavall@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
    external: "",
    location: "Meeting Room 4, AWS Booth #W1701",
    date: "April 20, 2026", time: "2:00 PM", type: "meeting",
  },
  {
    company: "3ABN",
    internal: "juddy.talt@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "brad.walker@3abn.org",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "2:30 PM", type: "meeting",
  },
  {
    company: "NBCU",
    internal: "soyoung@twelvelabs.io\nethan.heerwagen@twelvelabs.io",
    external: "matt.varney@nbcuni.com\nantony.dickson@nbcuni.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "2:30 PM", type: "meeting",
  },
  {
    company: "Streaming Summit Panel (Bobby)",
    internal: "maddi.santos@twelvelabs.io\nrobert.mohr@twelvelabs.io\njae@twelvelabs.io\nyoon.kim@twelvelabs.io",
    external: "",
    location: "NAB Show – W209-W210",
    date: "April 20, 2026", time: "2:45 PM", type: "panel",
  },
  {
    company: "NASCAR",
    internal: "jae@twelvelabs.io\ndan.germain@twelvelabs.io\ndavid.morel@twelvelabs.io\njesse.white@twelvelabs.io",
    external: "pcarroll@nascar.com\nfieldwes@amazon.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "3:00 PM", type: "meeting",
  },
  {
    company: "AWS",
    internal: "allie.bernacchi@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth or AWS Booth",
    date: "April 20, 2026", time: "3:00 PM", type: "meeting",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "3:00 PM", type: "partner",
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
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nkyle.cabigon@twelvelabs.io\nbrice.penven@twelvelabs.io",
    external: "",
    location: "Dalet Booth #W1519",
    date: "April 20, 2026", time: "3:30 PM", type: "partner",
  },
  {
    company: "Qvest (Mike Rivera)",
    internal: "chad.rounsavall@twelvelabs.io",
    external: "michael.rivera@qvest.com",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 20, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "Arrk Media",
    internal: "dan.germain@twelvelabs.io\ndavid.morel@twelvelabs.io\nallie.shelton@twelvelabs.io",
    external: "phil.hodgetts@arrkmedia.com",
    location: "TwelveLabs Booth #W1923",
    date: "April 20, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "TelevisaUnivision",
    internal: "jordan.woods@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
    external: "jvelastegui@televisaunivision.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "Scoreplay",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "josh@scoreplay.io",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "4:00 PM", type: "partner",
  },
  {
    company: "NBA",
    internal: "ethan.heerwagen@twelvelabs.io\njesse.white@twelvelabs.io\nadrienne@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nsimon.lecointe@twelvelabs.io\nkyle.cabigon@twelvelabs.io",
    external: "vcerejo@nba.com\nmilally@amazon.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "4:30 PM", type: "meeting",
  },
  {
    company: "Sony Pictures",
    internal: "soyoung@twelvelabs.io\ndan.germain@twelvelabs.io\nbrice.penven@twelvelabs.io\njuddy.talt@twelvelabs.io",
    external: "daniel_delarosa@spe.sony.com\ndavid_deelo@spe.sony.com\nstephen_shapiro@spe.sony.com\nyoshikazu_takashima@spe.sony.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "4:30 PM", type: "meeting",
  },
  {
    company: "Skywalker Sound",
    internal: "amie.araghi@twelvelabs.io",
    external: "stevem@skysound.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "5:00 PM", type: "meeting",
  },
  {
    company: "Press – Danny at Avid Booth",
    internal: "emily.kurze@twelvelabs.io",
    external: "",
    location: "Avid Booth North Hall #N2226",
    date: "April 20, 2026", time: "5:00 PM", type: "event",
  },
  {
    company: "Aaron Sloman",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "Aaron Sloman",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 20, 2026", time: "5:00 PM", type: "partner",
  },
  {
    company: "Eagles & Chesa",
    internal: "jesse.white@twelvelabs.io\njordan.woods@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nallie.shelton@twelvelabs.io",
    external: "felix@chesa.com\njwhite@eagles.nfl.com\nben@chesa.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "5:15 PM", type: "meeting",
  },
  {
    company: "ScorePlay Sports Cocktail Hour",
    internal: "jesse.white@twelvelabs.io",
    external: "",
    location: "Delilah Las Vegas",
    date: "April 20, 2026", time: "5:30 PM", type: "event",
  },
  {
    company: "Bernie Gershon VIP Exec Dinner",
    internal: "soyoung@twelvelabs.io\nmaddi.santos@twelvelabs.io\nrobert.mohr@twelvelabs.io",
    external: "",
    location: "Las Vegas, NV",
    date: "April 20, 2026", time: "6:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Don's Prime (Disney HOLD)",
    internal: "allie.shelton@twelvelabs.io\ndan.germain@twelvelabs.io\nyoon.kim@twelvelabs.io",
    external: "",
    location: "Don's Prime, Las Vegas",
    date: "April 20, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Mother Wolf",
    internal: "yoon.sohn@twelvelabs.io",
    external: "",
    location: "Mother Wolf, Las Vegas",
    date: "April 20, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Nobu",
    internal: "", external: "",
    location: "Nobu, Las Vegas",
    date: "April 20, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "NVIDIA",
    internal: "soyoung@twelvelabs.io\ndan.germain@twelvelabs.io",
    external: "lsmithingham@nvidia.com",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 20, 2026", time: "9:00 AM", type: "meeting",
  },
  {
    company: "Burnlab / Aaron Sloman (Booth Visit)",
    internal: "danny.nicolopoulos@twelvelabs.io\nbelinda.merritt@twelvelabs.io",
    external: "",
    location: "Burnlab Booth #W2131",
    date: "April 20, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Fuse Media",
    internal: "nate.gustafson@twelvelabs.io\njordan.woods@twelvelabs.io\njuddy.talt@twelvelabs.io",
    external: "tromain@fusemedia.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 20, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Ross Video AI",
    internal: "juddy.talt@twelvelabs.io",
    external: "wojtek.tryc@rossvideo.com",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 20, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "AWS (Fenix / UK)",
    internal: "bobby@twelvelabs.io\ndan.germain@twelvelabs.io",
    external: "piiber@amazon.co.uk\nhahannar@amazon.co.uk",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Nomad",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io",
    external: "dgrimstead@nomad.media\namiller@nomad.media",
    location: "Nomad Booth #W2357",
    date: "April 20, 2026", time: "2:00 PM", type: "meeting",
  },
  {
    company: "TVNZ (HOLD)",
    internal: "ethan.heerwagen@twelvelabs.io\nbrice.penven@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 20, 2026", time: "5:15 PM", type: "meeting",
  },
  {
    company: "NHK (HOLD)",
    internal: "yoon.sohn@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io\nkyle.cabigon@twelvelabs.io",
    external: "kitajima.s-gi@nhk.or.jp\ntakeuchi.a-ic@nhk.or.jp\nwada.k-cw@nhk.or.jp\nhiratasy@amazon.co.jp",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 20, 2026", time: "6:00 PM", type: "meeting",
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
    company: "Spectra Logic",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nbelinda.merritt@twelvelabs.io",
    external: "hossein@spectralogic.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "9:00 AM", type: "partner",
  },
  {
    company: "IMAX",
    internal: "dan.germain@twelvelabs.io\njuddy.talt@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "jdunant@imax.com\nbmarkoe@imax.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "9:00 AM", type: "meeting",
  },
  {
    company: "TOTALTEL",
    internal: "amie.araghi@twelvelabs.io",
    external: "Nicolas Miranda Thraves",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 21, 2026", time: "9:00 AM", type: "meeting",
  },
  {
    company: "SportsDataIO",
    internal: "jesse.white@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nallie.shelton@twelvelabs.io",
    external: "jeb@sportsdata.io",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 21, 2026", time: "9:00 AM", type: "meeting",
  },
  {
    company: "Wizeline",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "gino.bautista@wizeline.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "9:00 AM", type: "partner",
  },
  {
    company: "Riot Games",
    internal: "dan.germain@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
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
    company: "AWS – Jordan Alexander (HOLD)",
    internal: "jesse.white@twelvelabs.io",
    external: "",
    location: "AWS Booth",
    date: "April 21, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Formula 1",
    internal: "jesse.white@twelvelabs.io\nbrice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nallie.shelton@twelvelabs.io",
    external: "jwilliams@f1.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 21, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Quickplay",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "sean.lynch@quickplay.com\naj.joiner@quickplay.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "10:00 AM", type: "partner",
  },
  {
    company: "Fox",
    internal: "jordan.woods@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "justin.briars@fox.com\nkatie.fellion@fox.com\ndeyner.seals@fox.com\nlauren.henne@fox.com\npayton.list@fox.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 21, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "Sony Music",
    internal: "jae@twelvelabs.io\ndan.germain@twelvelabs.io\nbrice.penven@twelvelabs.io",
    external: "lee.eigner@sonymusic.com\nrenee.lyons@sonymusic.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "Paramount / MTV",
    internal: "ethan.heerwagen@twelvelabs.io\njuddy.talt@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nrobert.mohr@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "james.cohan@mtvstaff.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "11:00 AM", type: "partner",
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
    company: "Aurora Borealis (HOLD)",
    internal: "allie.shelton@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 21, 2026", time: "11:30 AM", type: "meeting",
  },
  {
    company: "Evolve Studios (HOLD)",
    internal: "juddy.talt@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "melissafloreth@evolve.studio\nspencer@evolve.studio",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "11:45 AM", type: "meeting",
  },
  {
    company: "F1 (HOLD)",
    internal: "jesse.white@twelvelabs.io\nbrice.penven@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "12:00 PM", type: "meeting",
  },
  {
    company: "DataCore",
    internal: "john.reigart@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nbelinda.merritt@twelvelabs.io",
    external: "serena.harris@datacore.com\nnabbookings@datacore.com\nbarry.evans@datacore.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "12:00 PM", type: "partner",
  },
  {
    company: "Vidispine (Karsten Schragmann)",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "exhibition@vidispine.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "12:00 PM", type: "partner",
  },
  {
    company: "AWS",
    internal: "soyoung@twelvelabs.io\ndan.germain@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "ryanpras@amazon.com\nkleintk@amazon.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "12:30 PM", type: "meeting",
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
    internal: "dan.germain@twelvelabs.io\njuddy.talt@twelvelabs.io\nyoon.kim@twelvelabs.io\ndavid.morel@twelvelabs.io\nsoyoung@twelvelabs.io",
    external: "donna.mulvey-jones@banijayuk.com\ngraysonm@amazon.co.uk",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "XR Extreme Reach",
    internal: "tom@twelvelabs.io\nrobert.mohr@twelvelabs.io",
    external: "sherman.li@extremereach.com\nalyssa.omalley@extremereach.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 21, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Dalet (Mario Mekler)",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "mmekler@dalet.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "1:00 PM", type: "partner",
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
    date: "April 21, 2026", time: "2:00 PM", type: "partner",
  },
  {
    company: "VAST Data",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "suzanne.mcreynolds@vastdata.com\njonathan.robbins@vastdata.com\njared.magaro@vastdata.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "2:00 PM", type: "partner",
  },
  {
    company: "Meta",
    internal: "allie.bernacchi@twelvelabs.io\nsimon.lecointe@twelvelabs.io\nbrice.penven@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "mlipman@meta.com\nmp@meta.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
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
    internal: "jae@twelvelabs.io\ndan.germain@twelvelabs.io\nbrice.penven@twelvelabs.io",
    external: "mari@sardius.media\nAri Burt <ari@sardius.media>\nJason Shore <jason@sardius.media>",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "3:00 PM", type: "meeting",
  },
  {
    company: "Fox Sports",
    internal: "soyoung@twelvelabs.io\njordan.woods@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
    external: "kevin.palys@fox.com\nricardo.perez-selsky@fox.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "3:00 PM", type: "meeting",
  },
  {
    company: "Autodesk",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "hugh.calveley@autodesk.com",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "3:00 PM", type: "partner",
  },
  {
    company: "AWS, Wowza & UTA",
    internal: "tom@twelvelabs.io\nethan.heerwagen@twelvelabs.io\nbrice.penven@twelvelabs.io\nabby.chittams@twelvelabs.io",
    external: "jaredlw@amazon.com\nwhitatik@amazon.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "Axel Springer",
    internal: "dan.germain@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "christian.engelhardt@axelspringer.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 21, 2026", time: "4:00 PM", type: "meeting",
  },
  {
    company: "Cinesys",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "matt@cinesys.io",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "4:00 PM", type: "partner",
  },
  {
    company: "Lionsgate (Drinks)",
    internal: "soyoung@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "",
    location: "The Vault at Bellagio",
    date: "April 21, 2026", time: "5:00 PM", type: "meeting",
  },
  {
    company: "TacGas (HOLD)",
    internal: "dan.germain@twelvelabs.io\njordan.woods@twelvelabs.io\nallie.shelton@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 21, 2026", time: "5:00 PM", type: "meeting",
  },
  {
    company: "Sardius (Partner Theater)",
    internal: "emily.kurze@twelvelabs.io\nallyson.gottlieb@twelvelabs.io",
    external: "Jason Shore <jason@sardius.media>\nAri Burt <ari@sardius.media>\njosh.ruff@sardius.media\njono@sardius.media\nkevin@sardius.media",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 21, 2026", time: "5:00 PM", type: "partner",
  },
  {
    company: "Customer Dinner – Cote",
    internal: "", external: "",
    location: "Cote, Las Vegas",
    date: "April 21, 2026", time: "5:00 PM", type: "dinner",
  },
  {
    company: "AWS / Presidio Exec Happy Hour",
    internal: "emily.kurze@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\njesse.white@twelvelabs.io",
    external: "",
    location: "The Library @ Marquee Nightclub, 3708 Las Vegas Blvd S",
    date: "April 21, 2026", time: "6:00 PM", type: "event",
  },
  {
    company: "Customer Dinner – TL / VAST / Monks",
    internal: "danny.nicolopoulos@twelvelabs.io\nemily.kurze@twelvelabs.io\namie.araghi@twelvelabs.io",
    external: "",
    location: "Canaletto, Venetian, Las Vegas",
    date: "April 21, 2026", time: "6:30 PM", type: "dinner",
  },
  {
    company: "WBD Exec Dinner – Cipriani (HOLD)",
    internal: "jae@twelvelabs.io\nsoyoung@twelvelabs.io\nyoon.kim@twelvelabs.io\nallie.bernacchi@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nrobert.mohr@twelvelabs.io",
    external: "",
    location: "Cipriani Las Vegas",
    date: "April 21, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Komodo",
    internal: "dan.germain@twelvelabs.io\njuddy.talt@twelvelabs.io",
    external: "",
    location: "Komodo, Las Vegas",
    date: "April 21, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "Customer Dinner – Cipriani",
    internal: "", external: "",
    location: "Cipriani, Las Vegas",
    date: "April 21, 2026", time: "7:00 PM", type: "dinner",
  },
  {
    company: "Wowza",
    internal: "john.reigart@twelvelabs.io",
    external: "barry@wowza.com",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 21, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "Cineverse",
    internal: "nate.gustafson@twelvelabs.io\njordan.woods@twelvelabs.io\nchad.rounsavall@twelvelabs.io",
    external: "",
    location: "The Cosmopolitan of Las Vegas",
    date: "April 21, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "Formula Dot AI",
    internal: "john.reigart@twelvelabs.io\nbelinda.merritt@twelvelabs.io",
    external: "suzanne@formuladotai.ai\njason@formuladotai.ai",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 21, 2026", time: "1:00 PM", type: "meeting",
  },
  {
    company: "MLB",
    internal: "jesse.white@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nallie.bernacchi@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "nick.nolan@mlb.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 21, 2026", time: "3:00 PM", type: "meeting",
  },
  {
    company: "Qencode",
    internal: "john.reigart@twelvelabs.io\ndan.germain@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "luisa.cabrera@qencode.com\nmurad@qencode.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 21, 2026", time: "6:00 PM", type: "meeting",
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
    company: "Backlight (HOLD)",
    internal: "john.reigart@twelvelabs.io\nsoyoung@twelvelabs.io\ndanny.nicolopoulos@twelvelabs.io\nkyle.cabigon@twelvelabs.io",
    external: "",
    location: "Backlight Booth – North Hall",
    date: "April 22, 2026", time: "9:30 AM", type: "partner",
  },
  {
    company: "Imagine Consulting",
    internal: "yoon.kim@twelvelabs.io\nrobert.mohr@twelvelabs.io\nyoon.sohn@twelvelabs.io",
    external: "jin@imaizumi.net",
    location: "TwelveLabs Booth #W1923 – Partner Theater",
    date: "April 22, 2026", time: "9:30 AM", type: "partner",
  },
  {
    company: "Gracenote",
    internal: "tom@twelvelabs.io\nrobert.mohr@twelvelabs.io",
    external: "manasvi.sharma@nielsen.com\nNandita Arora",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 22, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "WBD",
    internal: "allie.bernacchi@twelvelabs.io\nbrice.penven@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nsoyoung@twelvelabs.io\nkyle.cabigon@twelvelabs.io",
    external: "allan.isfan@wbd.com\ncarly.danti@wbd.com\nchristina.holmes@wbd.com\njade.lui@wbd.com\njosh.derby@wbd.com\nsudheer.sirivara@wbd.com",
    location: "Opal Boardroom – Floor 2, Fontainebleau",
    date: "April 22, 2026", time: "10:00 AM", type: "meeting",
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
    date: "April 22, 2026", time: "11:30 AM", type: "partner",
  },
  {
    company: "LIV Golf",
    internal: "jesse.white@twelvelabs.io\njordan.woods@twelvelabs.io\nchad.rounsavall@twelvelabs.io\nallie.shelton@twelvelabs.io",
    external: "michael.broomfield@livgolf.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 22, 2026", time: "11:45 AM", type: "meeting",
  },
  {
    company: "Disney (HOLD)",
    internal: "soyoung@twelvelabs.io\ndan.germain@twelvelabs.io\nyoon.kim@twelvelabs.io\nsimon.lecointe@twelvelabs.io",
    external: "",
    location: "TwelveLabs Booth #W1923 – NAB Booth 1",
    date: "April 22, 2026", time: "12:30 PM", type: "meeting",
  },
  {
    company: "Ernie & Chad",
    internal: "chad.rounsavall@twelvelabs.io",
    external: "erniegleon@gmail.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 22, 2026", time: "9:00 AM", type: "meeting",
  },
  {
    company: "Banijay Benelux (Endemol Shine)",
    internal: "dan.germain@twelvelabs.io\njuddy.talt@twelvelabs.io\ndavid.morel@twelvelabs.io",
    external: "marc.mul@banijaybenelux.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 22, 2026", time: "9:30 AM", type: "meeting",
  },
  {
    company: "Codemill",
    internal: "john.reigart@twelvelabs.io\nbelinda.merritt@twelvelabs.io",
    external: "alisa.joseph@codemill.se\nmaria.hellstrom@codemill.se",
    location: "Codemill Booth #W2724",
    date: "April 22, 2026", time: "10:00 AM", type: "meeting",
  },
  {
    company: "LTN",
    internal: "amie.araghi@twelvelabs.io",
    external: "bryan.mcguirk@ltnglobal.com",
    location: "TwelveLabs Booth #W1923 – Demo Station",
    date: "April 22, 2026", time: "11:00 AM", type: "meeting",
  },
  {
    company: "MGM Studios",
    internal: "jordan.woods@twelvelabs.io\nallie.bernacchi@twelvelabs.io",
    external: "bobby.evans@amazonstudios.com",
    location: "TwelveLabs Booth #W1923 – NAB Booth 2",
    date: "April 22, 2026", time: "12:30 PM", type: "meeting",
  },
];

export const meetings: Meeting[] = rawMeetings.map((m, i) => {
  const internalList = parseList(m.internal);

  // Partner Theater speaking slot: only emily/allyson as internal attendees
  const isTheater =
    m.location === "TwelveLabs Booth #W1923 – Partner Theater" &&
    internalList.length > 0 &&
    internalList.every((e) => THEATER_ATTENDEES.has(e));

  // Auto-classify meeting vs partner; preserve all other explicit types
  let type: MeetingType;
  if (isTheater) {
    type = "theater";
  } else if (m.type === "meeting" || m.type === "partner") {
    type = internalList.some((e) => PARTNER_EMAILS.has(e)) ? "partner" : "meeting";
  } else {
    type = m.type;
  }

  return {
    id: `mtg-${i}`,
    company: m.company,
    internalAttendees: internalList,
    externalAttendees: parseList(m.external).map(parseContact),
    location: m.location,
    date: m.date,
    time: m.time,
    isoDate: toIso(m.date, m.time),
    type,
    day: getDay(m.date),
  };
});

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
    .map((email) => ({ email, name: emailToName(email) }));
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
  const relevantTypes: MeetingType[] =
    filter === "all"
      ? ["meeting", "partner"]
      : ["dinner", "event", "internal", "panel"].includes(filter)
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

export function searchMeetings(query: string, filter: MeetingType | "all" = "all"): Meeting[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return filterMeetings(meetings, filter)
    .filter((m) => {
      const haystack = [
        m.company,
        m.location,
        ...m.internalAttendees.map(emailToName),
        ...m.externalAttendees,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
}
