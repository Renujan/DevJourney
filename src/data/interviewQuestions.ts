export interface InterviewQuestion {
  id: number;
  question: string;
  level: 'beginner' | 'developer' | 'senior';
  idealAnswer: string;
  seniorAnswer: string;
  commonMistakes: string;
  category: string;
  timeLimit: number; // in seconds
}

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    question: "What is a REST API?",
    level: "beginner",
    category: "Apis & Protocols",
    timeLimit: 30,
    idealAnswer: "A REST API is an application programming interface that adheres to the constraints of REST architectural style and allows for interaction with RESTful web services using standard HTTP methods like GET, POST, PUT, and DELETE.",
    seniorAnswer: "REST is a stateless, resource-oriented architectural style. It operates on resources identified by URIs, utilizing standard HTTP verbs, caching headers, content negotiation, and stateless interaction. Crucially, true REST leverages HATEOAS (Hypermedia As the Engine Of Application State) for decoupling client and server.",
    commonMistakes: "Confusing HTTP with REST itself; stating REST is a protocol rather than an architectural style; not knowing standard HTTP status codes (200, 201, 400, 404, 500); claiming REST requires JSON (it can return XML, Text, HTML)."
  },
  {
    id: 2,
    question: "Explain the Virtual DOM and how React updates the UI.",
    level: "developer",
    category: "React Framework",
    timeLimit: 30,
    idealAnswer: "The Virtual DOM is a lightweight, in-memory representation of the real DOM. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (reconciliation/diffing), and updates only the changed elements in the real DOM.",
    seniorAnswer: "React's Virtual DOM acts as a declarative abstraction layer. Upon state mutation, a render pass constructs a new fiber tree. React's diffing algorithm (heuristic O(N) complexity) compares nodes by type and key. Updates are accumulated and applied to the real DOM during the 'commit' phase, batching operations to avoid layout thrashing.",
    commonMistakes: "Thinking the Virtual DOM is faster than the actual DOM in all cases (it adds memory overhead); not understanding that React elements are just plain JS objects; failing to explain why 'keys' are needed in list rendering."
  },
  {
    id: 3,
    question: "How would you design a scalable real-time notification service?",
    level: "senior",
    category: "System Design",
    timeLimit: 45,
    idealAnswer: "Use WebSockets or Server-Sent Events (SSE) for real-time delivery, backed by a message broker like Redis Pub/Sub or RabbitMQ to route messages. Store notification history in a NoSQL database (like MongoDB or DynamoDB) and scale using a load balancer and horizontal workers.",
    seniorAnswer: "Architect a decoupled event-driven system: 1. API Gateways holding persistent WebSocket connections (using Redis adapter for cross-node routing). 2. Event ingestion via Apache Kafka for durability and backpressure. 3. Partitioned worker services consuming Kafka topics. 4. Storage using MongoDB or Cassandra, writing updates with write-through caching in Redis. 5. Push notifications queued to APNS/FCM workers.",
    commonMistakes: "Relying on basic HTTP polling which wastes bandwidth and crashes servers at scale; forgetting connection state management (heartbeats/reconnections); ignoring database read-write load; ignoring message deduplication."
  },
  {
    id: 4,
    question: "What is JWT (JSON Web Token) and how is it structured?",
    level: "developer",
    category: "Backend & Auth",
    timeLimit: 30,
    idealAnswer: "A JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It is composed of three parts separated by dots: Header, Payload, and Signature. It is cryptographically signed to ensure integrity.",
    seniorAnswer: "JWT is a stateless bearer token standard (RFC 7519). Structure: 1. Header (specifies hash algorithm like HS256). 2. Payload (contains claims like sub, exp, and role). 3. Signature (Base64Url encoded Header + Payload signed using a secret or public/private key). Signed tokens prove authenticity, but are unencrypted by default, meaning they shouldn't contain sensitive data.",
    commonMistakes: "Thinking JWT is encrypted (it is only signed and Base64-encoded, anyone can read it); storing JWTs in localStorage without protecting against XSS; not knowing how to revoke a JWT stateless token before expiration."
  }
];
