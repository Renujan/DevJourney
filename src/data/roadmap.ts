export interface Quiz {
  question: string;
  options: string[];
  answer: string;
}

export interface MiniProject {
  title: string;
  prompt: string;
  codeTemplate: string;
  solution: string;
}

export interface StudyTopic {
  title: string;
  description: string;
  points: string[];
  codeSnippet?: string;
  proTip?: string;
}

export interface RoadmapNode {
  id: string;
  label: string;
  description: string;
  category: 'frontend' | 'backend' | 'career';
  prerequisites: string[];
  quiz: Quiz;
  miniProject: MiniProject;
  xpReward: number;
  studyContent: StudyTopic[];
}

export const roadmapNodes: RoadmapNode[] = [
  {
    id: "html",
    label: "HTML Core",
    description: "Master document structure, accessibility, and semantic elements required for modern web applications.",
    category: "frontend",
    prerequisites: [],
    quiz: {
      question: "Which HTML5 element represents self-contained, independent content that could be syndicatable?",
      options: ["<section>", "<div>", "<article>", "<aside>"],
      answer: "<article>"
    },
    miniProject: {
      title: "Semantic Structure",
      prompt: "Structure a blog page using <header>, <main>, <article>, <section>, and <footer> tags.",
      codeTemplate: `<div>\n  <div class="top">My Blog</div>\n  <div class="post">Hello World</div>\n  <div class="bottom">Copyright 2026</div>\n</div>`,
      solution: `<header>My Blog</header>\n<main>\n  <article>\n    <section>Hello World</section>\n  </article>\n</main>\n<footer>Copyright 2026</footer>`
    },
    xpReward: 15,
    studyContent: [
      {
        title: "Structural Layout & Semantic Landmarks",
        description: "Learn how structural tags declare the semantic framework of web pages for browsers, SEO, and screen readers.",
        points: [
          "<header>: Defines introductory content or navigation links at the top of a page or section.",
          "<nav>: Houses primary site navigation lists. Screen readers use this tag to allow users to skip directly to navigation controls.",
          "<main>: Wraps the unique, core contents of the page. You must include exactly one <main> tag per document.",
          "<article>: Wraps self-contained, independent elements that can be republished elsewhere (e.g. blog posts, forum replies, news articles).",
          "<section>: Groups related contents together. Typically starts with an h1-h6 heading.",
          "<aside>: Holds secondary content that is tangentially related to the surrounding text (e.g. sidebars, glossary terms, callouts).",
          "<footer>: Wraps metadata, copy notices, and secondary links at the bottom of the page or section."
        ],
        codeSnippet: `<!-- Semantically structured web outline -->\n<header>\n  <h1>DevCorp Interactive System</h1>\n  <nav>\n    <a href="/home">Home</a> | <a href="/roadmap">Roadmap</a>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h2>HTML5 Semantics: Beginner to Pro</h2>\n    <p>Semantic tags are essential for building high-quality layout structures.</p>\n    <section>\n      <h3>Subheading: SEO Benefits</h3>\n      <p>Search bots read semantic hierarchies to index your content accurately.</p>\n    </section>\n  </article>\n</main>\n\n<footer>\n  <p>© 2026 DevCorp Industries. All rights reserved.</p>\n</footer>`,
        proTip: "Rule #1 of ARIA attributes: Use native semantic elements first. Do not add ARIA roles like role=\"navigation\" on native tags like <nav> as they are already declared implicitly by the browser."
      },
      {
        title: "HTML5 Form Elements & Validation Rules",
        description: "Master user input validation, tags, and standard submission flow patterns.",
        points: [
          "<form>: Encloses form controls and defines how data is submitted (using action and method attributes).",
          "<label>: Binds explanatory labels to form controls. Associate them using the htmlFor (React) or for (HTML) attribute matching the input id.",
          "<input>: Core intake control. Use specific types: text, password, email, number, checkbox, radio, date, file, and submit.",
          "<textarea>: Handles multiline textual paragraphs.",
          "<select> & <option>: Creates structured dropdown selection lists.",
          "Required Validation: Add 'required' attribute to enforce entry validation on browser threads.",
          "Regex Pattern: Use the 'pattern' attribute to enforce strict formats (e.g. digits only, phone numbers, postal codes)."
        ],
        codeSnippet: `<!-- Safe Accessible Registration Form -->\n<form onSubmit={handleRegister}>\n  <div className="form-group">\n    <label htmlFor="userEmail">Corporate Email:</label>\n    <input \n      id="userEmail"\n      type="email"\n      required\n      placeholder="developer@devcorp.com"\n    />\n  </div>\n\n  <div className="form-group">\n    <label htmlFor="employeeTier">Access Level:</label>\n    <select id="employeeTier" required>\n      <option value="">Select tier...</option>\n      <option value="junior">Junior Dev</option>\n      <option value="senior">Senior Lead</option>\n    </select>\n  </div>\n\n  <button type="submit">Verify Registration</button>\n</form>`,
        proTip: "Form inputs without associated <label> elements fail standard accessibility (a11y) audits. Screen readers cannot describe the input fields without label relationships."
      }
    ]
  },
  {
    id: "css",
    label: "CSS Layouts",
    description: "Learn Grid, Flexbox, transitions, and advanced layouts to design responsive, animated applications.",
    category: "frontend",
    prerequisites: ["html"],
    quiz: {
      question: "Which CSS property is used to align flex items along the main axis?",
      options: ["align-items", "justify-content", "align-content", "grid-gap"],
      answer: "justify-content"
    },
    miniProject: {
      title: "Flexbox Centering",
      prompt: "Align a child box exactly in the center of its parent using flexbox.",
      codeTemplate: `.parent {\n  display: block;\n}\n.child {\n  width: 50px;\n}`,
      solution: `.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`
    },
    xpReward: 15,
    studyContent: [
      {
        title: "CSS Grid vs Flexbox Layout Rules",
        description: "Choose the correct modern layout tool for single and multi-dimensional web structures.",
        points: [
          "Flexbox (1D): Arranges child items strictly along a single axis (row or column). Ideal for menus, buttons, wraps, and alignments.",
          "flex-direction: Defines the main axis (row default, row-reverse, column, column-reverse).",
          "justify-content & align-items: Align items along the main axis and cross axis respectively.",
          "CSS Grid (2D): Arranges items in both rows and columns simultaneously. Perfect for dashboard grids, page structures, and columns.",
          "grid-template-columns: Sets grid widths (e.g. repeat(auto-fit, minmax(280px, 1fr)) for auto-wrapping layouts).",
          "gap / row-gap / column-gap: Defines spacing gutter widths without using margin Hacks."
        ],
        codeSnippet: `/* Responsive Multi-column Grid Grid */\n.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}\n\n/* Flex alignment header bar */\n.header-navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem;\n  background: var(--cyber-card);\n}`,
        proTip: "Use CSS Grid for page layouts and Flexbox for alignments inside grid cards. This combination keeps layouts clean, clean-coded, and highly performant."
      },
      {
        title: "Media Queries & Responsive Performance",
        description: "Master fluid responsiveness and layout reflow animations.",
        points: [
          "Viewport meta: Ensures mobile browsers scale layouts based on the device width, not mock widths.",
          "Media Queries: Enforces CSS breakpoints using min-width rules for mobile-first styles (e.g., md: @media (min-width: 768px)).",
          "Fluid Sizing: Use clamp(min, value, max) for headings and paddings to scale text smoothly across screen resolutions.",
          "Layout Reflow Performance: Animations that change height, width, margin, or position trigger expensive reflow computations.",
          "GPU Compositing: Animate transitions strictly using opacity and transform (translate, scale, rotate) to offload animation renders to hardware layers."
        ],
        codeSnippet: `/* Mobile-first card style */\n.card {\n  width: 100%;\n  padding: 1rem;\n  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s;\n}\n\n@media (min-width: 768px) {\n  .card {\n    width: 30%;\n    padding: 1.5rem;\n  }\n}\n\n/* High-perf animation trigger */\n.card:hover {\n  transform: translateY(-4px);\n}`,
        proTip: "Use the prefers-reduced-motion media query to strip animations for users who experience motion sickness or have disabled layouts transitions in system settings."
      }
    ]
  },
  {
    id: "javascript",
    label: "JavaScript ES6+",
    description: "Dive deep into modern JS: Promises, async/await, closures, array methods, and scope.",
    category: "frontend",
    prerequisites: ["css"],
    quiz: {
      question: "What is the result of typeof null in JavaScript?",
      options: ["'null'", "'undefined'", "'object'", "'string'"],
      answer: "'object'"
    },
    miniProject: {
      title: "Promise Fetcher",
      prompt: "Write an async function that fetches users and returns their length.",
      codeTemplate: `async function countUsers() {\n  // fetch from '/api/users'\n}`,
      solution: `async function countUsers() {\n  const res = await fetch('/api/users');\n  const users = await res.json();\n  return users.length;\n}`
    },
    xpReward: 20,
    studyContent: [
      {
        title: "Slices of Variable Scope & Closures",
        description: "Explore lexical environments, closure compilation, and garbage collection behaviors.",
        points: [
          "Lexical Scope: Variable access is decided compile-time based on where the variable declaration sits in the text document.",
          "var vs let/const: var is function-scoped and hoisted. let and const are block-scoped and exist in a Temporary Dead Zone before parsing.",
          "Closures: A function that keeps references to its lexical scope variables even when executed outside its originating context.",
          "Encapsulation: Closures create private variables and object factories that cannot be accessed or corrupted from external scripts."
        ],
        codeSnippet: `// Closure scope and encapsulating data\nfunction createAccount(owner) {\n  let balance = 0; // Private scope variable\n  \n  return {\n    deposit(amount) {\n      if (amount > 0) balance += amount;\n      return balance;\n    },\n    getBalance() {\n      return balance;\n    }\n  };\n}\n\nconst devWallet = createAccount("Junior Dev");\nconsole.log(devWallet.deposit(200)); // 200\nconsole.log(devWallet.balance); // undefined (safe from direct corruption!)`,
        proTip: "Closures store references, not values. Avoid creating closures in rapid loop intervals or attaching them to global listeners, as they can cause browser memory leaks if left uncollected."
      },
      {
        title: "Asynchronous Flow: Event Loop & Promises",
        description: "Master concurrent JavaScript execution and the callback queue structure.",
        points: [
          "Single-threaded runtime: JS executes code sequentially using a single Call Stack and Call-heap.",
          "Event Loop: Moves tasks from Callback Queues to the Call Stack once the stack is empty.",
          "Microtasks: Promises, queueMicrotask, and mutation observers. They take absolute priority and drain fully before rendering updates.",
          "Macrotasks: setTimeout, setInterval, click events, and server outputs. They run one at a time between rendering cycles.",
          "async/await: Syntactic sugar on top of raw Promise states. Enforces readable code layout while wrapping errors in try/catch loops."
        ],
        codeSnippet: `// Event loop flow simulation\nconsole.log("1. Sync call start");\n\nsetTimeout(() => {\n  console.log("4. Macrotask (Timeout)");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log("3. Microtask (Promise resolving)");\n});\n\nconsole.log("2. Sync call end");\n// Execution order: 1 -> 2 -> 3 -> 4`,
        proTip: "Ensure all async calls are wrapped in try-catch structures. Unhandled Promise rejections can trigger runtime panics and crash server threads (like Node.js)."
      }
    ]
  },
  {
    id: "react_basics",
    label: "React Basics",
    description: "Get started with JSX, components, props, and state hooks.",
    category: "frontend",
    prerequisites: ["javascript"],
    quiz: {
      question: "Which Hook is used to remember values across renders without causing a re-render?",
      options: ["useState", "useMemo", "useRef", "useCallback"],
      answer: "useRef"
    },
    miniProject: {
      title: "Counter Hook",
      prompt: "Create a button that increments a count using useState.",
      codeTemplate: `function Counter() {\n  const count = 0;\n  return <button>Count: {count}</button>;\n}`,
      solution: `function Counter() {\n  const [count, setCount] = React.useState(0);\n  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;\n}`
    },
    xpReward: 20,
    studyContent: [
      {
        title: "The React Hook Trio: useState, useEffect, useRef",
        description: "Deep dive into state management, lifecycle side-effects, and persistent non-rendering memory reference tags.",
        points: [
          "useState: Holds component state variables. Updating state schedules a re-render, diffing the UI Virtual DOM trees.",
          "useEffect: Coordinates async and physical side-effects (API fetch, events, timers).",
          "Effect Dependencies: Trigger effect runs only when dependency variables change. Passing [] means it runs only on mount.",
          "Effect Cleanup: Returning a function from useEffect schedules a clean pass before the next effect run or component destruction.",
          "useRef: Persistent container whose .current property stores values. Editing it does NOT cause a component re-render. Ideal for element targets."
        ],
        codeSnippet: `import { useState, useEffect, useRef } from 'react';\n\nexport function FocusTracker() {\n  const [clicks, setClicks] = useState(0);\n  const inputElement = useRef<HTMLInputElement>(null);\n  const countRef = useRef(0); // Tracks total clicks without re-rendering\n\n  useEffect(() => {\n    console.log(\`Clicked \${clicks} times\`);\n    inputElement.current?.focus(); // DOM access\n    \n    return () => {\n      console.log('Running hook cleanup...');\n    };\n  }, [clicks]); // Triggers only when clicks variable shifts\n\n  return (\n    <div>\n      <input ref={inputElement} type="text" placeholder="Focused on render" />\n      <button onClick={() => { \n        setClicks(c => c + 1); \n        countRef.current += 1;\n      }}>\n        Click Count: {clicks} (Secret Click Record: {countRef.current})\n      </button>\n    </div>\n  );\n}`,
        proTip: "Never skip reactive parameters (props, states) inside the dependency array of useEffect. This triggers stale closure traps where the hook reads outdated variable states."
      },
      {
        title: "Standard React File Architecture & Directory Structures",
        description: "Learn how to structure professional-grade production React directories.",
        points: [
          "Maintain clear divisions of files to avoid large, unmaintainable component sheets.",
          "/components: Shared, atomic visual layout blocks (Buttons, Modals, Forms, Inputs).",
          "/hooks: Custom state hooks (e.g. useAuth, useDebounce) separating code actions from visuals.",
          "/pages: Route target layouts mapping to page routes (e.g. Home, Dashboard, Roadmap).",
          "/context: Global state sheets distributing data (e.g. ThemeContext, UserContext).",
          "App.tsx: Layout wrapper hosting routes and top-level providers.",
          "main.tsx: Root index compiler mounting the React tree onto the physical HTML DOM container."
        ],
        codeSnippet: `src/\n├── assets/          # Static assets (images, icons, theme styling)\n├── components/      # Global reusable components\n│   ├── Button.tsx\n│   └── Input.tsx\n├── hooks/           # Reusable custom hooks\n│   └── useFetch.ts\n├── pages/           # Route views / parent pages\n│   ├── Dashboard.tsx\n│   └── Roadmap.tsx\n├── context/         # React Context APIs\n│   └── ThemeContext.tsx\n├── app/             # Routing setups & configurations\n│   └── routes.tsx\n├── main.tsx         # Mounting element index\n└── index.css        # Core stylesheet`,
        proTip: "Feature-Based layouts (grouping components, hooks, and tests into feature folders e.g. /features/xpSystem/) are preferred over Type-Based structures for large workspaces, as they minimize file-hopping."
      }
    ]
  },
  {
    id: "api_integration",
    label: "API Integration",
    description: "Connect your frontends to APIs using Fetch, Axios, and handle status responses.",
    category: "frontend",
    prerequisites: ["react_basics"],
    quiz: {
      question: "Which HTTP method is considered idempotent?",
      options: ["POST", "GET", "PATCH", "DELETE"],
      answer: "GET"
    },
    miniProject: {
      title: "Data Loader",
      prompt: "Fetch and load data inside a React useEffect hook.",
      codeTemplate: `useEffect(() => {\n  // Fetch '/api/data' and set state\n}, []);`,
      solution: `useEffect(() => {\n  fetch('/api/data')\n    .then(r => r.json())\n    .then(d => setData(d));\n}, []);`
    },
    xpReward: 25,
    studyContent: [
      {
        title: "HTTP Verbs, Payloads & Response Statuses",
        description: "Learn clean networking guidelines and error handling structures.",
        points: [
          "GET: Fetch resources safely without side-effects (Idempotent).",
          "POST: Submit payloads to create database rows (Non-idempotent).",
          "PUT: Overwrite existing target records completely (Idempotent).",
          "PATCH: Modify specific fields of a target record (Non-idempotent).",
          "DELETE: Erase records (Idempotent).",
          "Response Categories: 2xx (Success), 3xx (Redirects), 4xx (Client mistakes e.g. 401 Unauthorized, 404 Not Found), 5xx (Server failures)."
        ],
        codeSnippet: `// Advanced Fetch call with abort handles\nasync function fetchEmployeeProfile(userId) {\n  const controller = new AbortController();\n  \n  try {\n    const response = await fetch(\`/api/employees/\${userId}\`, {\n      method: 'GET',\n      signal: controller.signal,\n      headers: {\n        'Accept': 'application/json'\n      }\n    });\n    \n    if (!response.ok) {\n      throw new Error(\`HTTP failure status: \${response.status}\`);\n    }\n    \n    const data = await response.json();\n    return data;\n  } catch (error) {\n    if (error.name === 'AbortError') {\n      console.log('Fetch request aborted');\n    } else {\n      console.error('Request failed:', error);\n      throw error;\n    }\n  }\n}`,
        proTip: "Always implement abort signals in useEffect fetch hooks to cancel out-of-order responses if a component unmounts before a server returns data."
      },
      {
        title: "Auth Tokens, JWT, & Navigating CORS Preflight Gates",
        description: "Understand cross-domain security and authorization header standards.",
        points: [
          "Authorization: Clients attach bearer credentials: Authorization: Bearer <JWT_Token>.",
          "JWT format: Dot-split strings encoding header parameters, claim payloads, and validation signatures.",
          "CORS: Browser security standard blocking scripts from loading APIs on other domain origins.",
          "CORS Toggles: Servers authorize domains via Access-Control-Allow-Origin headers.",
          "Preflight checks: Browsers dispatch empty OPTIONS calls first to verify cross-domain permissions before POST/PUT requests."
        ],
        codeSnippet: `// Attaching credentials to network client configurations\nconst apiHeaders = {\n  'Content-Type': 'application/json',\n  'Authorization': \`Bearer \${localStorage.getItem('user_jwt')}\`\n};\n\nfetch('/api/secure-endpoint', {\n  method: 'POST',\n  headers: apiHeaders,\n  body: JSON.stringify({ action: 'CLEARANCE_KEY' })\n});`,
        proTip: "CORS is purely a browser sandbox security guard. Server-to-server calls or tools like Postman bypass CORS controls because they are outside browser scope."
      }
    ]
  },
  {
    id: "cookies_session",
    label: "Cookies & Sessions",
    description: "Understand state persistence, cookies vs local storage, session management, and how to secure sessions against XSS and CSRF.",
    category: "backend",
    prerequisites: ["api_integration"],
    quiz: {
      question: "Which cookie attribute prevents client-side JavaScript from accessing cookies, mitigating XSS token theft?",
      options: ["Secure", "HttpOnly", "SameSite=Strict", "Path=/"],
      answer: "HttpOnly"
    },
    miniProject: {
      title: "Set-Cookie Builder",
      prompt: "Construct a secure cookie string with HttpOnly, Secure, SameSite=Strict, and Max-Age=3600.",
      codeTemplate: `function configureCookie(name: string, value: string): string {\n  // Return formatted cookie string\n}`,
      solution: `function configureCookie(name: string, value: string): string {\n  return \`\${name}=\${value}; Secure; HttpOnly; SameSite=Strict; Max-Age=3600\`;\n}`
    },
    xpReward: 100,
    studyContent: [
      {
        title: "1. HTTP Cookies Basics",
        description: "Learn how browsers and servers store state information across stateless HTTP boundaries.",
        points: [
          "Stateless Protocol: HTTP is stateless by design. Every request is completely isolated, with no memory of prior interactions.",
          "Cookies Mechanism: Small string key-value pairs stored directly by the web browser on behalf of domains.",
          "Transmission Flow: Servers send the 'Set-Cookie' header. Browsers read this header, store the values, and automatically attach them to the 'Cookie' header in all future HTTP requests to that same domain."
        ],
        codeSnippet: `// Example HTTP headers demonstrating cookie exchange\n// Server Response:\nHTTP/1.1 200 OK\nSet-Cookie: user_id=devcorp_102; Path=/; Domain=devcorp.com\n\n// Subsequent Client Request:\nGET /api/dashboard HTTP/1.1\nHost: devcorp.com\nCookie: user_id=devcorp_102`,
        proTip: "Cookies are domain-specific. A cookie set by devcorp.com cannot be read by another domain unless they share a matching sub-domain wildcard structure."
      },
      {
        title: "2. Cookie Lifecycle: Session vs Persistent",
        description: "Understand cookie lifespans and how they expire or get removed from storage.",
        points: [
          "Session Cookies: Created without Expires or Max-Age attributes. They are kept in volatile memory and deleted when the user closes their browser tab or window.",
          "Persistent Cookies: Configured with 'Expires' (exact GMT timestamp) or 'Max-Age' (delta seconds from creation). They survive browser restarts and stay on disk until expiration.",
          "Deletion: To delete a cookie, set its 'Max-Age' to 0 or configure the 'Expires' attribute to a historical date (e.g. Epoch time)."
        ],
        codeSnippet: `// Setting a persistent cookie expiring in 1 hour (3600 seconds)\nSet-Cookie: user=John; Max-Age=3600;\n\n// Deleting a cookie instantly\nSet-Cookie: user=John; Max-Age=0;`,
        proTip: "Browsers discard expired cookies automatically. Never rely on the client's system clock for precise expiration, as incorrect client dates can cause unexpected login expiries."
      },
      {
        title: "3. Storage Showdown: Cookies vs LocalStorage vs SessionStorage",
        description: "Compare sizes, transmissions, and access parameters of standard client-side storage structures.",
        points: [
          "Cookies: Limited to 4KB of data. Automatically transmitted to the server on every matching HTTP request. Accessible via document.cookie unless flags prevent it.",
          "LocalStorage: Store up to 5MB+ of data per origin. Persistent across browser sessions. Never sent to the server automatically. Vulnerable to script injection (XSS).",
          "SessionStorage: Store up to 5MB+ of data. Lifespan is scoped to the active browser tab. Closing the tab erases all SessionStorage keys immediately."
        ],
        codeSnippet: `// LocalStorage API Usage\nlocalStorage.setItem("theme", "dark");\nconst currentTheme = localStorage.getItem("theme");\n\n// SessionStorage API Usage\nsessionStorage.setItem("current_step", "2");\nconst step = sessionStorage.getItem("current_step");`,
        proTip: "Use LocalStorage for non-sensitive settings (like themes, language settings). Never store JWTs or user credentials in LocalStorage due to security vulnerabilities."
      }
    ]
  },
  {
    id: "advanced_react",
    label: "Advanced React",
    description: "Explore performance optimization, custom hooks, context, and state managers like Zustand.",
    category: "frontend",
    prerequisites: ["cookies_session"],
    quiz: {
      question: "What does React.memo optimize?",
      options: ["DOM creation", "Component re-renders", "Bundle size", "API fetch rates"],
      answer: "Component re-renders"
    },
    miniProject: {
      title: "Custom Title Hook",
      prompt: "Create a custom hook useDocumentTitle that updates the browser page title.",
      codeTemplate: `function useDocumentTitle(title) {\n  // ...\n}`,
      solution: `function useDocumentTitle(title) {\n  React.useEffect(() => {\n    document.title = title;\n  }, [title]);\n}`
    },
    xpReward: 25,
    studyContent: [
      {
        title: "React Memoization & Computation Caching",
        description: "Mitigate component updates, layout recalculations, and parent render cascades.",
        points: [
          "React.memo: Shallow-compares incoming props. If props match, React skips re-rendering the wrapped child component.",
          "useMemo: Caches the return value of an expensive calculation function between renders. Prevents recomputation unless dependencies shift.",
          "useCallback: Memoizes the function signature reference, stopping child components from re-rendering due to fresh function signatures in props."
        ],
        codeSnippet: `import React, { useState, useMemo, useCallback } from 'react';\n\n// Child component skip renders if props match\nconst LogItem = React.memo(({ log, onDelete }) => {\n  console.log('Rendering LogItem:', log.id);\n  return <div onClick={() => onDelete(log.id)}>{log.text}</div>;\n});\n\nexport function LogConsole() {\n  const [logs, setLogs] = useState([{ id: 1, text: "DB Online" }]);\n  const [filterText, setFilterText] = useState("");\n\n  // Stable callback reference passed to child props\n  const handleDelete = useCallback((id) => {\n    setLogs(current => current.filter(l => l.id !== id));\n  }, []);\n\n  // Computational caching prevents filtering on every parent render\n  const filteredLogs = useMemo(() => {\n    return logs.filter(l => l.text.includes(filterText));\n  }, [logs, filterText]);\n}`,
        proTip: "Do not memoize everything. Checking dependencies in useMemo and useCallback adds minor runtime overhead. Apply them to heavy loops or when passing props to memoized children."
      },
      {
        title: "Atomic Global Stores: Zustand States",
        description: "Construct fast, simplified, and reactive state stores bypassing Context providers.",
        points: [
          "Context bottlenecks: Provider value changes force all consumer components to update, leading to performance drops.",
          "Zustand Stores: Lightweight custom hooks storing global states outside the React tree.",
          "Selectors: Choose specific variables (e.g. useStore(s => s.xp)). The component updates ONLY when that specific variable changes.",
          "Actions: Declare mutator functions inside the store configuration sheet for cleaner separation of concerns."
        ],
        codeSnippet: `import { create } from 'zustand';\n\ninterface XPStore {\n  xp: number;\n  level: string;\n  gainXP: (amount: number) => void;\n}\n\n// Global store hook creation\nexport const useXPStore = create<XPStore>((set) => ({\n  xp: 0,\n  level: "Beginner 👶",\n  gainXP: (amount) => set((state) => {\n    const newXP = state.xp + amount;\n    const nextLevel = newXP > 500 ? "Architect 🏗️" : "Junior Dev 💻";\n    return { xp: newXP, level: nextLevel };\n  })\n}));\n\n// Usage in component (selector restricts renders)\nfunction XPDisplay() {\n  const xp = useXPStore(state => state.xp);\n  return <span>XP points: {xp}</span>;\n}`,
        proTip: "Always split Zustand stores logically (e.g. useSessionStore, useInterfaceStore) to keep selectors clear and maintainable."
      }
    ]
  },
  {
    id: "projects",
    label: "Building Projects",
    description: "Build robust modular apps, handle forms, routes, and compile structures.",
    category: "frontend",
    prerequisites: ["advanced_react"],
    quiz: {
      question: "What is the purpose of React Router's <Outlet /> component?",
      options: ["To render global modals", "To render child route elements", "To output console errors", "To display navigation links"],
      answer: "To render child route elements"
    },
    miniProject: {
      title: "Dynamic Rerouting",
      prompt: "Set up a standard redirect logic when authenticated is false.",
      codeTemplate: `if (!auth) {\n  // redirect\n}`,
      solution: `if (!auth) {\n  return <Navigate to="/login" replace />;\n}`
    },
    xpReward: 30,
    studyContent: [
      {
        title: "Single Page Application (SPA) Routing Models",
        description: "Configure client-side routing, layout sheets, and protected routes.",
        points: [
          "<BrowserRouter>: Keeps state coordinates between window locations and component trees.",
          "<Outlet />: Renders nested child elements inside a parent layout component (e.g. shared menus).",
          "Protected Route Guard: A component wrapper checking authentication rules before loading child pages.",
          "Dynamic Routes: Parameters match routes (e.g. /profile/:userId, parsed with useParams())."
        ],
        codeSnippet: `import { Routes, Route, Navigate, Outlet } from 'react-router-dom';\n\n// Protect routes layout\nconst PrivateLayout = ({ isAuth }) => {\n  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;\n};\n\nexport function AppRouter() {\n  return (\n    <Routes>\n      <Route path="/login" element={<Login />} />\n      <Route element={<PrivateLayout isAuth={true} />}>\n        <Route path="/dashboard" element={<Dashboard />} />\n        <Route path="/roadmap" element={<Roadmap />} />\n      </Route>\n    </Routes>\n  );\n}`,
        proTip: "Use lazy loading: const Dashboard = React.lazy(() => import('./pages/Dashboard')) to split page bundles into on-demand files."
      },
      {
        title: "Modern Compilers: Vite & Environment Variables",
        description: "Configure development servers, production bundling, and environment files.",
        points: [
          "Vite HMR: Utilizes native browser ES Modules for instant script reloading during development.",
          "Rollup: Builds, optimizes, and bundles code for production deployment.",
          "Environment Files (.env): Key-value stores targeting settings across local, staging, and production tiers.",
          "VITE_ prefix: Exposes public configurations to frontend scripts."
        ],
        codeSnippet: `// vite.config.ts production configuration rules\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  build: {\n    outDir: 'dist',\n    sourcemap: false,\n    minify: 'esbuild', // high-speed minifier\n    chunkSizeWarningLimit: 1000\n  }\n});`,
        proTip: "Never commit keys or database credentials inside code files or repository environment sheets (.env). Add them directly to deployment platform parameters."
      }
    ]
  },
  {
    id: "interview_prep",
    label: "Interview Prep",
    description: "Polish architectural patterns, solve challenges, and conquer system design panels.",
    category: "career",
    prerequisites: ["projects"],
    quiz: {
      question: "Which concept helps avoid prop-drilling in React without external stores?",
      options: ["Redux", "Context API", "GSAP", "Framer Motion"],
      answer: "Context API"
    },
    miniProject: {
      title: "Mock Interview Review",
      prompt: "Formulate a definition for React reconciliation.",
      codeTemplate: `// Reconciliation is...`,
      solution: `// Reconciliation is React's algorithm to compare Virtual DOM trees and apply minimal updates to the real DOM.`
    },
    xpReward: 50,
    studyContent: [
      {
        title: "Frontend System Design & Architecture panels",
        description: "Standard steps to tackle design interview questions under pressure.",
        points: [
          "Step 1: Gather requirements. Clarify targets (e.g. mobile performance, SEO targets) and scope restrictions.",
          "Step 2: Architecture components. Outline rendering paths: CSR (Client-Side Rendering), SSR (Server-Side Rendering), or SSG (Static Site Generation).",
          "Step 3: State mapping. Define local state, global stores, and cache sync periods.",
          "Step 4: API specifications. Draft payloads and contracts (REST, GraphQL, or WebSockets).",
          "Step 5: Network performance. Outline CDN deployment, file caches, and service workers."
        ],
        codeSnippet: `/* API Design contract blueprint: /api/v1/user */\n{\n  method: "GET",\n  headers: { "Authorization": "Bearer <token>" },\n  response: {\n    status: 200,\n    data: {\n      id: "usr_99x",\n      role: "Architect",\n      xp: 1250\n    }\n  }\n}`,
        proTip: "Focus on caching strategies. CDNs cache static files, redis caches DB responses, and client service workers cache API payloads to speed up page loads."
      },
      {
        title: "Algorithms: Complexity Matrices (Big O) and Practice",
        description: "Analyze code efficiency and explain optimization tradeoffs clearly to interview panels.",
        points: [
          "Time Complexity (Big O): Measures how execution time scales with input size (O(1) constant, O(N) linear, O(N^2) quadratic).",
          "Space Complexity: Measures stack frame growth and variable allocation overhead in heap memory.",
          "Tree Traversal: DFS (Depth-First Search) traverses down paths using recursion, while BFS (Breadth-First Search) processes levels using queues."
        ],
        codeSnippet: `// Linear O(N) Fibonacci using caching (Dynamic Programming)\nfunction fibonacci(n, cache = new Map()) {\n  if (n <= 1) return n;\n  if (cache.has(n)) return cache.get(n);\n  \n  const result = fibonacci(n - 1, cache) + fibonacci(n - 2, cache);\n  cache.set(n, result);\n  return result;\n}\n\nconsole.log(fibonacci(50)); // Fast O(N) calculation!`,
        proTip: "Never start coding immediately. Talk through your approach, state its O(N) constraints, and verify edge cases (empty data, null values) with the interviewer first."
      }
    ]
  }
];
