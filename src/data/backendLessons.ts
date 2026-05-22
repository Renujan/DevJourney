export interface BackendLesson {
  id: number;
  title: string;
  story: string;
  concept: string;
  sender: string;
  code: string;
  question: string;
  choices: {
    text: string;
    action: string;
    outcome: string;
    isCorrect: boolean;
    animationEffect?: 'ddos-loop' | 'hacker-matrix' | 'success' | 're-render';
  }[];
  explanation: string;
  interviewQ: string;
  interviewAnswer: string;
  xpReward: number;
}

export const backendLessons: BackendLesson[] = [
  {
    id: 1,
    title: "SQL Injection Prevention",
    story: "DevCorp's database was breached! A hacker bypassed our login screen without knowing any password. The logs show they passed a string containing quotes and OR statements.",
    concept: "SQL Injection & Parameterized Queries",
    sender: "Alex (Security Lead)",
    code: `// src/controllers/authController.ts
import { Request, Response } from 'express';
import { db } from '../database';

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  
  // Vulnerable SQL query construction:
  const query = "SELECT * FROM users WHERE user = '" + username + "' AND pass = '" + password + "'";
  
  const user = await db.query(query);
  if (user.length > 0) {
    res.json({ success: true, token: "jwt_token" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
}`,
    question: "Alex asks: 'How did the hacker bypass this and how do we prevent it?'",
    choices: [
      {
        text: "It was a brute-force attack. We just need to add a login cooldown.",
        action: "blame-bruteforce",
        outcome: "Alex shakes his head: 'No, the logs show only 1 request, which returned 200 OK. It wasn't brute force.'",
        isCorrect: false,
        animationEffect: "re-render"
      },
      {
        text: "Simulate hacker injection: Inject username: admin' OR '1'='1",
        action: "simulate-sql",
        outcome: "HACKED: The final SQL becomes: SELECT * FROM users WHERE user = 'admin' OR '1'='1' AND pass = '...'. Since '1'='1' is always true, the database bypasses password validation and returns the admin profile! Matrix neon code rain floods the screen!",
        isCorrect: false,
        animationEffect: "hacker-matrix"
      },
      {
        text: "Use parameterized queries (Prepared statements).",
        action: "solve-sql",
        outcome: "Success! Parameterized queries ensure the database treats input as literal parameters rather than executable SQL code, stopping injection cold.",
        isCorrect: true,
        animationEffect: "success"
      }
    ],
    explanation: "SQL injection occurs when user input is concatenated directly into SQL statements, allowing input to alter the structure of the SQL query. Parameterized queries (or prepared statements) compile the SQL query template first, then bind the parameters safely, ensuring user input is never executed as SQL command segments.",
    interviewQ: "How does a parameterized query prevent SQL injection?",
    interviewAnswer: "Parameterized queries separate the query code from the query parameters. The SQL command is pre-compiled, and the database driver ensures that the parameters are treated strictly as data literals, never as executable code.",
    xpReward: 10
  },
  {
    id: 2,
    title: "Rate Limiting & DDOS Protection",
    story: "DevCorp's public API endpoints are buckling under load. An anonymous script is scraping product data at 100 requests per second, exhausting database connections and slowing down normal traffic.",
    concept: "Rate Limiting & Resource Exhaustion",
    sender: "Sarah (DevOps Engineer)",
    code: `// src/server.ts
import express from 'express';
import { getProducts } from './products';

const app = express();

// Public API Route
app.get('/api/products', getProducts);

app.listen(3000);`,
    question: "Sarah asks: 'What middleware should we inject here to restrict abuse from single IP addresses without affecting standard customers?'",
    choices: [
      {
        text: "Store IP addresses in a local array and block manually.",
        action: "manual-ip-block",
        outcome: "Sarah comments: 'Storing this in-memory in a raw array will crash the server and isn't scalable across instances. Think middleware.'",
        isCorrect: false,
        animationEffect: "re-render"
      },
      {
        text: "Simulate a scraping attack.",
        action: "simulate-ddos",
        outcome: "WARNING: Running a loop of 1000 requests. DB connection pool exhausted (Error 504: Gateway Timeout). Server responses slow down to 12,000ms. Server is unresponsive!",
        isCorrect: false,
        animationEffect: "ddos-loop"
      },
      {
        text: "Inject express-rate-limit middleware.",
        action: "solve-rate-limiting",
        outcome: "Success! Integrating a rate-limiter blocks any IP exceeding 100 requests per 15 minutes, returning a clean 429 Too Many Requests error and shielding resources.",
        isCorrect: true,
        animationEffect: "success"
      }
    ],
    explanation: "Rate limiting is a defense mechanism that restricts the number of requests a client can make in a given timeframe. Using a standard middleware like `express-rate-limit` prevents scrapers and automated attacks from hogging server resources, maintaining uptime and performance for legitimate clients.",
    interviewQ: "Explain how rate limiting works and why it is important.",
    interviewAnswer: "Rate limiting tracks request rates (often via Token Bucket or sliding-window logs matched to IPs or User Tokens) and blocks clients exceeding limits (returning HTTP 429). It prevents Denial of Service (DoS) attacks, brute-forcing, scraping, and database exhaustion.",
    xpReward: 10
  }
];
