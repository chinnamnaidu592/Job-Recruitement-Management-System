import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function jsonServerPlugin(): Plugin {
  const getDb = () => {
    const dbPath = path.resolve(__dirname, 'db.json');
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }
    return { jobs: [], applications: [], savedJobs: [] };
  };

  const saveDb = (data: any) => {
    const dbPath = path.resolve(__dirname, 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  };

  const parseBody = (req: any): Promise<any> => {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  };

  return {
    name: 'json-server-mock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const pathname = url.pathname;

        // Let React Router handle direct page visits such as /applications and /jobs/1.
        if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
          return next();
        }

        if (
          !pathname.startsWith('/jobs') &&
          !pathname.startsWith('/applications') &&
          !pathname.startsWith('/savedJobs')
        ) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        try {
          const db = getDb();

          // JOBS
          if (pathname === '/jobs' && req.method === 'GET') {
            let jobs = [...(db.jobs || [])];
            const search = url.searchParams.get('search')?.toLowerCase();
            const location = url.searchParams.get('location')?.toLowerCase();
            const category = url.searchParams.get('category')?.toLowerCase();
            const jobType = url.searchParams.get('jobType')?.toLowerCase();
            const experience = url.searchParams.get('experience')?.toLowerCase();
            const salary = url.searchParams.get('salary');

            if (search) {
              jobs = jobs.filter(
                (j) =>
                  j.title?.toLowerCase().includes(search) ||
                  j.company?.toLowerCase().includes(search) ||
                  j.description?.toLowerCase().includes(search) ||
                  j.skills?.some((s: string) => s.toLowerCase().includes(search))
              );
            }
            if (location) {
              jobs = jobs.filter((j) => j.location?.toLowerCase().includes(location));
            }
            if (category) {
              jobs = jobs.filter((j) => j.category?.toLowerCase() === category);
            }
            if (jobType) {
              jobs = jobs.filter((j) => j.jobType?.toLowerCase() === jobType);
            }
            if (experience) {
              jobs = jobs.filter((j) => j.experience?.toLowerCase() === experience);
            }
            if (salary) {
              const minSal = parseInt(salary, 10);
              if (!isNaN(minSal)) {
                jobs = jobs.filter((j) => (j.salaryMax || 0) >= minSal);
              }
            }

            res.statusCode = 200;
            return res.end(JSON.stringify(jobs));
          }

          const jobMatch = pathname.match(/^\/jobs\/([a-zA-Z0-9_-]+)$/);
          if (jobMatch && req.method === 'GET') {
            const id = jobMatch[1];
            const job = (db.jobs || []).find((j: any) => String(j.id) === String(id));
            if (!job) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'Job not found' }));
            }
            res.statusCode = 200;
            return res.end(JSON.stringify(job));
          }

          // APPLICATIONS
          if (pathname === '/applications' && req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(db.applications || []));
          }

          if (pathname === '/applications' && req.method === 'POST') {
            const body = await parseBody(req);
            const newApp = {
              id: body.id || `app-${Date.now()}`,
              jobId: String(body.jobId),
              candidateName: body.candidateName || '',
              email: body.email || '',
              phone: body.phone || '',
              experience: body.experience || '',
              resumeUrl: body.resumeUrl || '',
              coverLetter: body.coverLetter || '',
              skills: body.skills || '',
              appliedDate: body.appliedDate || new Date().toISOString().split('T')[0],
              status: body.status || 'Applied',
            };
            db.applications = [newApp, ...(db.applications || [])];
            saveDb(db);
            res.statusCode = 201;
            return res.end(JSON.stringify(newApp));
          }

          const appMatch = pathname.match(/^\/applications\/([a-zA-Z0-9_-]+)$/);
          if (appMatch) {
            const id = appMatch[1];
            const appIndex = (db.applications || []).findIndex((a: any) => String(a.id) === String(id));

            if (req.method === 'GET') {
              if (appIndex === -1) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: 'Application not found' }));
              }
              res.statusCode = 200;
              return res.end(JSON.stringify(db.applications[appIndex]));
            }

            if (req.method === 'PATCH' || req.method === 'PUT') {
              if (appIndex === -1) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: 'Application not found' }));
              }
              const body = await parseBody(req);
              db.applications[appIndex] = { ...db.applications[appIndex], ...body };
              saveDb(db);
              res.statusCode = 200;
              return res.end(JSON.stringify(db.applications[appIndex]));
            }

            if (req.method === 'DELETE') {
              if (appIndex === -1) {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: 'Application not found' }));
              }
              db.applications.splice(appIndex, 1);
              saveDb(db);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true }));
            }
          }

          // SAVED JOBS
          if (pathname === '/savedJobs' && req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(db.savedJobs || []));
          }

          if (pathname === '/savedJobs' && req.method === 'POST') {
            const body = await parseBody(req);
            const exists = (db.savedJobs || []).some((item: any) => String(item.id) === String(body.id));
            if (!exists) {
              db.savedJobs = [...(db.savedJobs || []), body];
              saveDb(db);
            }
            res.statusCode = 201;
            return res.end(JSON.stringify(body));
          }

          const savedMatch = pathname.match(/^\/savedJobs\/([a-zA-Z0-9_-]+)$/);
          if (savedMatch && req.method === 'DELETE') {
            const id = savedMatch[1];
            db.savedJobs = (db.savedJobs || []).filter((item: any) => String(item.id) !== String(id));
            saveDb(db);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true }));
          }

          next();
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), jsonServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : { ignored: ['**/screenshots/**'] },
    },
  };
});
