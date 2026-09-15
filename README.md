# LCN Recruitment Portal

A production-quality, fully responsive Job Portal and Recruitment Management System built with React, Vite, Tailwind CSS, Axios, React Router v6+, React Hook Form, and backed by a JSON Server REST mock backend (`db.json`).

---

## 🌟 Key Features

1. **Job Search & Advanced Multi-Parameter Filtering**
   - Live query-parameter driven search by keywords, job titles, or companies.
   - Granular filters by Category (Frontend, Backend, Full Stack, UI/UX, Data Science, DevOps, Mobile), Employment Type (Full-Time, Part-Time, Contract, Internship), Experience Level (Entry Level, Mid Level, Senior, Lead), and Minimum Annual Compensation ($60k - $160k+).
   - Filter state is synchronized directly with URL query parameters for shareable search states.
   - Quick search chips and sorting by Most Recent, Highest Salary, and Lowest Salary.

2. **Rich Job Details & Direct Bookmarking**
   - Deep-linkable job pages (`/jobs/:id`) showing complete role overview, itemized requirements, technical skills tags, compensation, perks, and recruiter status.
   - Instant bookmark/save toggle that persists across the app via React Context and local caching.
   - Single-click URL sharing.

3. **Validated Application Submission Workflow**
   - Dedicated application submission route (`/apply/:id`) powered by **React Hook Form**.
   - Strict validation rules with inline error messages (email regex, phone number formatting, character limits, resume/portfolio URL format).
   - Real-time submission via `applicationsApi.createApplication` (POST to `/applications`) with immediate confirmation and links to track candidacies.

4. **Saved Jobs Management**
   - Dedicated bookmarked roles page (`/saved-jobs`) with live counts in the navigation bar.
   - Instant removal and direct application buttons.

5. **Recruitment Status Pipeline & Application Tracking**
   - Candidates track applications with dynamic status tags:
     - `Applied` (Blue)
     - `Under Review` (Amber)
     - `Shortlisted` (Emerald)
     - `Rejected` (Rose)
   - Status update control allowing hiring managers or reviewers to test candidate lifecycle state changes live (`PATCH /applications/:id`).

6. **Executive Recruitment Analytics Dashboard**
   - Real-time KPI summary cards: Total Applied, Under Review, Shortlisted, Rejected.
   - Pipeline conversion rate and visual status distribution bar.
   - Quick-access preview cards for recent applications and saved jobs.

7. **Error, Loading & Empty States**
   - Dedicated presentational components (`LoadingState`, `ErrorState`, `EmptyState`) across every data-driven view with retry actions.

8. **Dual REST Architecture (Local & Preview Resilient)**
   - Fully compatible with `npx json-server --watch db.json --port 5000`.
   - Includes Vite middleware integration so the app works seamlessly in cloud sandbox environments without requiring manual background processes.

---

## 🛠️ Technologies Used

- **Frontend Core**: React 19 (Functional Components & Hooks), Vite 6
- **Routing**: React Router DOM (v7/v6+) with URL query params and route params
- **Styling**: Tailwind CSS with responsive breakpoints and custom styling
- **Form Management & Validation**: React Hook Form
- **HTTP Client**: Axios with centralized API service layer and normalized error handling
- **State Management**: React Context API (`SavedJobsContext`) with LocalStorage persistence
- **Mock REST API**: JSON Server (`db.json`)
- **Iconography**: Lucide React

---

## 📁 Folder Structure

