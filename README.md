# LeadershipOS

A responsive, local-first leadership workspace for an engineering delivery leader. Phase one includes five editable remit areas, quarterly measurable objectives, weekly/monthly activities, an overview of confirmed commitments, initiatives, and weekly reviews. All demonstration people and records are fictional. The focus panel ranks existing confirmed work by blocker status and due date; it is not an AI engine and never creates tasks.

## Run locally

Requires Node.js 22 or later and npm. From this checkout:

```sh
npm ci
# Create .env if absent (never overwrite existing configuration):
test -f .env || cp .env.example .env
npm run db:setup
npm run dev
```

On a Mac, install Node.js LTS from https://nodejs.org, reopen Terminal, and run these commands in the downloaded project folder. Open http://localhost:3000 after startup and leave Terminal running.

For an existing installation, keep your `.env`. SQLite is in `prisma/leadership.db`. `db:setup` generates Prisma, applies the idempotent initial SQL migration, and adds demonstration data only when the database is empty. No external credentials, company systems or external APIs are needed. For normal local use, bind to loopback: `npm run dev -- --hostname 127.0.0.1`.

```sh
npm test
npm run build
npm run typecheck
npm start -- --hostname 127.0.0.1
```

## Workflow

Edit any of the five responsibility areas under Leadership remit. Add objectives with a quarter and a numeric target in the measurable outcome. Track progress independently from status; mark records Complete when finished. Initiatives capture owner, outcome, next action and expected benefit. Weekly review captures achievements, blockers and next priorities. Recurring activities carry weekly/monthly cadence and a next-occurrence date; after doing an activity, manually advance its date. Dashboard counts and focus recommendations update from saved records. Complete records remain available in their workspace but leave the active dashboard.

Forms use labelled controls, native date/number constraints, server-side Zod validation and save/error announcements. The app provides keyboard navigation, a skip link, semantic headings, progress values and responsive layouts. SQLite writes happen on the local Next.js server; browser storage is not used. Network-free operation is available once dependencies are installed. This MVP has no authentication or multi-user isolation: use only on a trusted local machine, with fictional information, and do not expose it publicly.

## Storage and recovery

Stop the app before copying `prisma/leadership.db` to a private backup location. Restore while stopped. The DB and `.env` are ignored by Git. No data is sent to external integrations; dependencies are fetched during installation only. Avoid real employee information. Phase two AI recommendations, approval flows, private HoD support and Director reporting are deliberately not implemented.

## Tests

`npm test` exercises validation, deterministic focus prioritisation and actual SQLite persistence across Prisma connections, including updating and cleaning up a test record. Run `db:setup` first. Production build verifies Next.js compilation and types. Manual functional checks should include each workspace, creating and editing records, invalid submissions and narrow-screen keyboard use.

Prisma uses its supported JavaScript engine and local libSQL SQLite adapter. Only `file:` database URLs are accepted; no Turso service is used. The initial migration is applied locally without downloading Prisma Rust engines. For future schema changes, add reviewed SQL migrations and extend the migration runner; do not assume `db:setup` applies arbitrary schema changes.

## Verified in the cloud workspace

A clean `npm ci`, repeatable `db:setup`, all 4 automated tests, TypeScript checks and a production build passed. HTTP checks exercised all six workspaces and actual server-action creation, editing and invalid-progress rejection. Temporary test records were removed. Seed reruns preserved the original 12 demonstration records, including exactly five remit areas. Responsive CSS and accessible controls are implemented; a browser-based visual/accessibility audit has not been performed.


## Plain-language version

Home explains the app and shows goals, next steps, finished counts and items needing attention. My responsibilities describes your job; My goals holds three-month goals; Things to improve holds changes you want to make; Regular check-ins holds repeat conversations; My week holds weekly notes. The underlying data and database format are unchanged.

Goal and improvement cards have quick 0%, 25%, 50%, 75% and Mark done buttons. Progress is your estimate. Mark done sets both 100% and Done; choosing a lower percentage reopens finished work. Partly updating stuck work preserves its Stuck status. Full forms still allow any whole-number percentage. Completed work stays visible in its own section and contributes to the Home finished counts.

To update an existing Mac installation without moving your database: stop the app, download the latest ZIP from the leadershipos-phase-one branch, and replace only the existing project’s `src` folder with the downloaded `src` folder. Keep your existing `.env` and entire `prisma` folder. Restart with `npm run dev`. No dependency or database changes are required for this update.


## My job explained

The My job explained tab is a read-only practical reference based on the role described in the chat. Each of the five areas explains where responsibility starts and ends, an illustrative real-world example, how to recognise useful results and where to record work in the app. It preserves HoD ownership of utilisation and routine staff matters, Projects and Maintenance ownership of fault workflows, and senior leadership recruitment approval. This working reference complements the formal company job description; it does not add authority. Existing editable responsibilities and local data remain unchanged. Update an existing Mac installation by replacing only `src`, as described above.


## Gravity Media styling

The interface uses orange (#ff671d), dark plum (#2b202e), white and pale warm backgrounds based on the supplied visual references. These are reference-matched colours, not verified official brand specifications. Orange is used for progress bars and accents; smaller text uses a darker orange (#963900) for readability against light backgrounds. The header uses the Gravity Media name. The original logo image is awaiting a PNG/SVG file attachment; the displayed text does not reproduce the supplied logo artwork. Branding is contained in `src`; the existing Mac update instructions still apply. No new dependencies or database changes are needed.


## Top-right logo

Choose logo in the top-right header lets you select the supplied Gravity Media image directly from your Mac. PNG, JPG and WebP images up to 2 MB are accepted and checked for browser decoding. The exact image is displayed without redrawing or recolouring. It is saved locally in this browser, with a session-only fallback if browser storage is unavailable; no image is uploaded to an external service. Choose Change logo to replace it. A different browser needs the logo selected again. Save the image attachment to your Mac first; a transparent PNG is recommended for the white header.
