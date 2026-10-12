# BloodConnect — Connecting Donors, Saving Lives

A responsive college mini-project built with React, Vite, JavaScript, and Tailwind CSS. It demonstrates donor discovery, registration, blood requests, and a personal dashboard with fictional data. There is no Java backend, database, or live application API.

## Run locally

Install **Node.js 22 or newer with npm**, then open a terminal in this `frontend` directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Stop the server with `Ctrl+C`.

```sh
npm run build    # Create the production site in dist/
npm run preview  # Preview that build, usually on port 4173
npm test         # Run the service tests with Node's built-in test runner
```

No environment variables or API credentials are needed. The dev and preview scripts bind to `0.0.0.0`, so Vite can also provide a network URL for checking the site on a phone connected to the same network.

**Setup-machine note:** this workspace initially had no system `node` or `npm` on its PATH. Initial setup used a Codex-bundled Node runtime and a temporary npm runner under `/tmp`. Those temporary tools are not required by the project. Install standard Node.js/npm for durable development outside that environment.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page, donation illustration, process, blood groups, and FAQs |
| `/find-donors` | Fictional donor directory with blood group, city, and availability filters |
| `/donate` | Validated demo donor registration saved in this browser |
| `/request-blood` | Validated demo request saved in this browser |
| `/login` | Fixed, read-only demo login |
| `/signup` | Fixed, read-only demo signup preview |
| `/dashboard` | Profile editing, availability preference, recent demo requests, and sample statistics |
| `/about` | Project purpose, technologies, objectives, and future plans |
| Any other route | Friendly 404 page with a link home |

The dashboard is accessible directly: the app deliberately does not simulate protected production authentication. Login and signup validate the fixed fictional form values, start a temporary demo session, and navigate to the dashboard. Read-only credential fields are intentional; they prevent collection of real passwords.

## Project structure

```text
frontend/
├── public/favicon.svg
├── src/
│   ├── assets/donation-illustration.svg
│   ├── components/              # Navbar, Footer, Button, Input, Card, etc.
│   ├── data/mockData.js         # Fictional donors, requests, and demo profile
│   ├── pages/                  # Home, FindDonors, Donate, RequestBlood,
│   │                           # Auth, Dashboard, and About
│   ├── services/
│   │   ├── demoService.js       # Search, validation, and browser persistence
│   │   └── demoService.test.js  # Service behavior and failure-path tests
│   ├── App.jsx                 # Routes, route effects, and error boundary
│   ├── main.jsx                # React application entry point
│   └── index.css               # Tailwind import and responsive design styles
├── index.html                  # HTML shell and Google Fonts imports
├── vite.config.js
├── package.json
├── package-lock.json
└── README.md
```

The interface uses React 19, React Router 7, Vite 6, Tailwind CSS 4, and Lucide React icons. Reusable components keep page code approachable; the separate service layer gives future API integration a clear starting point.

## Demo data and privacy

Use **fictional details only**, including names, email addresses, phone numbers, and request notes. Browser storage is not suitable for real medical or contact information.

| Storage | Key | Contents |
| --- | --- | --- |
| `localStorage` | `bloodconnect.demo.v1` | Versioned demo registrations, demo requests, and edited profile |
| `sessionStorage` | `bloodconnect.session.v1` | Fixed `demo-active` marker only |

Passwords are never saved. Login/signup do not accept actual credentials or create a real account. The session marker belongs to the browser tab; saved demo records persist across reloads for the same browser origin. Different hosts or ports have separate storage.

Public search returns **only the fictional directory in `mockData.js`**, through an explicit safe-field allowlist. Locally submitted donor details never become public search results, and donor cards contain no phone numbers, emails, or private addresses. The dashboard shows locally saved demo requests alongside labeled fictional samples. Its statistics count the fixed sample data only.

To reset your records, open **Dashboard → Clear saved demo data → Yes, clear demo data**. This removes BloodConnect's local registrations, requests, and profile edits while leaving unrelated browser storage untouched. The sample directory and default fictional profile remain available. Clearing these records does not end the temporary session. Malformed saved data and disabled/full storage produce visible, actionable errors instead of false success messages.

Registration and request submissions do not contact donors, notify hospitals, arrange blood, or register anyone with a real blood bank. BloodConnect is not an emergency service. Qualified medical professionals must verify donor eligibility and transfusion compatibility; the blood group and age controls are demo form rules, not medical assessments.

