# LCN Recruitment Portal

LCN Recruitment Portal is a responsive job search and recruitment management application built with React and Vite. It supports job discovery, filtering, bookmarking, applications, recruitment status tracking, analytics, and a local REST-style mock backend.

## Features

- Search jobs by keyword and location.
- Filter by category, employment type, experience level, and minimum salary.
- Sort jobs by newest, highest salary, or lowest salary.
- View job descriptions, requirements, benefits, skills, Indian locations, and salary bands.
- Display salaries with Indian comma grouping and no currency symbols, for example `1,50,000 - 1,85,000`.
- Save and remove bookmarked jobs with shared state and local persistence.
- Submit validated applications with React Hook Form.
- Track applications by `Applied`, `Under Review`, `Shortlisted`, and `Rejected` status.
- Update application statuses from the applications page and dashboard.
- Delete rejected applications after confirmation.
- View recruitment metrics, pipeline counts, and recent applications on the dashboard.
- Use loading, error, empty, and retry states across data-driven screens.
- Refresh application routes without receiving raw API JSON.
- Use a compact footer technical-stack summary and educational disclaimer.

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
Job-Recruitement-Management-System/
│
├── src/
│   ├── api/                 API clients for jobs, applications, and saved jobs
│   ├── components/          Shared UI, job, dashboard, and layout components
│   ├── context/             Saved jobs context and persistence
│   ├── hooks/               Reusable data-fetching hooks
│   ├── pages/               Home, jobs, details, applications, and dashboard views
│   ├── App.jsx              Shared layout and route definitions
│   ├── index.css            Global styles and Tailwind imports
│   └── main.jsx             React entry point
├── db.json                  Seed jobs, applications, and saved jobs
├── package.json             Project dependencies and npm scripts
├── vite.config.ts           Vite configuration and local API middleware
├── index.html               Browser document and metadata
├── metadata.json            Project metadata
├── README.md                Project documentation
└── screenshots/             Application screenshots
    ├── homepage.png
    ├── jobs.png
    ├── job_details.png
    ├── apply_job.png
    ├── saved_jobs.png
    ├── applications.png
    └── dashboard.png
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

The Vite configuration includes the local mock API middleware, so a separate backend is normally not required.

### Optional standalone JSON Server

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

## Screenshots

The `screenshots/` directory contains screenshots of the main application views:

- Home page
- Jobs directory
- Job details
- Application form
- Saved jobs
- Applications
- Recruitment dashboard

## GitHub

Repository: https://github.com/chinnamnaidu592/Job-Recruitement-Management-System

To save and publish future changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

## License

MIT License. This project is suitable for educational and commercial recruitment-management use.

## Disclaimer

This website is developed solely for educational and learning purposes. Content featured in regional languages is intended purely for entertainment.
