export interface ErrorCase {
  code: string;
  title: string;
  story: string;
  why: string;
  howToFix: string;
  codeSnippet: string;
  fixedSnippet: string;
  interviewExplanation: string;
  animation: 'broken-ui' | 'locked-screen' | 'exploding-server' | 'firewall-block' | 'info-pulse' | 'success-glow' | 'redirect-arrow';
  xpReward: number;
}

export const errorCases: ErrorCase[] = [
  // --- 1xx Informational ---
  {
    code: "100",
    title: "Continue",
    story: "DevCorp's file uploader starts sending large assets in chunks. The client waits for a server handshake acknowledgment before streaming the actual binary payload.",
    why: "The client sends an 'Expect: 100-continue' header. The server checks headers (like authentication or content-length) and responds with 100 to signal that the client can proceed to send the body.",
    howToFix: "Configure the backend Express or HTTP server to correctly process the 'Expect: 100-continue' event, verifying request permissions before sending the continue header.",
    codeSnippet: `// Client uploading large files without Expect check
fetch('/api/upload', {
  method: 'POST',
  body: largeBlob // Server might reject after entire upload finishes!
});`,
    fixedSnippet: `// Client requesting header validation check first
fetch('/api/upload', {
  method: 'POST',
  headers: { 'Expect': '100-continue' },
  body: largeBlob
});`,
    interviewExplanation: "A 100 Continue status means the server has received the initial request headers and the client should proceed to send the request body. It helps save bandwidth by avoiding sending large payloads if the server will reject the request based on headers alone.",
    animation: "info-pulse",
    xpReward: 20
  },
  {
    code: "101",
    title: "Switching Protocols",
    story: "The DevCorp real-time chat client needs to establish a persistent bi-directional connection. The browser initiates an HTTP handshake requesting WebSocket access.",
    why: "The server accepts the protocol upgrade request (HTTP/1.1 upgraded to WS) and responds with status code 101.",
    howToFix: "Ensure the server-side WebSocket library (like ws or socket.io) intercepts the upgrade request and responds with correct handshake headers.",
    codeSnippet: `// Standard polling request
setInterval(() => {
  fetch('/api/chat/messages').then(res => res.json()); // Network overhead!
}, 1000);`,
    fixedSnippet: `// Upgrade connection to WebSocket
const socket = new WebSocket('ws://localhost:8080/chat');
socket.onmessage = (event) => {
  displayMessage(JSON.parse(event.data));
};`,
    interviewExplanation: "101 Switching Protocols indicates the server is switching protocols as requested by the client in the Upgrade header. Commonly seen when upgrading a standard HTTP connection to a WebSockets stream for real-time applications.",
    animation: "info-pulse",
    xpReward: 20
  },

  // --- 2xx Success ---
  {
    code: "200",
    title: "OK",
    story: "A user visits their DevCorp employee profile page. The dashboard loads details instantly and updates the UI.",
    why: "The GET request to '/api/profile' was processed successfully by the controller, which returned the corresponding JSON data structure.",
    howToFix: "No fix needed; this is the successful standard response for GET/PUT/POST operations.",
    codeSnippet: `// Route returning data
app.get('/api/profile', (req, res) => {
  res.send('Profile Data'); // Not structured JSON
});`,
    fixedSnippet: `// Standard JSON success payload
app.get('/api/profile', (req, res) => {
  res.status(200).json({ status: 'success', data: userProfile });
});`,
    interviewExplanation: "200 OK is the standard HTTP response status code for a successful request. The actual meaning depends on the HTTP method used (GET loads resource, POST returns output, PUT updates resource).",
    animation: "success-glow",
    xpReward: 20
  },
  {
    code: "201",
    title: "Created",
    story: "A manager creates a new job ticket on the task board. The task is saved into the database, and the client receives confirmation along with the new ticket ID.",
    why: "The request has succeeded and led to the creation of a new resource (usually a database insert from a POST request).",
    howToFix: "Return status code 201 instead of 200 upon successful creation of a resource, preferably including the Location header pointing to the new resource.",
    codeSnippet: `// Submitting form data
app.post('/api/tickets', (req, res) => {
  db.insert(req.body);
  res.status(200).json({ msg: 'done' }); // Should be 201 for resource creation!
});`,
    fixedSnippet: `// Returning 201 Created and resource pointer
app.post('/api/tickets', (req, res) => {
  const newTicket = db.insert(req.body);
  res.status(201)
     .header('Location', \`/api/tickets/\${newTicket.id}\`)
     .json(newTicket);
});`,
    interviewExplanation: "201 Created indicates the request has succeeded and led to the creation of a resource. Good API design dictates returning a 201 status code along with the URI/path of the newly created item.",
    animation: "success-glow",
    xpReward: 20
  },
  {
    code: "202",
    title: "Accepted",
    story: "An admin requests a generation of the yearly CSV financial audit spreadsheet. Because processing takes 5 minutes, the server queue accepts the job and returns immediately.",
    why: "The request has been accepted for processing, but the processing has not been completed. It is designed for asynchronous background workers.",
    howToFix: "Respond with 202 and supply a status lookup URL or token so the client can query progress asynchronously.",
    codeSnippet: `// Long-running route blocks request thread
app.post('/api/report', async (req, res) => {
  await generateHugeCsvReport(); // Hangs client request for minutes!
  res.json({ done: true });
});`,
    fixedSnippet: `// Asynchronously trigger job and return 202 Accepted
app.post('/api/report', (req, res) => {
  const jobId = queue.addJob('csv-report');
  res.status(202).json({
    status: 'Processing',
    checkProgress: \`/api/jobs/\${jobId}\`
  });
});`,
    interviewExplanation: "202 Accepted indicates the request has been received but not yet acted upon. It is non-committal, meaning the server cannot return the final result immediately. Use this to handle background tasks and prevent HTTP connection timeouts.",
    animation: "success-glow",
    xpReward: 20
  },
  {
    code: "204",
    title: "No Content",
    story: "A developer clicks the 'Clear notification log' button. The database rows are wiped out, and the UI clears. No data payload is returned by the server.",
    why: "The server successfully fulfilled the request and there is no additional content to send in the response payload body.",
    howToFix: "Return 204 status code (with no body) for successful DELETE operations, or PUT updates that don't need to return updated state details.",
    codeSnippet: `// Route returning unnecessary strings
app.delete('/api/logs', (req, res) => {
  db.clearLogs();
  res.json({ message: 'Success' }); // Sending unnecessary body content
});`,
    fixedSnippet: `// Returning 204 No Content
app.delete('/api/logs', (req, res) => {
  db.clearLogs();
  res.status(204).send(); // No response body returned
});`,
    interviewExplanation: "204 No Content indicates the server processed the request but does not need to return any body content. This is commonly used in REST APIs for DELETE operations or preflight CORS requests.",
    animation: "success-glow",
    xpReward: 20
  },

  // --- 3xx Redirection ---
  {
    code: "300",
    title: "Multiple Choices",
    story: "A user tries to download an older version of DevCorp SDK docs. The server returns a list of formats available: PDF, HTML, and Markdown.",
    why: "The request has more than one possible response. The user agent or user should choose one of them.",
    howToFix: "Respond with status code 300 and a body listing the representations and their links so the client can programmatically or manually choose.",
    codeSnippet: `// Hardcoded format redirect
app.get('/api/sdk/docs', (req, res) => {
  res.redirect('/docs/index.html'); // Forces HTML without format choices!
});`,
    fixedSnippet: `// Return choices of documents
app.get('/api/sdk/docs', (req, res) => {
  res.status(300).json({
    choices: [
      { format: 'pdf', url: '/docs/v1.pdf' },
      { format: 'html', url: '/docs/v1.html' },
      { format: 'markdown', url: '/docs/v1.md' }
    ]
  });
});`,
    interviewExplanation: "300 Multiple Choices is a redirection code indicating that the requested resource corresponds to any one of a set of representations, each with its own specific location. The client can select its preferred format.",
    animation: "redirect-arrow",
    xpReward: 20
  },
  {
    code: "301",
    title: "Moved Permanently",
    story: "DevCorp migrates their old blog site '/company-news' to a new subdomain 'https://blog.devcorp.com'. The server must redirect legacy search engines.",
    why: "The URL of the requested resource has been changed permanently. The new URL is given in the Location response header.",
    howToFix: "Use a 301 redirection so browsers and search engines update their index databases cache to point to the new URL.",
    codeSnippet: `// Rendering old page warning
app.get('/company-news', (req, res) => {
  res.send('We have moved! Please visit blog.devcorp.com'); // Bad SEO!
});`,
    fixedSnippet: `// 301 Permanent Redirect
app.get('/company-news', (req, res) => {
  res.status(301)
     .header('Location', 'https://blog.devcorp.com')
     .send();
});`,
    interviewExplanation: "301 Moved Permanently means the target resource has been assigned a new permanent URI. Search engines (like Google crawler) will transfer link authority (SEO juice) to the new URI.",
    animation: "redirect-arrow",
    xpReward: 20
  },
  {
    code: "302",
    title: "Found (Temporary Redirect)",
    story: "A user tries to access '/dashboard' but is not authenticated. The portal redirects them to '/login' temporarily.",
    why: "The resource requested resides temporarily under a different URL. The client should continue to use the original URI for future requests.",
    howToFix: "Respond with 302 and a Location header pointing to the login page.",
    codeSnippet: `// Simple response block
app.get('/dashboard', (req, res) => {
  if (!isAuthenticated(req)) {
    res.send('Please login first.'); // User stays on dashboard URL
  }
});`,
    fixedSnippet: `// 302 Temporary Redirect to Login
app.get('/dashboard', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(302).header('Location', '/login').send();
  }
  res.send('Dashboard Contents');
});`,
    interviewExplanation: "302 Found (previously 'Moved Temporarily') indicates that the resource is temporarily located at a different URL. Unlike 301, SEO search engines do not update their links to the new location.",
    animation: "redirect-arrow",
    xpReward: 20
  },
  {
    code: "304",
    title: "Not Modified",
    story: "The DevCorp client app requests the static logo image file again. The client sends a request containing the cached ETag token header, and receives a tiny blank response.",
    why: "The cached version of the resource on the client browser is still identical to the server's version. No need to download the file again.",
    howToFix: "Enable HTTP caching on your server (like Nginx or Express static files) to check If-None-Match headers and return a 304 without response bodies.",
    codeSnippet: `// Sending entire file data every time
app.get('/logo.png', (req, res) => {
  res.sendFile('/assets/logo.png'); // Ignores browser cache headers!
});`,
    fixedSnippet: `// Serving static files with ETag checking (Automatic in Express static)
app.use(express.static('public', {
  etag: true, // Enables ETag headers
  maxAge: '1d' // Cache duration
}));`,
    interviewExplanation: "304 Not Modified tells the client that the cached copy is still valid. The server sends no payload body, saving network bandwidth and speeding up website load speeds significantly.",
    animation: "redirect-arrow",
    xpReward: 20
  },

  // --- 4xx Client Errors ---
  {
    code: "400",
    title: "Bad Request",
    story: "DevCorp's profile registration page is rejecting user submissions silently. The logs report API endpoint parser failures, but the client code has no validation feedback.",
    why: "The client application sent a request payload with malformed or missing fields (like an invalid email format or username too short) which the backend server couldn't parse.",
    howToFix: "Implement a schema validation library (like Zod or Joi) on the backend to validate parameters, and return human-readable error messages with a 400 Bad Request status code.",
    codeSnippet: `// Unchecked Server Handler
app.post('/api/users', (req, res) => {
  db.insert(req.body); // Fails if req.body is malformed
  res.status(201).json({ ok: true });
});`,
    fixedSnippet: `// Safe Server Handler using Zod schema check
const { z } = require('zod');
const userSchema = z.object({
  username: z.string().min(3),
  email: z.string().email()
});

app.post('/api/users', (req, res) => {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  db.insert(result.data);
  res.status(201).json({ ok: true });
});`,
    interviewExplanation: "A 400 Bad Request code indicates that the server cannot or will not process the request due to client errors (e.g., malformed request syntax, invalid request message framing). To handle this gracefully, use validation schemas and respond with specific errors indicating what field failed validation.",
    animation: "broken-ui",
    xpReward: 20
  },
  {
    code: "401",
    title: "Unauthorized",
    story: "A user is editing a collaborative document. Suddenly, a screen overlay pops up saying their session has been locked. They can't save their changes.",
    why: "The client application sent an expired JSON Web Token (JWT) in the 'Authorization: Bearer <token>' header. The backend verification failed.",
    howToFix: "Implement a silent token refresh using a refresh token when the access token expires, or redirect the user back to the Auth screen to authenticate again.",
    codeSnippet: `// Middleware validation
jwt.verify(token, SECRET, (err, decoded) => {
  if (err) {
    // If err.name === 'TokenExpiredError'
    return res.status(401).json({ error: 'Token Expired' });
  }
});`,
    fixedSnippet: `// Token refresh flow on 401 response
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      const newToken = await refreshAuthToken();
      error.config.headers['Authorization'] = 'Bearer ' + newToken;
      return axios(error.config); // Retry original request
    }
    return Promise.reject(error);
  }
);`,
    interviewExplanation: "401 Unauthorized means the request lacks valid authentication credentials. Contrast it with 403 Forbidden: 401 is 'I do not know who you are' (missing/bad token), whereas 403 is 'I know who you are, but you do not have permission to access this resource'.",
    animation: "locked-screen",
    xpReward: 20
  },
  {
    code: "403",
    title: "Forbidden",
    story: "A support engineer tries to view the DevCorp firewall console routing tables. The browser triggers red security exceptions and locks the panel with authorization warnings.",
    why: "The client is authenticated (their token is valid), but they do not have the authorization role (e.g. they are a 'Support' role instead of 'Admin') required to execute the API call.",
    howToFix: "Add a Role-Based Access Control (RBAC) middleware verifying roles in the decrypted JWT payload on the backend route protection layers.",
    codeSnippet: `// Missing role authorization check
app.get('/api/admin/firewall', (req, res) => {
  res.json({ status: 'active' }); // Accessible to all roles!
});`,
    fixedSnippet: `// Role verification middleware (RBAC)
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access forbidden: Admins only' });
    }
    next();
  };
};

app.get('/api/admin/firewall', authenticateToken, authorizeRole('Admin'), (req, res) => {
  res.json({ status: 'active' });
});`,
    interviewExplanation: "A 403 Forbidden status indicates that the server understands the request but refuses to authorize it. Unlike 401 (Unauthorized, which means identity is not verified), 403 means the identity is verified but permissions are insufficient. Mention Role-Based Access Control (RBAC) in your explanation.",
    animation: "locked-screen",
    xpReward: 20
  },
  {
    code: "404",
    title: "Not Found",
    story: "DevCorp's frontend is requesting the employee roster, but the dashboard shows a blank state and the console is flooded with red GET errors.",
    why: "The frontend is trying to call '/api/v1/emplyees' (spelled incorrectly) instead of '/api/v1/employees', or the route is not defined on the backend server.",
    howToFix: "Verify that the request URL matches the exact path and parameters defined on the backend API router. Update the frontend URL request string to resolve the typo.",
    codeSnippet: `// Frontend Request
fetch('/api/v1/emplyees') // <-- Typo here!
  .then(res => res.json())
  .then(data => showRoster(data));`,
    fixedSnippet: `// Corrected Frontend Request
fetch('/api/v1/employees') // <-- Spelling fixed
  .then(res => res.json())
  .then(data => showRoster(data));`,
    interviewExplanation: "A 404 Status Code indicates that the server could not find the requested resource. In interviews, explain that it means the server received the request, mapped it to no active handler (wrong path, wrong method, or deleted database record), and replied with a standard NOT FOUND payload.",
    animation: "broken-ui",
    xpReward: 20
  },
  {
    code: "405",
    title: "Method Not Allowed",
    story: "A developer submits a registration form using a POST request, but targets the endpoint '/api/users/123', which only supports GET and PUT requests.",
    why: "The resource exists, but the server does not support the HTTP method used in the client request.",
    howToFix: "Return 405 Method Not Allowed and configure an 'Allow' header indicating the correct methods (e.g. GET, PUT).",
    codeSnippet: `// Handling incorrect route method defaults
app.get('/api/users/:id', (req, res) => {
  res.json(user);
}); // POST requests to this path hang or trigger generic 404s!`,
    fixedSnippet: `// Explicitly rejecting unsupported methods
app.route('/api/users/:id')
  .get((req, res) => res.json(user))
  .put((req, res) => res.json(updateUser(req)))
  .all((req, res) => {
    res.setHeader('Allow', 'GET, PUT');
    res.status(405).json({ error: 'Method Not Allowed' });
  });`,
    interviewExplanation: "A 405 Method Not Allowed error means the endpoint exists, but the HTTP verb (GET, POST, DELETE, etc.) is not permitted. Good API design requires returning an 'Allow' header detailing permitted verbs.",
    animation: "broken-ui",
    xpReward: 20
  },
  {
    code: "409",
    title: "Conflict",
    story: "A user tries to sign up with the email 'dev@devcorp.com'. The server database queries show that this email is already registered, so it aborts.",
    why: "The request could not be completed because it conflicts with the current state of the target resource (like duplicate keys or edit race conditions).",
    howToFix: "Check if the record exists first and respond with 409 Conflict, alerting the user about the duplicate state.",
    codeSnippet: `// DB inserts causing crashes
app.post('/api/register', async (req, res) => {
  const user = await db.insert(req.body); // Crashes node if email is unique index constraint fail!
  res.status(201).json(user);
});`,
    fixedSnippet: `// Checking duplicates and returning 409 Conflict
app.post('/api/register', async (req, res) => {
  const existing = await db.findByEmail(req.body.email);
  if (existing) {
    return res.status(409).json({ error: 'Email address already in use.' });
  }
  const user = await db.insert(req.body);
  res.status(201).json(user);
});`,
    interviewExplanation: "409 Conflict indicates the request conflicts with the current state of the server. Commonly returned when creating resource records with unique keys that already exist, or when collaborative editing conflicts arise (resolved via ETags).",
    animation: "broken-ui",
    xpReward: 20
  },
  {
    code: "422",
    title: "Unprocessable Entity",
    story: "A user fills out a travel claim sheet. The server receives the request, parses the JSON payload, but rejects it because the travel date is in the future.",
    why: "The server understands the content-type and syntax of the request, but the contained data semantic rules are invalid.",
    howToFix: "Use validation rules (like checking dates or password patterns) and respond with a 422 Unprocessable Entity status code along with error validation details.",
    codeSnippet: `// Server parsing JSON structure blindly
app.post('/api/claims', (req, res) => {
  saveClaim(req.body); // Saves bad business logical data!
  res.json({ ok: true });
});`,
    fixedSnippet: `// Validating business rules and returning 422
app.post('/api/claims', (req, res) => {
  const claimDate = new Date(req.body.date);
  if (claimDate > new Date()) {
    return res.status(422).json({ error: 'Claim date cannot be in the future.' });
  }
  saveClaim(req.body);
  res.json({ ok: true });
});`,
    interviewExplanation: "422 Unprocessable Entity is used when the request is syntactically correct (e.g. valid JSON), but semantic validation rules fail. It is standard in REST APIs for business logic validation errors.",
    animation: "broken-ui",
    xpReward: 20
  },
  {
    code: "429",
    title: "Too Many Requests",
    story: "An automated scraper script begins polling DevCorp product catalogs thousands of times a minute, causing server processors to peak and slow down legitimate traffic.",
    why: "The application API has no rate limiter to restrict the frequency of requests originating from a single client IP address.",
    howToFix: "Implement a rate-limiting middleware (such as express-rate-limit) on backend controllers to reject excessive requests with 429 Too Many Requests.",
    codeSnippet: `// API without limit protection
app.get('/api/products', (req, res) => {
  const products = db.fetchAllProducts();
  res.json(products);
});`,
    fixedSnippet: `// Express Rate Limiter integration
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 100, // Limit each IP to 100 requests per window
  message: { error: 'Too many requests, try again later' }
});

app.use('/api/products', apiLimiter);`,
    interviewExplanation: "429 Too Many Requests indicates that the rate limit has been exceeded. In production, rate limiters protect servers against DDoS attacks, brute forcing, and resource hogging. Mention algorithm options (Token Bucket, Leaky Bucket) and standard headers like Retry-After.",
    animation: "firewall-block",
    xpReward: 20
  },

  // --- 5xx Server Errors ---
  {
    code: "500",
    title: "Internal Server Error",
    story: "During high-traffic registration, the server abruptly dies. Clients receive a generic 500 error page. The logs report: 'Cannot read properties of undefined (reading 'email')'.",
    why: "The backend codebase crashed due to an unhandled runtime error (a null pointer or undefined lookup) and failed to respond with structured data.",
    howToFix: "Wrap the routing handler in a try-catch block, validate that 'req.body' contains the expected keys, and write a global Express error-handler middleware.",
    codeSnippet: `// Unhandled Server handler
app.post('/register', (req, res) => {
  const email = req.body.user.email; // Crash if 'req.body.user' is undefined!
  res.json({ success: true });
});`,
    fixedSnippet: `// Safe Server Handler with validation
app.post('/register', (req, res) => {
  try {
    if (!req.body?.user?.email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }
    const email = req.body.user.email;
    res.json({ success: true });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Internal system fault' });
  }
});`,
    interviewExplanation: "500 Internal Server Error is a catch-all error indicating that the server encountered an unexpected condition that prevented it from fulfilling the request. Mention that you prevent this by sanitizing inputs, using proper try-catch handlers, and implementing global error-catching middlewares to log bugs and return neat JSON errors rather than letting Node crash.",
    animation: "exploding-server",
    xpReward: 20
  },
  {
    code: "501",
    title: "Not Implemented",
    story: "A client calls '/api/v1/user/export-to-pdf'. The development team hasn't written the PDF generator driver yet, and has left a placeholder code.",
    why: "The server does not support the functionality required to fulfill the request. The server is unable to recognize or execute the request method.",
    howToFix: "Return 501 Not Implemented to signal to the client that this feature will be available in future releases but is currently unimplemented.",
    codeSnippet: `// Missing endpoint implementation details
app.get('/api/export-pdf', (req, res) => {
  // Empty handler. Request hangs forever!
});`,
    fixedSnippet: `// Return 501 placeholder error
app.get('/api/export-pdf', (req, res) => {
  res.status(501).json({
    status: 'Feature in queue',
    message: 'PDF conversion is not implemented on this server yet.'
  });
});`,
    interviewExplanation: "501 Not Implemented indicates the server does not support the request method or endpoint functionality. Unlike a 404 (wrong URL) or 500 (crash), a 501 implies the endpoint is known but functionality is not yet coded.",
    animation: "exploding-server",
    xpReward: 20
  },
  {
    code: "502",
    title: "Bad Gateway",
    story: "DevCorp portal reports connection errors. The Nginx reverse proxy server is working, but the downstream Node.js application server process crashed and is offline.",
    why: "A server acting as a gateway or proxy received an invalid response (or no response connection) from the upstream application server it tried to access.",
    howToFix: "Ensure the upstream Node.js process (PM2 daemon) is running and listening on the designated local socket/port, or fix runtime load crash loops.",
    codeSnippet: `// System state: Node app crashed.
// Proxy configuration tries to connect to localhost:3000
// Connection is refused! Nginx throws 502.`,
    fixedSnippet: `// PM2 Ecosystem config to automatically restart crashed servers
module.exports = {
  apps: [{
    name: "node-backend",
    script: "./server.js",
    instances: "max",
    autorestart: true // Prevents port downtime
  }]
};`,
    interviewExplanation: "A 502 Bad Gateway status is a network proxy error. It means the edge proxy (Nginx, AWS ALB, Cloudflare) successfully received the client request but failed to establish a handshake connection with the backend app container.",
    animation: "firewall-block",
    xpReward: 20
  },
  {
    code: "503",
    title: "Service Unavailable",
    story: "During a flash sale, thousands of checkout calls flood DevCorp servers. The CPU peaks at 100%, and the system rejects connection requests, returning maintenance screens.",
    why: "The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.",
    howToFix: "Implement request queue limits, scale backend servers horizontally using load balancers, and return a Retry-After response header.",
    codeSnippet: `// Server crashing under load limits
// System queue fills up, process freezes, memory leaks!`,
    fixedSnippet: `// Return 503 with Retry-After headers when overloaded
app.use((req, res, next) => {
  if (serverLoad > MAX_THRESHOLD) {
    res.setHeader('Retry-After', '120'); // Try again in 2 minutes
    return res.status(503).json({ error: 'Server overloaded. Backing off.' });
  }
  next();
});`,
    interviewExplanation: "A 503 Service Unavailable code indicates a temporary outage. The server is overloaded or undergoing maintenance. Use the 'Retry-After' header to suggest when the client should try again.",
    animation: "exploding-server",
    xpReward: 20
  },
  {
    code: "504",
    title: "Gateway Timeout",
    story: "The checkout process spins indefinitely for 30 seconds before crashing with a network failure screen. The microservice payment vendor is down and unresponsive.",
    why: "The server acting as a gateway or proxy timed out because the upstream payment gateway took too long to complete the checkout response loop.",
    howToFix: "Implement request timeout thresholds on external calls using an AbortController, and configure circuit breakers to fail-fast when microservices are down.",
    codeSnippet: `// Unbounded API calls
app.post('/api/pay', async (req, res) => {
  const payment = await externalPayApi.charge(); // Hangs forever if vendor is down!
  res.json(payment);
});`,
    fixedSnippet: `// Safe request with AbortController timeout
app.post('/api/pay', async (req, res) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
  
  try {
    const payment = await fetch('https://pay-vendor.com', { signal: controller.signal });
    clearTimeout(timeoutId);
    res.json(await payment.json());
  } catch (err) {
    res.status(504).json({ error: 'Upstream payment gateway timeout' });
  }
});`,
    interviewExplanation: "A 504 Gateway Timeout indicates that a server, while acting as a gateway or proxy, did not receive a timely response from the upstream server. Explain using timeout thresholds, fallback caches, and asynchronous processing options (job queues with webhooks) to avoid thread blocking.",
    animation: "exploding-server",
    xpReward: 20
  },
  {
    code: "505",
    title: "HTTP Version Not Supported",
    story: "An legacy IoT embedded sensor device attempts to push logs using HTTP/0.9 commands to the server. The modern Express server refuses.",
    why: "The server does not support, or refuses to support, the major version of HTTP used in the request message.",
    howToFix: "Ensure client requests use modern, supported HTTP versions (like HTTP/1.1 or HTTP/2), or configure web servers to handle HTTP/1.0 fallbacks.",
    codeSnippet: `// Client requesting old format
// curl --http0.9 http://localhost:8080/api/log`,
    fixedSnippet: `// Client configured for HTTP/1.1 or HTTP/2
const agent = new http.Agent({ keepAlive: true });
fetch('http://localhost:8080/api/log', { agent });`,
    interviewExplanation: "505 HTTP Version Not Supported means the server does not support the HTTP protocol version requested in the client's request line. Modern backends reject HTTP/0.9 and HTTP/1.0 protocols for security and speed reasons.",
    animation: "exploding-server",
    xpReward: 20
  },
  {
    code: "511",
    title: "Network Authentication Required",
    story: "A DevCorp remote worker tries to query database APIs from a local airport coffee shop. The API call fails, returning Wi-Fi portal authorization walls.",
    why: "The client needs to authenticate to gain network access (e.g. log in to a captive Wi-Fi portal router proxy).",
    howToFix: "Detect status code 511 in the client error interceptors and direct the user to sign in to the host hotspot portal.",
    codeSnippet: `// Fetch request failing in captive Wi-Fi portal
fetch('/api/tasks')
  .then(res => res.json()) // Throws JSON parse error because portal returned HTML!`,
    fixedSnippet: `// Catching 511 captive network redirects
fetch('/api/tasks')
  .then(res => {
    if (res.status === 511) {
      window.location.href = 'https://captive-hotspot.gateway';
    }
    return res.json();
  });`,
    interviewExplanation: "511 Network Authentication Required indicates that the client must authenticate to gain network access. It is sent by intercepting proxies that control access to networks (like captive portals at airports or hotels).",
    animation: "locked-screen",
    xpReward: 20
  },

  // --- Custom ---
  {
    code: "CORS",
    title: "CORS Blocked (Cross-Origin Resource Sharing)",
    story: "You are testing the local DevCorp frontend (localhost:5173) fetching a resource from the dev server (localhost:8080). The console displays: 'Access to fetch at... has been blocked by CORS policy'.",
    why: "The browser's Same-Origin Policy blocked the fetch call because the backend server's response headers did not include 'Access-Control-Allow-Origin: *' or the specific client origin.",
    howToFix: "Configure the backend application server to send CORS response headers allowing requests from your frontend origin (e.g. localhost:5173) or use the 'cors' middleware.",
    codeSnippet: `// Vulnerable Backend Server
const express = require('express');
const app = express();

app.get('/data', (req, res) => {
  res.json({ msg: 'No CORS headers' }); // Browser blocks this!
});`,
    fixedSnippet: `// Secure CORS Enabled Server
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend origin
  methods: ['GET', 'POST']
}));

app.get('/data', (req, res) => {
  res.json({ msg: 'CORS fixed!' });
});`,
    interviewExplanation: "CORS is a browser security mechanism that restricts resources on a web page from being requested from another domain outside the domain from which the first resource was served. Note that CORS is enforced strictly by the *browser*, not the server. The server still processes the request, but the browser blocks the response from reading if headers mismatch.",
    animation: "firewall-block",
    xpReward: 20
  }
];