## Service layer and future Spring Boot integration

Pages call synchronous functions in `src/services/demoService.js`. The current implementation makes **no REST calls**. A later backend can replace this module with asynchronous API functions and add loading/error handling in the pages.

| Current demo operation | Future API direction |
| --- | --- |
| Signup preview + `startDemoSession()` | New secure auth service using `POST /api/auth/register` |
| Login preview + `startDemoSession()` | New secure auth service using `POST /api/auth/login` |
| `getDonors(filters)` | `GET /api/donors` with approved public response fields |
| `saveDonor(values)` | `POST /api/donors` |
| `updateProfile(values)` | `PUT /api/donors/{id}` |
| `saveRequest(values)` | `POST /api/requests` |
| `getRequests()` | `GET /api/requests` with appropriately authorized response fields |
| `getProfile()` | Design an authorized profile read endpoint when the backend is added |
| `getSession()` / `endDemoSession()` | Replace the demo marker with the backend's authentication/session lifecycle |
| `clearDemoData()` | Demo-only local reset; production deletion needs its own design |

The future backend should handle server-side validation, authentication, authorization, consent, and private contact access before any real records are introduced. No Java, Spring Boot, MySQL, authentication server, or database configuration is included here.

## Verification

The original 14 service tests cover. They cover combined donor filters, exclusion of local/private donor details from public search, input validation and consent, request persistence, calendar dates, profile updates, corrupt records, storage quota failures without partial saves, disabled storage, fixed session behavior, safe clearing, and immutable returned sample copies.

Run `npm test` and `npm run build` after changes. The service suite does not replace browser checks. For manual verification, try each route, matching and empty donor searches, form validation and successful fictional submissions, read-only auth, dashboard edits and clearing, then check the mobile menu and keyboard navigation at desktop and phone widths.

The production build was verified successfully. Browser checks covered all eight pages; blood group, city, and availability filters; empty results and reset; registration and request validation/submission; persistence after reload; profile editing and availability changes; fixed demo login/signup and exit; confirmed clearing; FAQ expansion; footer anchors; and mobile navigation. All eight pages were checked at 390px, 768px, and 1440px without horizontal overflow. No application console errors were observed. Test records were cleared afterward.

For static hosting, configure a fallback to `index.html` so direct visits to React Router paths work. `npm run preview` is a local build preview, not a production hosting service.

## Visual assets and attribution

- `src/assets/donation-illustration.svg` is an original illustration authored for this project; it uses no third-party photographs.
- Typography: [DM Sans](https://fonts.google.com/specimen/DM+Sans) and [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display), loaded through Google Fonts in `index.html`. System font fallbacks are included when font requests are unavailable.
- Interface icons are provided by the `lucide-react` package.


## Platform redesign (12 October 2026)
Reference-inspired grouped navigation, donor hero with working search, fictional statistics, blood bank directory, camps, FAQ, contact preview, and openly accessible admin dashboard. Added routes: `/blood-banks`, `/camps`, `/faq`, `/contact`, `/admin`.

Directory and camp pages share `Directory.jsx`; FAQ/contact share `Resources.jsx`. No dependencies were added. `getDirectory()` in the demo service is the replacement point for future REST directory calls. Admin review marks are page-local simulations; contact validation sends and stores nothing.

Future stack: Java Spring Boot + JDBC + MySQL 8.4, database `bloodconnect_db`. This change contains frontend code only.


Redesign verification: production build succeeded; 16 service tests executed and passed. All 13 routes rendered without horizontal overflow at 390px, 768px, and 1440px. Browser interaction checks covered hero search, directory filters/details/empty/reset, camp city filtering, contact error/success validation, and admin review/undo/section navigation. No application console errors were observed. Original donor/request persistence and privacy tests remain passing.

Files changed: `src/App.jsx`, `src/pages/Home.jsx`, `src/pages/About.jsx`, `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/data/mockData.js`, `src/services/demoService.js`, `src/services/demoService.test.js`, `src/index.css`, and this README. Added only `Directory.jsx`, `Resources.jsx`, and `AdminDashboard.jsx` in `src/pages/`. Existing authentication, donor registration, request, and user dashboard components were retained.
