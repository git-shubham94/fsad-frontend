export const activityCategories = [
  { id: 'sports', name: 'Sports', icon: '⚽', color: '#10b981' },
  { id: 'cultural', name: 'Cultural', icon: '🎭', color: '#f59e0b' },
  { id: 'technical', name: 'Technical', icon: '💻', color: '#3b82f6' },
  { id: 'academic', name: 'Academic', icon: '📚', color: '#8b5cf6' },
  { id: 'social', name: 'Social Service', icon: '🤝', color: '#ec4899' },
  { id: 'leadership', name: 'Leadership', icon: '👑', color: '#ef4444' },
  { id: 'entrepreneurship', name: 'Entrepreneurship', icon: '💡', color: '#14b8a6' },
  { id: 'other', name: 'Other', icon: '🌟', color: '#6366f1' }
];

export const students = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@student.com",
    password: "password123",
    rollNumber: "21BCE001",
    cohort: "2021-2025",
    department: "CSE",
    phone: "9876543210"
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@student.com",
    password: "password123",
    rollNumber: "21BCE002",
    cohort: "2021-2025",
    department: "ECE",
    phone: "9876543211"
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit@student.com",
    password: "password123",
    rollNumber: "21BCE003",
    cohort: "2021-2025",
    department: "CSE",
    phone: "9876543212"
  },
  {
    id: 4,
    name: "Sneha Reddy",
    email: "sneha@student.com",
    password: "password123",
    rollNumber: "21BCE004",
    cohort: "2021-2025",
    department: "IT",
    phone: "9876543213"
  },
  {
    id: 5,
    name: "Karthik Kumar",
    email: "karthik@student.com",
    password: "password123",
    rollNumber: "21BCE005",
    cohort: "2021-2025",
    department: "CSE",
    phone: "9876543214"
  }
];

export const achievements = [
  {
    id: 1,
    studentId: 1,
    title: "Winner - Smart India Hackathon 2024",
    category: "award",
    activityCategory: "technical",
    description: "First prize in software edition for developing accessibility platform",
    date: "2024-09-15",
    certificate: null
  },
  {
    id: 2,
    studentId: 1,
    title: "Best Student Award",
    category: "recognition",
    activityCategory: "academic",
    description: "Recognized for academic and extracurricular excellence",
    date: "2024-08-20",
    certificate: null
  },
  {
    id: 3,
    studentId: 2,
    title: "Inter-College Football Champion",
    category: "award",
    activityCategory: "sports",
    description: "Won first place in inter-college football tournament",
    date: "2024-10-05",
    certificate: null
  },
  {
    id: 4,
    studentId: 2,
    title: "Best Project Award - Tech Fest",
    category: "award",
    activityCategory: "technical",
    description: "Won best project for IoT-based smart home automation",
    date: "2024-07-10",
    certificate: null
  },
  {
    id: 5,
    studentId: 3,
    title: "Dean's List",
    category: "recognition",
    activityCategory: "academic",
    description: "Achieved Dean's List for maintaining GPA above 9.0",
    date: "2024-05-30",
    certificate: null
  },
  {
    id: 6,
    studentId: 3,
    title: "Google Code Jam Participation",
    category: "participation",
    activityCategory: "technical",
    description: "Qualified for Round 2 of Google Code Jam 2024",
    date: "2024-04-15",
    certificate: null
  },
  {
    id: 7,
    studentId: 4,
    title: "Cultural Fest Lead Organizer",
    category: "participation",
    activityCategory: "cultural",
    description: "Led a team of 50 students in organizing annual cultural festival",
    date: "2024-03-20",
    certificate: null
  },
  {
    id: 8,
    studentId: 5,
    title: "Open Source Contributor",
    category: "recognition",
    activityCategory: "technical",
    description: "Contributed to 5+ open source projects on GitHub",
    date: "2024-06-01",
    certificate: null
  }
];

export const participations = [
  {
    id: 1,
    studentId: 1,
    activityName: "Coding Club",
    activityCategory: "technical",
    role: "President",
    duration: "1 year",
    skills: ["Leadership", "Python", "React"],
    startDate: "2023-08-01",
    endDate: "2024-08-01"
  },
  {
    id: 2,
    studentId: 1,
    activityName: "Tech Fest Organizing Committee",
    activityCategory: "technical",
    role: "Technical Head",
    duration: "6 months",
    skills: ["Event Management", "Team Leadership"],
    startDate: "2024-01-01",
    endDate: "2024-06-30"
  },
  {
    id: 3,
    studentId: 2,
    activityName: "Football Team",
    activityCategory: "sports",
    role: "Team Captain",
    duration: "2 years",
    skills: ["Leadership", "Teamwork", "Strategy"],
    startDate: "2022-08-01",
    endDate: "2024-08-01"
  },
  {
    id: 4,
    studentId: 2,
    activityName: "IEEE Student Chapter",
    activityCategory: "technical",
    role: "Volunteer",
    duration: "1 year",
    skills: ["Technical Writing", "Event Planning"],
    startDate: "2023-06-01",
    endDate: "2024-06-01"
  },
  {
    id: 5,
    studentId: 3,
    activityName: "Competitive Programming Club",
    activityCategory: "technical",
    role: "Active Member",
    duration: "3 years",
    skills: ["Problem Solving", "Algorithms", "C++"],
    startDate: "2021-08-01",
    endDate: "2024-08-01"
  },
  {
    id: 6,
    studentId: 4,
    activityName: "Dance Team",
    activityCategory: "cultural",
    role: "Captain",
    duration: "2 years",
    skills: ["Leadership", "Choreography", "Performance"],
    startDate: "2022-08-01",
    endDate: "2024-08-01"
  },
  {
    id: 7,
    studentId: 5,
    activityName: "Open Source Community",
    activityCategory: "technical",
    role: "Contributor",
    duration: "1.5 years",
    skills: ["Git", "JavaScript", "Collaboration"],
    startDate: "2023-01-01",
    endDate: "2024-06-30"
  }
];
