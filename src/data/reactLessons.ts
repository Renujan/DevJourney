export interface LessonChoice {
  text: string;
  action: string;
  outcome: string;
  isCorrect: boolean;
  animationEffect?: 'infinite-api' | 'ui-crash' | 'stale-state' | 'success' | 're-render';
}

export interface ReactLesson {
  id: number;
  title: string;
  story: string;
  concept: string;
  sender: string;
  code: string;
  question: string;
  choices: LessonChoice[];
  explanation: string;
  interviewQ: string;
  interviewAnswer: string;
  xpReward: number;
}

export const reactLessons: ReactLesson[] = [
  {
    id: 1,
    title: "useEffect Dependency Array",
    story: "DevCorp's analytics dashboard is freezing. Customers complain that the layout locks up after loading. Our API usage reports show a massive spike from our domain.",
    concept: "component lifecycle & dependency tracking",
    sender: "Alex (Lead React Dev)",
    code: `// src/components/Dashboard.tsx
import { useState, useEffect } from 'react';

export function Dashboard() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    async function fetchAnalytics() {
      const response = await fetch('/api/analytics');
      const json = await response.json();
      setData(json);
    }
    fetchAnalytics();
  }); // <-- Look closely here
  
  return <DataList items={data} />;
}`,
    question: "Analyze the code. Alex asks: 'Why is the dashboard freezing our user's browser, and how does the dependency array play a role here?'",
    choices: [
      {
        text: "It runs fine, the issue is that the /api/analytics endpoint is slow.",
        action: "blame-backend",
        outcome: "Alex shakes his head: 'No, the server is healthy. The dashboard is spamming the API continuously. Try again.'",
        isCorrect: false,
        animationEffect: "re-render"
      },
      {
        text: "Simulate removal of dependency array entirely.",
        action: "simulate-infinite",
        outcome: "CRITICAL: The missing array causes useEffect to run on *every* single render. Since setData triggers a re-render, we create an infinite loop! Browser tab memory spikes to 1.5GB. CRASH!",
        isCorrect: false,
        animationEffect: "infinite-api"
      },
      {
        text: "Add an empty dependency array [] to run only on mount.",
        action: "add-empty",
        outcome: "Success! The effect runs once on component mount. Data is fetched once and the state updates smoothly. No loop created.",
        isCorrect: true,
        animationEffect: "success"
      }
    ],
    explanation: "When you omit the dependency array in useEffect, React executes the effect after every single render. If your effect updates state, it triggers a re-render, creating an infinite loop. Providing an empty array `[]` ensures the effect runs only once when the component mounts.",
    interviewQ: "What is the difference between omitting the dependency array, passing an empty array, and passing values in useEffect?",
    interviewAnswer: "Omitting the array makes the effect run on every render. An empty array [] runs it once on mount. Passing variables [depA, depB] runs it on mount and whenever those specific dependencies change.",
    xpReward: 10
  },
  {
    id: 2,
    title: "State Batching & Stale Closures",
    story: "We're building a multi-click feedback button at DevCorp. Users report that fast clicking doesn't register all hits. The UI says 1 click even if they clicked 3 times rapidly.",
    concept: "stale closures in functional components",
    sender: "Sarah (Senior UI Engineer)",
    code: `// src/components/FeedbackButton.tsx
import { useState } from 'react';

export function FeedbackButton() {
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setTimeout(() => {
      setLikes(likes + 1); // <-- Stale closure trap!
    }, 1000);
  };

  return (
    <button onClick={handleLike} className="btn">
      Likes: {likes}
    </button>
  );
}`,
    question: "Sarah asks: 'If a user clicks this button three times in quick succession (under 1 second), why does the count only increment by 1 instead of 3?'",
    choices: [
      {
        text: "JavaScript's setTimeout is single-threaded and drops clicks.",
        action: "blame-setTimeout",
        outcome: "Sarah sighs: 'JavaScript event loop handles timeouts correctly. The clicks aren't lost, the closure holds stale data. Try again.'",
        isCorrect: false,
        animationEffect: "re-render"
      },
      {
        text: "Simulate rapid clicks and inspect values.",
        action: "simulate-clicks",
        outcome: "WARNING: Each click captures the 'likes' value from its respective render cycle (which is 0). After 1 second, three timeouts trigger, all executing 'setLikes(0 + 1)'. State resolves to 1.",
        isCorrect: false,
        animationEffect: "stale-state"
      },
      {
        text: "Use functional state update: setLikes(prev => prev + 1).",
        action: "solve-functional",
        outcome: "Success! The functional updater accepts the actual pending state value at the execution time rather than the closed-over value. Likes update to 3 correctly!",
        isCorrect: true,
        animationEffect: "success"
      }
    ],
    explanation: "React state updates inside asynchronous closures (like setTimeout, event listeners, promises) refer to the state value at the time the closure was created. This leads to 'stale closures'. Using a functional state updater `setLikes(prev => prev + 1)` guarantees you are calculating the next state using the most up-to-date state value.",
    interviewQ: "Why should you use functional state updates (e.g. setState(prev => prev + 1))?",
    interviewAnswer: "Functional updates are necessary when the next state depends on the previous state and there is a risk of stale state values (such as inside async callbacks, timeouts, or batching cycles), ensuring the calculation uses the actual current state.",
    xpReward: 10
  }
];
