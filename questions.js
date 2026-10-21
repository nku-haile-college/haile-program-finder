// Haile Grad Program Finder: program content and quiz questions.
// Edit this file to change wording, program facts, or scoring.
//
// PROGRAMS: what the results page shows for each degree.
// QUESTIONS: each option has
//   t    = answer text, d = optional helper text
//   s    = points added to each program, e.g. {MBA: 3, MAcc: 1}
//   why  = reason shown on the results page for that program (optional)
//   flag = special handling: "noexp" blocks MBLI from being the top result;
//          "expedited" / "acct" choose the suggested MAcc track
// See SCORING.md for the full scoring table.

const PROGRAMS = {
  MBA: {
    name: "Master of Business Administration",
    short: "MBA",
    pitch: "A flexible, fully online degree that builds a cross-functional business toolkit: strategy, finance, marketing, analytics and leadership, with a concentration you choose.",
    facts: [
      ["Format", "100% online, 7-week courses"],
      ["Length", "33 credit hours, as few as 12 months"],
      ["Starts", "Several start dates a year"],
      ["Concentrations", "General, Finance, HR, Leadership, Project Management"],
      ["Capstone", "Team consulting project for a real organization"],
      ["Admission", "Transcripts (2.5+ GPA), resume; under 3.0 GPA needs 3 years' work experience"]
    ],
    link: "https://onlinedegrees.nku.edu/programs/business/mba/",
    contact: "Online enrollment: 800-985-7215"
  },
  MAcc: {
    name: "Master of Accountancy",
    short: "MAcc",
    pitch: "The pathway to the CPA. Earn the credit hours to sit for the exam, with Becker CPA Review built into the curriculum and a track matched to your background.",
    facts: [
      ["Format", "Online and on-campus options, accelerated courses"],
      ["Length", "30–36 credit hours depending on track"],
      ["CPA prep", "Becker CPA Review integrated, student discount"],
      ["Tracks", "Professional, Data Analytics/Visualization, Accounting Transition (APRT), Expedited (NKU undergrads)"],
      ["Outcome", "Meets the 150 credit hours needed to sit for the CPA Exam"],
      ["Support", "Haile Foundation scholarships for MAcc students"]
    ],
    link: "https://nku.edu/MAcc",
    contact: "Kari Wright Perkins, Assistant Director · wrightk11@nku.edu · 859.572.6657"
  },
  MBLI: {
    name: "Master of Business Leadership & Innovation",
    short: "MBLI",
    pitch: "The business degree for the people person. A two-year hybrid cohort focused on emotional intelligence, leading change and innovation, with a 10-day international experience.",
    facts: [
      ["Format", "Hybrid cohort: online courses plus interactive Saturday sessions"],
      ["Length", "36 credit hours over two years"],
      ["Starts", "Each fall; applications reviewed in rounds"],
      ["Signature", "10-day international experience with your cohort"],
      ["Capstone", "Multi-semester Action Research Project in your own workplace"],
      ["Admission", "3+ years of professional leadership experience, essay, two references, interview"]
    ],
    link: "https://www.nku.edu/MBLI",
    contact: "Kari Wright Perkins, Assistant Director · wrightk11@nku.edu · 859.572.6657"
  }
};

