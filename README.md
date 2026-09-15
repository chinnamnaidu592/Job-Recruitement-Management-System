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
│   │   │   ├── ErrorState.jsx      # Error banner with retry trigger
│   │   │   └── EmptyState.jsx      # Empty result message with call-to-action
│   │   ├── jobs/
│   │   │   ├── JobCard.jsx         # Card showing company, salary, tags, save toggle & link
│   │   │   ├── CategoryCard.jsx    # Department card routing to /jobs?category=...
│   │   │   ├── SearchBar.jsx       # Controlled keyword and location search
│   │   │   └── FilterPanel.jsx     # Controlled filters (type, exp, category, salary, remote)
│   │   └── dashboard/
│   │       ├── DashboardCard.jsx   # Metrics KPI card component
│   │       └── ApplicationCard.jsx # Application card with candidate details & status updater
│   ├── pages/
│   │   ├── Home.jsx                # Landing page with hero, search, categories & featured roles
│   │   ├── JobsListing.jsx         # Jobs listing with URL query parameter synchronization
│   │   ├── JobDetails.jsx          # Single job view with full requirements & perks
│   │   ├── ApplyJob.jsx            # React Hook Form application submission
│   │   ├── SavedJobs.jsx           # Bookmarked jobs management
│   │   ├── MyApplications.jsx      # Joined applications list with status filtering
│   │   ├── Dashboard.jsx           # Analytics, funnel metrics & recent submissions
│   │   └── NotFound.jsx            # 404 fallback page
│   ├── context/
│   │   └── SavedJobsContext.jsx    # Global saved jobs state & persistence
│   ├── hooks/
│   │   └── useFetch.js             # Reusable async data fetching hook
│   ├── App.jsx                     # Route definitions & shared layout shell
│   ├── main.jsx                    # React root entry point with BrowserRouter
│   └── index.css                   # Tailwind CSS imports and base styles
├── db.json                         # Seed REST API database (jobs, applications, savedJobs)
├── index.html                      # HTML entry point with Plus Jakarta Sans typography
├── package.json                    # Project dependencies and run scripts
├── vite.config.ts                  # Vite config with integrated JSON mock server plugin
├── .env.example                    # Environment variable template
└── README.md                       # Documentation & setup instructions
```

---

## 🚀 Getting Started

### 1. Installation

Clone or extract the repository and install dependencies:

```bash
npm install
```

### 2. Running JSON Server (Local REST API)

Start the JSON Server on port 5000:

```bash
npx json-server --watch db.json --port 5000
# or use the shorthand script:
npm run server
```

### 3. Running the React Application

In a separate terminal window, launch the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the configured host port).

---

## 🌐 Routes Overview

| Route | Page | Description |
|---|---|---|
| `/` | `Home` | Landing page with Hero search, categories, and featured jobs |
| `/jobs` | `JobsListing` | Search & filter jobs; synchronized with URL query params |
| `/jobs/:id` | `JobDetails` | Single job view with complete requirements and benefits |
| `/apply/:id` | `ApplyJob` | Application form with React Hook Form validation |
| `/saved-jobs` | `SavedJobs` | List of bookmarked jobs with removal capability |
| `/applications` | `MyApplications` | Track submitted applications and update statuses |
| `/dashboard` | `Dashboard` | Analytics, KPI cards, and application pipeline funnel |
| `*` | `NotFound` | 404 error page with navigation shortcuts |

---

## 📸 Screenshots (Placeholders)

- **Job Portal Home**: Hero search bar, featured engineering roles, and category tracks.
- **Jobs Directory**: Side-by-side filter panel and responsive job card results.
- **Job Details**: Full job requirements, salary bands, and Apply/Save CTAs.
- **Application Submission**: React Hook Form with real-time field validation.
- **Recruitment Dashboard**: Application pipeline conversion rates and recent candidates.

---

## 📄 License

MIT License. Open for educational and commercial recruitment management use.