```
workpulse/
├── src/
│   ├── api/
│   │   ├── axiosClient.js          # Centralized Axios instance with base URL & error interceptor
│   │   ├── jobsApi.js              # getJobs(params), getJobById(id)
│   │   ├── applicationsApi.js      # getApplications(), createApplication(), updateApplicationStatus()
│   │   └── savedJobsApi.js         # getSavedJobs(), saveJob(), removeSavedJob()
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Responsive sticky nav with active link indicators & badges
│   │   │   └── Footer.jsx          # Portal footer with links, categories & tech stack info
│   │   ├── common/
│   │   │   ├── Button.jsx          # Reusable button with variants, sizes & loading states
│   │   │   ├── StatusBadge.jsx     # Dynamic status badge with color tokens
│   │   │   ├── LoadingState.jsx    # Presentational loading spinner & skeleton views
# LCN Recruitment Portal

LCN Recruitment Portal is a responsive job search and recruitment management application built with React and Vite. It supports job discovery, filtering, bookmarking, applications, recruitment status tracking, analytics, and a local REST-style mock backend.

## Features

- Search jobs by keyword and location.
- Filter by category, employment type, experience level, and minimum salary.
- Sort jobs by newest, highest salary, or lowest salary.
- View detailed job descriptions, requirements, benefits, skills, Indian locations, and salary bands.
- Display salaries using Indian comma grouping without currency symbols, for example `1,50,000 - 1,85,000`.
- Save and remove bookmarked jobs with shared application state and local persistence.
- Submit validated applications with React Hook Form.
- Track applications by `Applied`, `Under Review`, `Shortlisted`, and `Rejected` status.
- Update application statuses from the applications page and dashboard.
- Delete rejected applications after confirmation.
- View recruitment metrics, pipeline counts, and recent applications on the dashboard.
- Use retry, loading, and empty states across data-driven screens.
- Open application routes directly or refresh them without receiving raw API JSON.
- Use the footer technical-stack summary and educational disclaimer.

## Technology

- React 19
- Vite 6
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- Lucide React
- JSON Server-compatible mock API powered by Vite middleware

## Project Structure

```text
src/
├── api/                 API clients for jobs, applications, and saved jobs
├── components/
│   ├── common/          Buttons, states, and status badges
│   ├── dashboard/       Dashboard metrics and application cards
│   ├── jobs/            Search, filters, job cards, and categories
│   └── layout/          Navbar and footer
├── context/             Saved jobs context and persistence
├── hooks/               Reusable data-fetching hooks
├── pages/               Home, jobs, details, applications, and dashboard views
├── App.jsx              Shared layout and route definitions
├── index.css            Global styles and Tailwind imports
└── main.jsx             React entry point
db.json                  Seed jobs, applications, and saved jobs
vite.config.ts           Vite configuration and local API middleware
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the application

```bash
npm run dev
```

The development server uses port `3000` by default. If that port is already occupied, Vite automatically selects the next available port and prints the URL in the terminal.

### Optional standalone JSON Server

The Vite configuration includes the mock API middleware, so a separate backend is normally not required. To run JSON Server independently instead:

```bash
npm run server
```

The standalone API runs on `http://localhost:5000`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run server` | Start JSON Server on port 5000 |
| `npm run lint` | Run the TypeScript compiler check |
| `npm run clean` | Remove generated build/server files |

## Routes

| Route | Description |
|---|---|
| `/` | Home page with search, categories, and featured jobs |
| `/jobs` | Searchable and filterable job directory |
| `/jobs/:id` | Detailed job information and actions |
| `/apply/:id` | Validated application form |
| `/saved-jobs` | Saved job list |
| `/applications` | Application tracking and status management |
| `/dashboard` | Recruitment analytics and recent applications |

## API Operations

The API client uses these local endpoints:

- `GET /jobs`
- `GET /jobs/:id`
- `GET /applications`
- `POST /applications`
- `PATCH /applications/:id`
- `DELETE /applications/:id`
- `GET /savedJobs`
- `POST /savedJobs`
- `DELETE /savedJobs/:id`

Application deletion is exposed in the UI only for applications whose status is `Rejected`.

## GitHub

The project repository is:

https://github.com/chinnamnaidu592/Job-Recruitement-Management-System

Typical workflow for future changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```


## Disclaimer

This website is developed solely for educational and learning purposes. Content featured in regional languages is intended purely for entertainment.
