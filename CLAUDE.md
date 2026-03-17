# NAB 2026 Schedule App

## Overview
Conference meeting scheduler for TwelveLabs team at NAB Show 2026 (April 19–21, Las Vegas).
Displays meetings by day, room/location, and person. Built with Next.js 16, TypeScript, Tailwind CSS.

## Architecture
- **Framework**: Next.js App Router (static export friendly)
- **Styling**: Tailwind CSS v4 + clsx for conditional classes
- **Icons**: lucide-react
- **Data**: Static data in `src/lib/data.ts` (will be replaced with Google Calendar API)
- **Deployment**: Vercel

## Key Files
- `src/lib/data.ts` — Meeting data model and all meeting records
- `src/components/MeetingCard.tsx` — Reusable card for a single meeting
- `src/components/DayView.tsx` — Timeline view grouped by day and time
- `src/components/RoomView.tsx` — Meetings grouped by location
- `src/components/PeopleView.tsx` — Person selector + their schedule
- `src/components/StatsBar.tsx` — Top-level stats summary

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — Run ESLint

## Future Work
- Connect to Google Calendar API for live data
- Add search/filter functionality
- Mobile-optimized responsive tweaks
