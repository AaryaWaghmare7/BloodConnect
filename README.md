# BloodConnect

A Java and MySQL-based blood donation management system with a modern React frontend, designed to connect donors, blood requests, and blood banks.

BloodConnect is a college mini-project developed by a team of three students. The React frontend is implemented; the Java + JDBC backend and MySQL integration are in progress. This repository currently contains the frontend only.

## Purpose and objectives

- Make donor discovery and blood request information easier to explore.
- Bring potential donors, blood banks, and donation camps into one accessible interface.
- Apply software engineering and DBMS concepts in a practical team project.
- Design clear privacy boundaries and reusable data services for later backend integration.

## Features and current status

| Implemented frontend | Current behaviour |
| --- | --- |
| Home and navigation | Responsive landing page, working search, calls to action, and labeled sample statistics |
| Find Donors | Blood group, city, and simulated availability filters; fictional public profiles without contact details |
| Donor registration | Validated form, consent, browser-only records, and success/error feedback |
| Request Blood | Validated fictional requests saved in the current browser |
| Blood banks and camps | Searchable fictional directories and expandable listing details |
| Login and signup | Fixed read-only fictional credentials opening a demo session |
| User dashboard | Demo profile editing, availability preference, recent requests, and saved-data reset |
| Admin dashboard | Publicly accessible simulation with overview tabs and temporary review marks |
| About, FAQ, and Contact | Project information, expandable answers, and contact form validation without sending messages |

**Planned:** Java REST APIs, JDBC persistence, secure authentication and role-based authorization, server-side validation, verified organisations, and integration with MySQL. Frontend login and the admin preview do not provide production security.

## Technology stack

| Layer | Technology | Status |
| --- | --- | --- |
| Frontend | React 19, Vite 6, JavaScript, Tailwind CSS 4, React Router 7, Lucide icons | Implemented |
| Backend | Java, Spring Boot REST APIs, JDBC | Upcoming / integration in progress |
| Database | MySQL 8.4; `bloodconnect_db` | Database created locally; application integration planned |
| Collaboration | Git and GitHub pull requests | Repository workflow |

## Project structure

```text
BloodConnect/
├── README.md
├── .gitignore
└── frontend/
    ├── public/                 # Favicon and public assets
    ├── src/
    │   ├── assets/             # Original donation illustration
    │   ├── components/         # Shared navigation, fields, cards, and buttons
    │   ├── data/               # Fictional sample records
    │   ├── pages/              # Application pages and dashboards
    │   ├── services/           # Demo data access and service tests
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── README.md               # Frontend routes and service documentation
```

Backend source and database schema files will be added when implemented; no empty backend scaffolding is included.

## Run the frontend

Install Node.js 22 or newer with npm and Git. Contributors need access to this private repository before cloning.

```sh
git clone https://github.com/AaryaWaghmare7/BloodConnect.git
cd BloodConnect/frontend
npm ci
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. No database connection or credentials are required for the current frontend. Stop the server with `Ctrl+C`.

```sh
npm run build    # Generate the production build
npm run preview  # Preview the build locally
npm test         # Run demo service tests
```

See [frontend/README.md](frontend/README.md) for routes, storage keys, and future API mappings.

## Java + MySQL roadmap

1. Define relational schemas for donors, blood requests, blood banks, camps, and user roles.
2. Implement Java REST endpoints using Spring Boot and JDBC with parameterized queries.
3. Connect to MySQL 8.4 (`bloodconnect_db`) using environment-based configuration; never commit credentials.
4. Add server-side validation, secure password hashing, authentication, and authorization.
5. Replace browser demo services with asynchronous REST calls and loading/error states.
6. Add integration tests and workflows for organisation verification and private contact access.

## DBMS concepts covered / planned

The frontend explores the domain records and relationships. DBMS implementation is planned, rather than demonstrated by the current code.

- Entity–relationship modelling and conversion to relational tables.
- Primary keys, foreign keys, integrity constraints, and normalization.
- SQL CRUD operations, joins, filtering, and aggregate queries.
- JDBC connections and prepared statements.
- Transactions, rollback, and consistency for related updates.
- Indexing, role-based data access, and protection of sensitive information.

## Team collaboration

Keep `main` stable. Each contributor works on a separate feature branch and opens a pull request for review by another teammate.

Before starting a feature, from the repository root with a clean working tree:

```sh
git switch main
git pull --ff-only origin main
git switch -c feature/your-name-feature
```

After completing the change:

```sh
cd frontend
npm run build
npm test
cd ..
git add <changed-files>
git commit -m "Describe the completed change"
git push -u origin feature/your-name-feature
```

Open a pull request into `main`, explain the change and validation, and resolve review feedback before merging. Pull regularly, coordinate before changing shared files, and never force-push shared branches. Collaborator invitations will be added after the team provides its GitHub usernames.

## Team

| Member | GitHub | Responsibilities |
| --- | --- | --- |
| Student 1 | To be added | To be assigned |
| Student 2 | To be added | To be assigned |
| Student 3 | To be added | To be assigned |

## Future improvements

- Connect the frontend to Java and MySQL services.
- Replace fictional listings with verified data and appropriate permissions.
- Improve request tracking, organisation management, and accessibility.
- Introduce automated build checks for pull requests after the team agrees on its workflow.

## Demonstration data and privacy

All sample people, blood banks, camps, availability, and statistics are fictional. Use fictional details in every form. Registrations and requests stay in browser localStorage; demo sessions use a fixed sessionStorage marker. Passwords are never persisted. Public donor cards do not expose contact details.

This prototype does not notify hospitals, arrange blood, confirm donor eligibility, or establish transfusion compatibility. Qualified medical professionals must verify eligibility and compatibility. BloodConnect is not an emergency service.

Do not commit passwords, API keys, database dumps containing personal records, or real medical/contact information. Keep local secrets in ignored environment files; safe example files must contain placeholders only.
