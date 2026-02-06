import {
  BookOpen,
  Briefcase,
  Calculator,
  Cpu,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Landmark,
  Leaf,
  LineChart,
  Palette,
  Scale,
  Shield,
  TrendingUp,
} from "lucide-react";

export type PastPaper = {
  id: string;
  code: string;
  name: string;
  description: string;
  year: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  pastPapers: PastPaper[];
  documents: {
    id: string;
    title: string;
    description: string;
  }[];
};

export type Department = {
  id: string;
  name: string;
  documents: number;
  icon: typeof BookOpen;
  color: string;
  courses: Course[];
};

export const departments: Department[] = [
  {
    id: "computer-science",
    name: "Computer Science",
    documents: 856,
    icon: Cpu,
    color: "bg-blue-500",
    courses: [
      {
        id: "cs-201",
        code: "CS 201",
        name: "Data Structures",
        description: "Trees, graphs, hashing, and algorithmic design.",
        icon: Cpu,
        pastPapers: [
          {
            id: "cs201-2024-fall",
            code: "CS 201",
            name: "Final Exam",
            description: "Comprehensive final covering graphs and heaps.",
            year: "2024",
          },
          {
            id: "cs201-2023-spring",
            code: "CS 201",
            name: "Midterm",
            description: "Arrays, stacks, queues, and recursion.",
            year: "2023",
          },
        ],
        documents: [
          {
            id: "cs201-notes",
            title: "Lecture Notes",
            description: "Weekly notes and code examples.",
          },
          {
            id: "cs201-labs",
            title: "Lab Manuals",
            description: "Hands-on programming exercises.",
          },
        ],
      },
      {
        id: "cs-315",
        code: "CS 315",
        name: "Machine Learning",
        description: "Supervised learning, evaluation, and feature engineering.",
        icon: Cpu,
        pastPapers: [
          {
            id: "cs315-2024-fall",
            code: "CS 315",
            name: "Final Exam",
            description: "Model evaluation and bias-variance tradeoffs.",
            year: "2024",
          },
        ],
        documents: [
          {
            id: "cs315-slides",
            title: "Slides",
            description: "Full slide deck with annotations.",
          },
          {
            id: "cs315-project",
            title: "Project Brief",
            description: "Capstone project rubric and milestones.",
          },
        ],
      },
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    documents: 642,
    icon: Calculator,
    color: "bg-emerald-500",
    courses: [
      {
        id: "math-221",
        code: "MATH 221",
        name: "Linear Algebra",
        description: "Vector spaces, matrices, and eigenvalues.",
        icon: Calculator,
        pastPapers: [
          {
            id: "math221-2024-spring",
            code: "MATH 221",
            name: "Midterm",
            description: "Matrices, determinants, and linear systems.",
            year: "2024",
          },
        ],
        documents: [
          {
            id: "math221-worksheet",
            title: "Problem Sets",
            description: "Weekly practice worksheets.",
          },
        ],
      },
      {
        id: "math-240",
        code: "MATH 240",
        name: "Calculus II",
        description: "Sequences, series, and integration techniques.",
        icon: Calculator,
        pastPapers: [
          {
            id: "math240-2023-fall",
            code: "MATH 240",
            name: "Final Exam",
            description: "Series tests and convergence.",
            year: "2023",
          },
        ],
        documents: [
          {
            id: "math240-notes",
            title: "Course Notes",
            description: "Instructor's curated notes.",
          },
        ],
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    documents: 789,
    icon: TrendingUp,
    color: "bg-orange-500",
    courses: [
      {
        id: "eng-210",
        code: "ENGR 210",
        name: "Statics",
        description: "Forces, moments, and equilibrium analysis.",
        icon: TrendingUp,
        pastPapers: [
          {
            id: "engr210-2024-fall",
            code: "ENGR 210",
            name: "Final Exam",
            description: "Trusses and frames problems.",
            year: "2024",
          },
        ],
        documents: [
          {
            id: "engr210-formulas",
            title: "Formula Sheet",
            description: "Core equations for statics.",
          },
        ],
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    documents: 445,
    icon: FlaskConical,
    color: "bg-pink-500",
    courses: [
      {
        id: "chem-110",
        code: "CHEM 110",
        name: "General Chemistry",
        description: "Stoichiometry, bonding, and thermodynamics.",
        icon: FlaskConical,
        pastPapers: [
          {
            id: "chem110-2023-fall",
            code: "CHEM 110",
            name: "Midterm",
            description: "Thermochemistry and gases.",
            year: "2023",
          },
        ],
        documents: [
          {
            id: "chem110-lab",
            title: "Lab Workbook",
            description: "Experiments and safety protocols.",
          },
        ],
      },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    documents: 512,
    icon: Leaf,
    color: "bg-teal-500",
    courses: [
      {
        id: "bio-101",
        code: "BIO 101",
        name: "Intro Biology",
        description: "Cell structure, genetics, and evolution.",
        icon: Leaf,
        pastPapers: [
          {
            id: "bio101-2024-spring",
            code: "BIO 101",
            name: "Final Exam",
            description: "Evolution and ecology focus.",
            year: "2024",
          },
        ],
        documents: [
          {
            id: "bio101-guide",
            title: "Study Guide",
            description: "Key terms and diagrams.",
          },
        ],
      },
    ],
  },
  {
    id: "business",
    name: "Business",
    documents: 398,
    icon: Briefcase,
    color: "bg-indigo-500",
    courses: [
      {
        id: "bus-205",
        code: "BUS 205",
        name: "Marketing Foundations",
        description: "Market research and segmentation.",
        icon: Briefcase,
        pastPapers: [
          {
            id: "bus205-2023-fall",
            code: "BUS 205",
            name: "Final Exam",
            description: "Marketing mix and brand strategy.",
            year: "2023",
          },
        ],
        documents: [
          {
            id: "bus205-cases",
            title: "Case Studies",
            description: "Real-world marketing briefs.",
          },
        ],
      },
    ],
  },
  {
    id: "economics",
    name: "Economics",
    documents: 334,
    icon: LineChart,
    color: "bg-red-500",
    courses: [
      {
        id: "econ-201",
        code: "ECON 201",
        name: "Microeconomics",
        description: "Consumer behavior and market equilibrium.",
        icon: LineChart,
        pastPapers: [
          {
            id: "econ201-2024-spring",
            code: "ECON 201",
            name: "Midterm",
            description: "Supply, demand, and elasticity.",
            year: "2024",
          },
        ],
        documents: [
          {
            id: "econ201-notes",
            title: "Lecture Notes",
            description: "Lecture summaries and graphs.",
          },
        ],
      },
    ],
  },
  {
    id: "psychology",
    name: "Psychology",
    documents: 287,
    icon: HeartPulse,
    color: "bg-rose-500",
    courses: [
      {
        id: "psy-120",
        code: "PSY 120",
        name: "Cognitive Psychology",
        description: "Memory, perception, and attention.",
        icon: HeartPulse,
        pastPapers: [
          {
            id: "psy120-2023-fall",
            code: "PSY 120",
            name: "Final Exam",
            description: "Memory models and cognitive biases.",
            year: "2023",
          },
        ],
        documents: [
          {
            id: "psy120-readings",
            title: "Reading Pack",
            description: "Curated journal excerpts.",
          },
        ],
      },
    ],
  },
  {
    id: "law",
    name: "Law",
    documents: 214,
    icon: Scale,
    color: "bg-slate-600",
    courses: [
      {
        id: "law-101",
        code: "LAW 101",
        name: "Constitutional Law",
        description: "Foundations of legal systems.",
        icon: Scale,
        pastPapers: [
          {
            id: "law101-2024-spring",
            code: "LAW 101",
            name: "Midterm",
            description: "Separation of powers and rights.",
            year: "2024",
          },
        ],
        documents: [
          {
            id: "law101-briefs",
            title: "Case Briefs",
            description: "Summaries of landmark cases.",
          },
        ],
      },
    ],
  },
  {
    id: "arts-design",
    name: "Arts & Design",
    documents: 276,
    icon: Palette,
    color: "bg-fuchsia-500",
    courses: [
      {
        id: "art-150",
        code: "ART 150",
        name: "Visual Communication",
        description: "Typography, color, and layout systems.",
        icon: Palette,
        pastPapers: [
          {
            id: "art150-2023-fall",
            code: "ART 150",
            name: "Final Critique",
            description: "Portfolio evaluation rubric.",
            year: "2023",
          },
        ],
        documents: [
          {
            id: "art150-briefs",
            title: "Project Briefs",
            description: "Assignments and deliverables.",
          },
        ],
      },
    ],
  },
  {
    id: "environmental-science",
    name: "Environmental Sci.",
    documents: 193,
    icon: Leaf,
    color: "bg-lime-600",
    courses: [
      {
        id: "env-210",
        code: "ENV 210",
        name: "Climate Systems",
        description: "Atmospheric science and climate change.",
        icon: Leaf,
        pastPapers: [
          {
            id: "env210-2024-fall",
            code: "ENV 210",
            name: "Final Exam",
            description: "Climate models and data analysis.",
            year: "2024",
          },
        ],
        documents: [
          {
            id: "env210-labs",
            title: "Lab Guides",
            description: "Fieldwork and lab methodologies.",
          },
        ],
      },
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    documents: 248,
    icon: Shield,
    color: "bg-sky-600",
    courses: [
      {
        id: "cyb-230",
        code: "CYB 230",
        name: "Network Security",
        description: "Threat models and secure architectures.",
        icon: Shield,
        pastPapers: [
          {
            id: "cyb230-2024-spring",
            code: "CYB 230",
            name: "Midterm",
            description: "Threat modeling and mitigations.",
            year: "2024",
          },
        ],
        documents: [
          {
            id: "cyb230-labs",
            title: "Lab Workbook",
            description: "Hands-on security labs.",
          },
        ],
      },
    ],
  },
  {
    id: "political-science",
    name: "Political Science",
    documents: 221,
    icon: Landmark,
    color: "bg-amber-600",
    courses: [
      {
        id: "pol-200",
        code: "POL 200",
        name: "Comparative Politics",
        description: "Institutions, regimes, and governance.",
        icon: Landmark,
        pastPapers: [
          {
            id: "pol200-2023-fall",
            code: "POL 200",
            name: "Final Exam",
            description: "Regime types and political economy.",
            year: "2023",
          },
        ],
        documents: [
          {
            id: "pol200-readings",
            title: "Reading Pack",
            description: "Seminal essays and analyses.",
          },
        ],
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    documents: 265,
    icon: GraduationCap,
    color: "bg-cyan-600",
    courses: [
      {
        id: "edu-130",
        code: "EDU 130",
        name: "Learning Sciences",
        description: "How people learn and instructional design.",
        icon: GraduationCap,
        pastPapers: [
          {
            id: "edu130-2024-spring",
            code: "EDU 130",
            name: "Midterm",
            description: "Learning theories and practice.",
            year: "2024",
          },
        ],
        documents: [
          {
            id: "edu130-guides",
            title: "Teaching Guides",
            description: "Lesson planning resources.",
          },
        ],
      },
    ],
  },
];
