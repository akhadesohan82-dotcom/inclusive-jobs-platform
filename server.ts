import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "1.7.0", timestamp: new Date().toISOString() });
  });

  // AI Resume Optimizer Mock API
  app.post("/api/optimize-resume", (req, res) => {
    const { resumeText } = req.body;
    // Mocking AI processing
    const suggestions = [
      "Highlight your experience with screen readers and ARIA roles.",
      "Quantify your impact on accessibility compliance (e.g., 'Improved WCAG score by 40%').",
      "Add a dedicated 'Accessibility Skills' section.",
      "Mention specific accommodations you've successfully implemented in previous roles."
    ];
    res.json({ optimizedText: `[Optimized] ${resumeText}`, suggestions });
  });

  // Mock data for the backend
  const jobs = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      employerName: 'TechFlow Solutions',
      employerId: 'emp1',
      location: 'Remote',
      type: 'Full-time',
      salaryRange: '$120k - $160k',
      description: 'We are looking for a frontend expert who cares about accessibility.',
      providedAccommodations: ['Screen reader optimized', 'Flexible hours', 'Remote work'],
      postedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Accessibility Consultant',
      employerName: 'Inclusive Design Co',
      employerId: 'emp2',
      location: 'London, UK',
      type: 'Contract',
      salaryRange: '£500 - £700 / day',
      description: 'Help our clients build more inclusive products.',
      providedAccommodations: ['Sign language interpreters', 'Quiet workspace'],
      postedAt: new Date().toISOString()
    }
  ];

  app.get("/api/jobs", (req, res) => {
    res.json(jobs);
  });

  app.get("/api/resources", (req, res) => {
    res.json([
      {
        id: 'r1',
        title: 'Workplace Rights for People with Disabilities',
        category: 'Legal',
        description: 'A comprehensive guide to your rights under the ADA and other local regulations.',
        link: '#'
      },
      {
        id: 'r2',
        title: 'Top 5 Screen Readers for 2026',
        category: 'Tools',
        description: 'An updated comparison of the most effective screen reading software for professional use.',
        link: '#'
      }
    ]);
  });

  // WebSocket Server for Real-time Chat
  const wss = new WebSocketServer({ server: httpServer });
  wss.on('connection', (ws) => {
    console.log('Client connected to chat');
    ws.on('message', (message) => {
      // Broadcast to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
