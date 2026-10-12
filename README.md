# Gravity Media LeadershipOS

A private notebook for an engineering delivery leader: your responsibilities, goals, next steps, progress, regular conversations, weekly notes and meeting plans. Next.js, TypeScript, Tailwind, Prisma and local SQLite. Use fictional examples only. No company systems, external integrations, calendar invitations or AI services are connected.

## Start on your Mac

Install Node.js LTS (22 or later) from https://nodejs.org and reopen Terminal. Open Terminal in the downloaded project folder, then run:

```sh
npm ci
# Only create .env if it does not already exist:
test -f .env || cp .env.example .env
npm run db:setup
npm run dev
```

Open http://localhost:3000 and leave Terminal running. Control+C stops the app. Arial is the first font throughout. The server binds to your computer only and has no login; do not expose it publicly.

## Sections

- **Home:** what to look at today, next steps, progress, finished counts and upcoming meeting counts. Suggestions rank existing work marked Stuck first, then due work. They do not create tasks or measure work automatically.
- **My responsibilities:** edit the five areas of your job.
- **My job explained:** a read-only plain-English reference with examples and where responsibility starts and ends. It complements your company's formal job description.
- **My goals:** what you want to achieve over three months; include a specific result and target date.
- **My weekly checklist:** weekly or monthly check-ins. Tick Done and Save tick after a check-in. Untick and edit its date for the next occurrence.
- **Things to improve:** a change you are trying to make, why it helps and the next small step.
- **My week:** what went well, what got in the way and what to do next.
- **Meetings and agendas:** plan a date and time, attendees, topics to discuss, notes and decisions. Add named actions with due dates and save completion ticks. Editing an action preserves its completion state.

Meeting times are the local times agreed with attendees, not timezone-converted bookings. Weekly/monthly meetings have a button to create the next meeting with the same agenda and attendees. New notes, decisions and actions start empty. Short months use the last valid day. This is manual agenda reuse, not automatic scheduling. Clicking the button twice creates two meetings. No invitations or reminders are sent.

Goal and improvement cards have quick 0%, 25%, 50%, 75% and Mark done buttons. Progress is your estimate. Mark done sets 100% and Done; choosing a lower percentage reopens finished work. Partly updating stuck work preserves Stuck. Full forms allow any whole-number percentage. New forms have no status/repeat answer chosen and progress starts at zero.

## Resetting ticks and progress

Fresh demonstration data starts at zero, with no checklist ticks. Existing installations retain their data on update. To reset an existing installation, open My weekly checklist → Start progress and checklists again, read the explanation, tick the confirmation and press Reset progress and ticks. This sets goals, improvements and check-ins back to Working on it, sets progress to zero, and unticks meeting actions. It keeps written notes, agendas, dates, attendees and meeting history. Reset cannot be undone without a backup. It does not rewrite your entries or clear their text.

## Branding