// Each option: s = points {MBA, MAcc, MBLI}; why = reason shown for programs it favors; flag = special handling
const QUESTIONS = [
  { id: "goal", q: "What's the main reason you're considering a master's degree?",
    opts: [
      { t: "Become a CPA or advance in accounting", d: "Public accounting, audit, tax, controller track", s: {MAcc: 4}, why: {MAcc: "You want a CPA or accounting career, which is exactly what the MAcc is built for."} },
      { t: "Move up with a broader business skill set", d: "Promotion into management, or a bigger role", s: {MBA: 4, MBLI: 1}, why: {MBA: "You want broad business knowledge to move up, the MBA's core promise."} },
      { t: "Become a stronger leader of people and change", d: "Teams, culture, influence, transformation", s: {MBLI: 4, MBA: 1}, why: {MBLI: "Your goal is growing as a leader of people and change, the heart of MBLI."} },
      { t: "Change careers into a new field", d: "Not sure yet which direction", s: {MBA: 2, MAcc: 1, MBLI: 1}, why: {MBA: "You're changing careers, and the MBA's breadth keeps many doors open."} }
    ]},
  { id: "energy", q: "Which kind of work gives you the most energy?",
    opts: [
      { t: "Getting the numbers exactly right", d: "Reconciling, applying rules, finding errors", s: {MAcc: 3}, why: {MAcc: "Precision with numbers and rules energizes you."} },
      { t: "Solving big-picture business problems", d: "Strategy, markets, operations, decisions", s: {MBA: 3}, why: {MBA: "You like solving big-picture business problems across functions."} },
      { t: "Coaching people and shaping culture", d: "Developing others, building trust, leading teams", s: {MBLI: 3}, why: {MBLI: "Coaching people and shaping culture is what energizes you."} },
      { t: "Turning data into insight", d: "Dashboards, analytics, patterns", s: {MBA: 2, MAcc: 2}, why: {MBA: "You like data-driven decisions, a thread through the MBA's analytics and AI coursework.", MAcc: "You like data work, and the MAcc has a dedicated Data Analytics/Visualization track."} }
    ]},
  { id: "cpa", q: "Do you plan to sit for the CPA Exam?",
    opts: [
      { t: "Yes, it's a big part of my plan", s: {MAcc: 5}, why: {MAcc: "You plan to take the CPA Exam. The MAcc gets you to 150 hours with Becker CPA Review built in."} },
      { t: "Maybe someday", s: {MAcc: 1} },
      { t: "No", s: {MBA: 1, MBLI: 1} }
    ]},
  { id: "degree", q: "What's your undergraduate background?",
    opts: [
      { t: "I'm a current NKU accounting undergrad", s: {MAcc: 3}, flag: "expedited", why: {MAcc: "As an NKU accounting student you may qualify for the Expedited Track (BSBA + MAcc in five years)."} },
      { t: "Accounting degree", s: {MAcc: 2}, flag: "acct", why: {MAcc: "Your accounting degree lines up with the MAcc Professional or Data Analytics track."} },
      { t: "Business degree, not accounting", s: {MBA: 2, MBLI: 1}, flag: "biz" },
      { t: "Non-business degree", d: "Liberal arts, sciences, engineering, health, etc.", s: {MBA: 2, MBLI: 1, MAcc: 1}, flag: "nonacct", why: {MBA: "Coming from outside business, the MBA's core gives you a full business foundation."} }
    ]},
  { id: "exp", q: "How much professional work experience do you have?",
    opts: [
      { t: "Less than 1 year", s: {MBA: 1, MAcc: 2}, flag: "noexp" },
      { t: "1–3 years", s: {MBA: 2, MAcc: 1}, flag: "noexp" },
      { t: "3+ years, mostly as an individual contributor", s: {MBA: 2, MBLI: 1} },
      { t: "3+ years leading people, teams or projects", s: {MBLI: 3, MBA: 2}, why: {MBLI: "You have the 3+ years of leadership experience MBLI looks for."} }
    ]},
  { id: "learn", q: "How do you learn best?",
    opts: [
      { t: "Online, on my own schedule", d: "Short courses I can fit around work", s: {MBA: 3, MAcc: 2}, why: {MBA: "You want online flexibility, and the MBA is 100% online in 7-week courses.", MAcc: "You want flexibility, and the MAcc offers online accelerated courses."} },
      { t: "With the same group start to finish", d: "Candid conversation, in-person sessions", s: {MBLI: 4}, why: {MBLI: "You learn best in a close cohort, which is how MBLI runs, with Saturday sessions together."} },
      { t: "Structured, exam-focused coursework", d: "Clear content I'll be tested on", s: {MAcc: 3}, why: {MAcc: "You like structured, exam-focused learning, which suits CPA prep."} }
    ]},
  { id: "time", q: "What timeline fits your life?",
    opts: [
      { t: "As fast as possible", d: "Done in about a year", s: {MBA: 3, MAcc: 2}, why: {MBA: "You want speed; the MBA can be finished in as few as 12 months."} },
      { t: "Start soon, whenever I'm ready", d: "I don't want to wait for a set start date", s: {MBA: 3, MAcc: 1}, why: {MBA: "You want to start soon, and the MBA has several start dates a year."} },
      { t: "A steady two years is fine", d: "I'd rather go deep than fast", s: {MBLI: 3}, why: {MBLI: "A steady two-year pace suits you, matching MBLI's cohort timeline."} }
    ]},
  { id: "travel", q: "How does a 10-day international business trip with your classmates sound?",
    opts: [
      { t: "Exciting, I'd love that", s: {MBLI: 3}, why: {MBLI: "The 10-day international experience appeals to you, and it's a signature part of MBLI."} },
      { t: "Nice, but not a priority", s: {} },
      { t: "Hard for me to make work", s: {MBA: 1, MAcc: 1, MBLI: -2} }
    ]},
  { id: "capstone", q: "Which final project would you rather do?",
    opts: [
      { t: "Consult for a real company as a team", d: "Diagnose a strategic problem, present to executives", s: {MBA: 3}, why: {MBA: "You'd pick a consulting capstone for a real organization, which is the MBA's final course."} },
      { t: "Research and solve a real issue at my own workplace", d: "A multi-semester project you lead", s: {MBLI: 3}, why: {MBLI: "You'd rather solve a real issue at work, which is what MBLI's Action Research Project does."} },
      { t: "Prepare for and pass the CPA Exam", d: "Analytics capstone plus CPA review courses", s: {MAcc: 3}, why: {MAcc: "You'd rather spend your final courses on CPA review, built into the MAcc."} }
    ]},
  { id: "future", q: "Five years from now, which sounds most like you?",
    opts: [
      { t: "A trusted CPA, controller or audit leader", s: {MAcc: 3}, why: {MAcc: "You see yourself as a CPA or accounting leader."} },
      { t: "A manager or director who knows every side of the business", s: {MBA: 3}, why: {MBA: "You picture yourself as a well-rounded manager or director."} },
      { t: "The leader people want to follow through change", s: {MBLI: 3}, why: {MBLI: "You picture yourself leading people through change."} }
    ]}
];
