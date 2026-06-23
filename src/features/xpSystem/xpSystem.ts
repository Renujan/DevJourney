import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DevLevel = 'Beginner 👶' | 'Junior Dev 💻' | 'Mid Dev ⚡' | 'Senior Dev 🧠' | 'Architect 🏗️';

export interface XPState {
  xp: number;
  level: DevLevel;
  badges: string[];
  completedLessons: number[]; // React/Backend lesson IDs
  fixedErrors: string[]; // HTTP codes e.g. ['404']
  unlockedNodes: string[]; // Roadmap node IDs e.g. ['html']
  completedRoadmap: string[];
  interviewScores: Record<string, number>; // { beginner: 0, developer: 0, senior: 0 }
  
  // Actions
  addXP: (amount: number) => void;
  completeLesson: (id: number) => void;
  fixError: (code: string) => void;
  unlockRoadmapNode: (id: string) => void;
  completeRoadmapNode: (id: string) => void;
  submitInterviewScore: (level: string, score: number) => void;
  earnBadge: (badgeId: string) => void;
  resetProgress: () => void;
}

const getLevelFromXP = (xp: number): DevLevel => {
  if (xp < 50) return 'Beginner 👶';
  if (xp < 150) return 'Junior Dev 💻';
  if (xp < 300) return 'Mid Dev ⚡';
  if (xp < 500) return 'Senior Dev 🧠';
  return 'Architect 🏗️';
};

export const useXPSystem = create<XPState>()(
  persist(
    (set) => ({
      xp: 0,
      level: 'Beginner 👶',
      badges: [],
      completedLessons: [],
      fixedErrors: [],
      unlockedNodes: ['html'], // Start with HTML unlocked
      completedRoadmap: [],
      interviewScores: { beginner: 0, developer: 0, senior: 0 },

      addXP: (amount) => {
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = getLevelFromXP(newXP);
          
          // Badge trigger checks
          const currentBadges = [...state.badges];
          
          return {
            xp: newXP,
            level: newLevel,
            badges: currentBadges
          };
        });
      },

      completeLesson: (id) => {
        set((state) => {
          if (state.completedLessons.includes(id)) return {};
          
          const newLessons = [...state.completedLessons, id];
          const addedXP = 10;
          const newXP = state.xp + addedXP;
          const newLevel = getLevelFromXP(newXP);
          
          const currentBadges = [...state.badges];
          if (newLessons.length >= 2 && !currentBadges.includes('React Ninja ⚛️')) {
            currentBadges.push('React Ninja ⚛️');
          }

          return {
            completedLessons: newLessons,
            xp: newXP,
            level: newLevel,
            badges: currentBadges
          };
        });
      },

      fixError: (code) => {
        set((state) => {
          if (state.fixedErrors.includes(code)) return {};
          
          const newErrors = [...state.fixedErrors, code];
          const addedXP = 20;
          const newXP = state.xp + addedXP;
          const newLevel = getLevelFromXP(newXP);
          
          const currentBadges = [...state.badges];
          if (newErrors.length >= 2 && !currentBadges.includes('Bug Slayer 🐞')) {
            currentBadges.push('Bug Slayer 🐞');
          }
          if (newErrors.includes('CORS') && newErrors.includes('404') && !currentBadges.includes('API Master 🌐')) {
            currentBadges.push('API Master 🌐');
          }

          return {
            fixedErrors: newErrors,
            xp: newXP,
            level: newLevel,
            badges: currentBadges
          };
        });
      },

      unlockRoadmapNode: (id) => {
        set((state) => {
          if (state.unlockedNodes.includes(id)) return {};
          return {
            unlockedNodes: [...state.unlockedNodes, id]
          };
        });
      },

      completeRoadmapNode: (id) => {
        set((state) => {
          if (state.completedRoadmap.includes(id)) return {};
          
          const newCompleted = [...state.completedRoadmap, id];
          const addedXP = 15;
          const newXP = state.xp + addedXP;
          const newLevel = getLevelFromXP(newXP);

          // Find index of completed node in the order: html -> css -> javascript -> react_basics -> api_integration -> cookies_session -> advanced_react -> projects -> interview_prep
          const order = ["html", "css", "javascript", "react_basics", "api_integration", "cookies_session", "advanced_react", "projects", "interview_prep"];
          const currentIndex = order.indexOf(id);
          const nextNode = currentIndex !== -1 && currentIndex + 1 < order.length ? order[currentIndex + 1] : null;

          const currentUnlocked = [...state.unlockedNodes];
          if (nextNode && !currentUnlocked.includes(nextNode)) {
            currentUnlocked.push(nextNode);
          }

          return {
            completedRoadmap: newCompleted,
            unlockedNodes: currentUnlocked,
            xp: newXP,
            level: newLevel
          };
        });
      },

      submitInterviewScore: (level, score) => {
        set((state) => {
          const currentScores = { ...state.interviewScores };
          const previousBest = currentScores[level] || 0;
          
          if (score > previousBest) {
            currentScores[level] = score;
          }

          const addedXP = score * 10; // 10 XP per correct answer
          const newXP = state.xp + addedXP;
          const newLevel = getLevelFromXP(newXP);

          const currentBadges = [...state.badges];
          // Check if scored well across developer level
          if (level === 'developer' && score >= 2 && !currentBadges.includes('React Ninja ⚛️')) {
            currentBadges.push('React Ninja ⚛️');
          }
          if (score >= 3 && !currentBadges.includes('Interview King 👑')) {
            currentBadges.push('Interview King 👑');
          }

          return {
            interviewScores: currentScores,
            xp: newXP,
            level: newLevel,
            badges: currentBadges
          };
        });
      },

      earnBadge: (badgeId) => {
        set((state) => {
          if (state.badges.includes(badgeId)) return {};
          
          const currentBadges = [...state.badges, badgeId];
          const addedXP = badgeId.includes('Cookies & Sessions Master') ? 100 : 25;
          const newXP = state.xp + addedXP;
          const newLevel = getLevelFromXP(newXP);
          
          return {
            badges: currentBadges,
            xp: newXP,
            level: newLevel
          };
        });
      },

      resetProgress: () => {
        set({
          xp: 0,
          level: 'Beginner 👶',
          badges: [],
          completedLessons: [],
          fixedErrors: [],
          unlockedNodes: ['html'],
          completedRoadmap: [],
          interviewScores: { beginner: 0, developer: 0, senior: 0 }
        });
      }
    }),
    {
      name: 'devjourney-xp-storage'
    }
  )
);
