export const ICON_PATHS = {
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
  clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
  settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
  check: '<polyline points="20 6 9 17 4 12"></polyline>',
  pause: '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>',
  play: '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
  x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
  chevronLeft: '<polyline points="15 18 9 12 15 6"></polyline>',
  chevronRight: '<polyline points="9 18 15 12 9 6"></polyline>',
  search: '<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>'
};

export const themePresets = {
  pastel: {
    label: "Pastel (default)",
    bg: "linear-gradient(135deg, #a8e6cf, #dcd3f0, #ffd3e0)",
    categories: [
      { name: "Work",     accent: "#6c8cf5", soft: "rgba(108,140,245,0.25)" },
      { name: "Home",     accent: "#f0b429", soft: "rgba(240,180,41,0.25)" },
      { name: "Other",    accent: "#9b7fe8", soft: "rgba(155,127,232,0.25)" },
      { name: "Personal", accent: "#f2789f", soft: "rgba(242,120,159,0.25)" }
    ]
  },
  ocean: {
    label: "Ocean",
    bg: "linear-gradient(135deg, #8fd3f4, #a1c4fd, #c2e9fb)",
    categories: [
      { name: "Work",     accent: "#2f6fed", soft: "rgba(47,111,237,0.25)" },
      { name: "Home",     accent: "#17b3a3", soft: "rgba(23,179,163,0.25)" },
      { name: "Other",    accent: "#5b6ee1", soft: "rgba(91,110,225,0.25)" },
      { name: "Personal", accent: "#2ba0c9", soft: "rgba(43,160,201,0.25)" }
    ]
  },
  sunset: {
    label: "Sunset",
    bg: "linear-gradient(135deg, #ffb88c, #ff7eb3, #d291f2)",
    categories: [
      { name: "Work",     accent: "#e8622c", soft: "rgba(232,98,44,0.25)" },
      { name: "Home",     accent: "#f0975a", soft: "rgba(240,151,90,0.25)" },
      { name: "Other",    accent: "#c15fc2", soft: "rgba(193,95,194,0.25)" },
      { name: "Personal", accent: "#e0507a", soft: "rgba(224,80,122,0.25)" }
    ]
  }
};

export const VISIBLE_COLS = 3;

export const defaultMyTasks = [
  { id: 1, title: "Learn JavaScript basics", sub: "Complete ES6 tutorial", time: "10:00 - 11:30", list: "Work", completed: false },
  { id: 2, title: "Build the to-do app", sub: "Implement drag & drop", time: "Due Today", list: "Work", completed: false },
  { id: 3, title: "Review pull requests", sub: "Team repo #42, #43", time: "14:00 - 15:00", list: "Work", completed: true },
  { id: 4, title: "Write unit tests", sub: "Coverage for auth module", time: "Due Fri", list: "Work", completed: false },
  { id: 5, title: "Update API documentation", sub: "New endpoints for v2", time: "Next week", list: "Work", completed: false },
  { id: 6, title: "Grocery shopping", sub: "Milk, eggs, bread, veggies", time: "After work", list: "Home", completed: false },
  { id: 7, title: "Clean the garage", sub: "Sort boxes and donate old items", time: "Weekend", list: "Home", completed: false },
  { id: 8, title: "Fix kitchen faucet", sub: "Replace washer", time: "", list: "Home", completed: true },
  { id: 9, title: "Water the plants", sub: "Indoor & balcony", time: "Every morning", list: "Home", completed: false },
  { id: 10, title: "Plan weekend trip", sub: "Check hotel availability", time: "", list: "Other", completed: false },
  { id: 11, title: "Read 'Atomic Habits'", sub: "Chapters 5-8", time: "Before bed", list: "Other", completed: false },
  { id: 12, title: "Morning yoga routine", sub: "30 min session", time: "6:30 AM", list: "Personal", completed: false },
  { id: 13, title: "Practice guitar", sub: "New song chords", time: "20:00 - 21:00", list: "Personal", completed: true }
];

export const defaultTeamTasks = [
  { id: 101, title: "Design homepage mockup", sub: "Figma file v2", time: "Due Fri", list: "Work", assignee: "Sara", completed: false, needsReview: false },
  { id: 102, title: "Sprint planning meeting", sub: "Q2 roadmap review", time: "Mon 10:00", list: "Work", assignee: "Ali", completed: false, needsReview: false },
  { id: 103, title: "Database migration script", sub: "Users table schema update", time: "Due Wed", list: "Work", assignee: "Insha", completed: true, needsReview: true },
  { id: 104, title: "Office cleaning schedule", sub: "Rotate monthly", time: "", list: "Home", assignee: "Sara", completed: false, needsReview: false },
  { id: 105, title: "Order new stationery", sub: "Whiteboard markers", time: "This week", list: "Home", assignee: "Ali", completed: true, needsReview: false },
  { id: 106, title: "Fix login bug", sub: "Auth token expiry issue", time: "Due Today", list: "Other", assignee: "Ali", completed: true, needsReview: true },
  { id: 107, title: "Update team handbook", sub: "Add onboarding section", time: "", list: "Other", assignee: "Sara", completed: false, needsReview: false },
  { id: 108, title: "Team building event", sub: "Plan outdoor activities", time: "Next month", list: "Personal", assignee: "Insha", completed: false, needsReview: false }
];