Orange (#ff671d), dark plum (#2b202e) and white match the visual references. They are reference-matched, not verified official brand specifications. Smaller orange text is darker (#963900) for readability. The logo appears top-left only. Choose logo there to select a PNG, JPG or WebP up to 2 MB. It is displayed unchanged and remembered in this browser. Existing selections are reused. If browser storage is unavailable, it is session-only. No image is uploaded externally. The original image has to be selected locally; it is not embedded in the source ZIP. There is no top-right logo.

## Keep your data when updating

For this update, stop the app and replace **only the `src` folder** in your existing project with `src` from the latest download. Keep `.env`, `prisma/leadership.db`, `node_modules` and the rest of your existing project. Restart with `npm run dev`. No new dependencies or database schema changes are required. Meetings use additional record types in the existing database.

If installing from a new full download, use the start steps above. To retain data in a new folder, stop the old app and copy its `.env` and `prisma/leadership.db` into the new folder before starting.

## Storage and backup

The SQLite database is `prisma/leadership.db` by default. Only `file:` database URLs are accepted. `db:setup` generates Prisma, applies the idempotent initial SQL migration and seeds fictional records only when the entire database is empty. Existing records are never reseeded or silently reset. Stop the app before copying the database to a private backup. Keep that backup safe; restore only while stopped. The DB and `.env` are ignored by Git.

Prisma uses its supported JavaScript engine and a local SQLite libSQL adapter. There is no Turso connection and no Rust engine download is needed. Future schema changes need reviewed migrations and an updated migration runner; `db:setup` is not a general schema synchroniser.

## Verification

```sh
npm test
npm run build
npm run typecheck
npm start
```

Seventeen automated tests cover validation, progress transitions, focus ranking, SQLite persistence, meeting/action persistence, invalid cross-record updates and weekly/monthly recurrence. HTTP functional checks exercise meeting creation and editing, action completion and reopening, agenda reuse, validation and reset confirmation. Responsive layouts and accessible labelled forms are implemented. The new home dashboard has been checked in Chromium at desktop and phone sizes, including note persistence, checkbox updates and time selection, and scanned with axe for WCAG A/AA issues. This automated scan is not a complete accessibility certification.

HoDs retain department workload and routine staff matters; Projects and Maintenance retain fault workflows; senior leaders approve recruitment. The app should help you choose how to spend your time without additional administration for HoDs. The dashboard now includes local HoD support notes, staff skills/training/recruitment planning notes and editable updates for your boss. They do not replace existing staff, utilisation, fault or approval systems. An AI Focus Engine and AI agenda generation are not implemented. Agenda starter templates are local fixed examples.


## Dashboard layout

Home follows the supplied screenshot: a full-width header with the chosen logo top-left, centred LeadershipOS title and a responsive three-column grid. The cards are What should I do today?, My weekly checklist, My HoDs, Staff and training, Things to improve and My goals. Meetings and agendas remains available above the full-width Updates for my boss section. Section links under the header preserve access to the existing screens.

The bell opens saved work due today or earlier; the profile icon explains the local workspace rather than representing a company account. Time buttons start unselected and show one, two or three existing priorities. They limit the list, do not estimate durations, use no AI and create no tasks. My HoDs has six editable fictional role slots with notes and follow-up text. Staff and training has separate saved notes for skills gaps, training ideas and recruitment needs. Boss-update cards open editable notes for Done, Problems and Decisions needed. These notes are saved in the existing SQLite database; no new schema or dependencies are required. Existing goals, progress, checklists, meeting history and chosen logo are preserved. Screenshot example counts are replaced with your actual saved counts.


## Mac menu-bar app (macOS 13 or later)

This adds a small target icon beside your Mac clock. It runs the local server in the background; closing Terminal or the browser does not stop it. The menu opens the dashboard, checklist, meetings and weekly review in your usual browser. It is a native AppKit menu-bar launcher, not a separate native dashboard window or an AI widget.

One-time requirements: macOS 13 (Ventura) or later, Node.js LTS 22 or later, and Apple's Command Line Tools. You do not need the full Xcode application. If the installer reports missing Apple tools, run `xcode-select --install`, finish the Apple installer, then retry.

1. Stop any existing `npm run dev` session with Control+C. Quit any previously installed LeadershipOS menu-bar app before updating it.
2. Download the complete latest project. This update needs `macos`, `scripts`, `package.json` and `next.config.mjs` as well as `src`; replacing only `src` is not enough for the Mac app.
3. In Terminal inside the updated project, run:

```sh
npm run mac:install
```

If you are using a **new download folder** and your existing database is in the older project, import that file on first installation:

```sh
npm run mac:install -- "/path/to/your/old/project/prisma/leadership.db"
```

Use the actual path to your database. You can type `npm run mac:install -- ` and drag the old `leadership.db` file from Finder into Terminal, then press Enter. This imports a consistent copy without changing the original. If a menu-bar app database already exists, it is preserved instead of overwritten.

The installer builds and signs a local `.app`, installs it at `~/Applications/LeadershipOS.app`, and opens it. Look for the target icon beside the clock. After installation you can close Terminal. Keep Node.js installed; the launcher remembers the installed Node executable path. If Node is moved or removed, reinstall Node and rerun the installer. This is built for your own Mac, not a portable signed/notarised download for other people.

Choose **Open at login** to start it when you sign in. macOS may ask you to allow it under System Settings → General → Login Items. This is opt-in; installation does not turn it on automatically. If macOS refuses programmatic registration, add the app manually in Login Items. Choose **Quit LeadershipOS** to stop its background server. **Restart background app**, **Show logs** and **Open data folder** help with troubleshooting. A startup check verifies both the actual database and the launched server instance before opening the dashboard. A process already using port 3000 is not reused or killed by this app.

The installed app's persistent database is `~/Library/Application Support/LeadershipOS/leadership.db`. Logs are in the same folder. The original project database remains a safety copy; subsequent menu-bar app edits go to the app's database, so do not switch back to the old project's manual server expecting the copies to synchronise. Reinstalling preserves app data and keeps a timestamped backup of the previous app bundle. To back up the installed database, quit LeadershipOS and copy the database from Open data folder.

Verified here: installer shell syntax, bundle metadata, safe SQLite import, exclusion of `.env`/database files from the app bundle, standalone server operation and instance/database readiness. The Swift AppKit launcher, menu-bar interactions, macOS signing and login registration require final verification on a Mac; they cannot run in the Linux cloud workspace.

## Building a useful meeting agenda

Choose a starter for a HoD one-to-one, department-lead meeting or Director update, or add topics from scratch. Each topic has a title, Discuss/Decide/Update purpose, optional lead and a time estimate. Move topics up/down, remove them and see the total planned time. Save the meeting to keep the plan. Replacing a non-empty agenda with a starter asks before changing topics; it preserves the meeting notes and decisions. Existing plain-text agendas are read as discussion topics, and old meeting records remain usable without a database migration. The recurring-meeting button copies the structured plan but starts notes, decisions and actions blank. Templates are fixed examples, not AI suggestions.
