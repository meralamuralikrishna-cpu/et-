/** AP ECET 2026 syllabus — Diploma Holders in Engineering (CSE) */

import digitalElectronics from '../../syllabi/cse/Digital Electronic/digital_electronics.txt?raw'
import softwareEngineering from '../../syllabi/cse/Software Engineering/software_engineering.txt?raw'
import computerOrganization from '../../syllabi/cse/Computer Organization/computer_organization.txt?raw'
import dbms from '../../syllabi/cse/DBMS/dbms.txt?raw'
import operatingSystems from '../../syllabi/cse/Operating systems/operating_system.txt?raw'
import javaProgramming from '../../syllabi/cse/Java Programming/java_programming.txt?raw'
import webTechnologies from '../../syllabi/cse/Web Techonlogies/web_technologies.txt?raw'
import bigDataCloud from '../../syllabi/cse/BigData & Cloud Computing/bigdata_cloudcomputing.txt?raw'
import iot from '../../syllabi/cse/IOT/iot.txt?raw'
import pythonProgramming from '../../syllabi/cse/Python Programming/python_programming.txt?raw'

export const SUBJECTS = [
  {
    id: 'math',
    name: 'Mathematics',
    short: 'Math',
    totalMarks: 50,
    accent: '#1a7a6d',
    source:
      'https://cets.apsche.ap.gov.in/ECET/PDF/Diploma%20Holders%20in%20Engineering/Common%20Subjects/APECET2026_MATHEMATICS%20(FOR%20DIPLOMA%20HOLDERS).pdf',
    units: [
      {
        id: 'math-u1',
        title: 'Unit I — Partial Fractions & Matrices',
        topics: [
          {
            id: 'math-partial',
            title: 'Partial Fractions',
            marks: 2,
            points: [
              'Resolve proper rational fractions into partial fractions',
              'Type: f(x) / [(ax+b)(cx+d)]',
              'Type: f(x) / [(ax+b)²(cx+d)]',
            ],
          },
          {
            id: 'math-matrices',
            title: 'Matrices',
            marks: 5,
            points: [
              'Definition & types of matrices',
              'Algebra of matrices — sum, difference, scalar & product',
              'Transpose; symmetric & skew-symmetric matrices',
              'Determinants, minors, cofactors, Laplace expansion',
              'Singular / non-singular; adjoint & inverse',
              'System of linear equations in 3 variables — Cramer’s rule & matrix inversion',
            ],
          },
        ],
      },
      {
        id: 'math-u2',
        title: 'Unit II — Trigonometry & Complex Numbers',
        topics: [
          {
            id: 'math-trig',
            title: 'Trigonometry',
            marks: 10,
            points: [
              'Properties of trigonometric functions',
              'Compound, multiple & sub-multiple angles',
              'Product ↔ sum / difference transformations',
              'Simple trigonometric equations',
              'Inverse trigonometric functions',
            ],
          },
          {
            id: 'math-complex',
            title: 'Complex Numbers',
            marks: 2,
            points: [
              'Definition, modulus, conjugate, amplitude',
              'Arithmetic operations',
              'Polar (modulus–amplitude) form',
              'Exponential / Euler form',
            ],
          },
        ],
      },
      {
        id: 'math-u3',
        title: 'Unit III — Analytical Geometry',
        topics: [
          {
            id: 'math-geometry',
            title: 'Analytical Geometry',
            marks: 6,
            points: [
              'Circles — centre–radius, diameter ends, general equation',
              'Finding centre and radius',
              'Standard forms of parabola, ellipse & hyperbola',
              'Simple properties of conics',
            ],
          },
        ],
      },
      {
        id: 'math-u4',
        title: 'Unit IV — Differentiation & Applications',
        topics: [
          {
            id: 'math-diff',
            title: 'Differentiation and its Applications',
            marks: 10,
            points: [
              'Limits — definition, properties & standard limits',
              'Differentiation from first principles',
              'Derivatives of algebraic, logarithmic, exponential, trigonometric, inverse trigonometric, hyperbolic & inverse hyperbolic functions',
              'Sum, product, quotient & chain rules; parametric & implicit forms',
              'Logarithmic differentiation; second-order derivatives',
              'Partial derivatives (first & second order)',
              'Tangent & normal; velocity, acceleration, rate measurer',
              'Increasing / decreasing functions; maxima & minima for quadratic and cubic polynomials',
              'Absolute, relative & percentage errors; approximate values from measurement errors',
            ],
          },
        ],
      },
      {
        id: 'math-u5',
        title: 'Unit V — Integration & Applications',
        topics: [
          {
            id: 'math-int',
            title: 'Integration and its Applications',
            marks: 8,
            points: [
              'Indefinite integrals — standard forms',
              'Integration by decomposition (trig, algebraic, exp, log, hyperbolic)',
              'Substitution; reducible & irreducible quadratic factors',
              'Integration by parts',
              'Definite integrals and properties',
            ],
          },
        ],
      },
      {
        id: 'math-u6',
        title: 'Unit VI — Differential Equations',
        topics: [
          {
            id: 'math-de',
            title: 'Differential Equations',
            marks: 7,
            points: [
              'Definition, order & degree',
              'Formation of differential equations',
              'First order, first degree — variable separable',
              'Linear DE of the form dy/dx + Py = Q',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'physics',
    name: 'Physics',
    short: 'Physics',
    totalMarks: 25,
    accent: '#2b5ea8',
    source:
      'https://cets.apsche.ap.gov.in/ECET/PDF/Diploma%20Holders%20in%20Engineering/Common%20Subjects/APECET2026_PHYSICS%20(For%20Diploma%20Holders).pdf',
    units: [
      {
        id: 'phy-u1',
        title: 'Unit I — Units and Dimensions',
        topics: [
          {
            id: 'phy-units',
            title: 'Units and Dimensions',
            marks: 2,
            points: [
              'Physical quantity — fundamental & derived',
              'Units — fundamental & derived; SI units',
              'Multiples & sub-multiples; advantages of SI',
            ],
          },
        ],
      },
      {
        id: 'phy-u2',
        title: 'Unit II — Elements of Vectors',
        topics: [
          {
            id: 'phy-vectors',
            title: 'Elements of Vectors',
            marks: 4,
            points: [
              'Scalar vs vector quantities; examples',
              'Graphical representation; types of vectors',
              'Triangle law; parallelogram law and cases',
            ],
          },
        ],
      },
      {
        id: 'phy-u3',
        title: 'Unit III — Kinematics',
        topics: [
          {
            id: 'phy-kinematics',
            title: 'Kinematics',
            marks: 2,
            points: ['Acceleration due to gravity'],
          },
        ],
      },
      {
        id: 'phy-u4',
        title: 'Unit IV — Work, Power and Energy',
        topics: [
          {
            id: 'phy-wpe',
            title: 'Work, Power and Energy',
            marks: 4,
            points: [
              'Definitions and units of work, power & energy',
              'Potential & kinetic energy — expressions & examples',
              'Law of conservation of energy; problems',
            ],
          },
        ],
      },
      {
        id: 'phy-u5',
        title: 'Unit V — Acoustics',
        topics: [
          {
            id: 'phy-acoustics',
            title: 'Acoustics',
            marks: 5,
            points: [
              'Musical sound vs noise; noise pollution — effects & control',
              'Beats and echo',
              'Doppler effect — explanation, cases & applications',
              'Reverberation; Sabine’s formula; problems',
            ],
          },
        ],
      },
      {
        id: 'phy-u6',
        title: 'Unit VI — Heat',
        topics: [
          {
            id: 'phy-heat',
            title: 'Heat',
            marks: 5,
            points: [
              'Expansion of gases; Boyle’s law',
              'Absolute temperature scale; Charles’s laws',
              'Ideal gas equation; universal gas constant (SI); problems',
            ],
          },
        ],
      },
      {
        id: 'phy-u7',
        title: 'Unit VII — Modern Physics',
        topics: [
          {
            id: 'phy-modern',
            title: 'Modern Physics',
            marks: 3,
            points: [
              'Photoelectric effect — laws & applications (photocell)',
              'Critical angle & total internal reflection',
              'Optical fibres — principle, types & applications',
              'Superconductivity — properties & applications',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    short: 'Chem',
    totalMarks: 25,
    accent: '#b45309',
    source:
      'https://cets.apsche.ap.gov.in/ECET/PDF/Diploma%20Holders%20in%20Engineering/Common%20Subjects/APECET2026_CHEMISTRY%20(For%20Diploma%20Holders).pdf',
    units: [
      {
        id: 'chem-u1',
        title: 'Unit 1 — Atomic Structure',
        topics: [
          {
            id: 'chem-atomic',
            title: 'Atomic Structure',
            marks: 3,
            points: [
              'Fundamental particles; Bohr’s theory',
              'Quantum numbers; Aufbau, Hund, Pauli',
              'Electronic configurations up to Z = 20',
              'Shapes of s, p, d orbitals',
            ],
          },
        ],
      },
      {
        id: 'chem-u2',
        title: 'Unit 2 — Chemical Bonding',
        topics: [
          {
            id: 'chem-bonding',
            title: 'Chemical Bonding',
            marks: 2,
            points: [
              'Types of chemical bonds',
              'Ionic bond (NaCl) & characteristics of ionic compounds',
              'Covalent bond (H₂, O₂, N₂) & characteristics',
            ],
          },
        ],
      },
      {
        id: 'chem-u3',
        title: 'Unit 3 — Solutions',
        topics: [
          {
            id: 'chem-solutions',
            title: 'Solutions',
            marks: 3,
            points: [
              'Classification; solute, solvent, concentration',
              'Mole concept; molarity & normality',
              'Equivalent weight; numerical problems',
            ],
          },
        ],
      },
      {
        id: 'chem-u4',
        title: 'Unit 4 — Acids and Bases',
        topics: [
          {
            id: 'chem-acids',
            title: 'Acids and Bases',
            marks: 2,
            points: [
              'Arrhenius theory',
              'Ionic product of water; pH & numericals',
              'Buffer solutions & applications',
            ],
          },
        ],
      },
      {
        id: 'chem-u5',
        title: 'Unit 5 — Electrochemistry',
        topics: [
          {
            id: 'chem-electro',
            title: 'Electrochemistry',
            marks: 3,
            points: [
              'Conductors, insulators, electrolytes',
              'Electrolysis',
              'Galvanic cell',
            ],
          },
        ],
      },
      {
        id: 'chem-u6',
        title: 'Unit 6 — Water Technology',
        topics: [
          {
            id: 'chem-water',
            title: 'Water Technology',
            marks: 3,
            points: [
              'Soft & hard water; causes & types of hardness',
              'Disadvantages; degree of hardness & units',
              'Softening — ion exchange process',
            ],
          },
        ],
      },
      {
        id: 'chem-u7',
        title: 'Unit 7 — Corrosion',
        topics: [
          {
            id: 'chem-corrosion',
            title: 'Corrosion',
            marks: 2,
            points: [
              'Factors influencing corrosion',
              'Electrochemical theory — composition, stress & concentration cells',
              'Rusting of iron & mechanism',
              'Prevention — coatings; cathodic protection',
            ],
          },
        ],
      },
      {
        id: 'chem-u8',
        title: 'Unit 8 — Polymers',
        topics: [
          {
            id: 'chem-polymers',
            title: 'Polymers',
            marks: 4,
            points: [
              'Polymerisation — addition & condensation',
              'Plastics — PVC, Teflon, Polystyrene (prep & uses)',
              'Elastomers — Buna-S, Neoprene & uses',
            ],
          },
        ],
      },
      {
        id: 'chem-u9',
        title: 'Unit 9 — Fuels',
        topics: [
          {
            id: 'chem-fuels',
            title: 'Fuels',
            marks: 1,
            points: [
              'Definition & classification based on occurrence',
              'Composition & uses of biogas',
            ],
          },
        ],
      },
      {
        id: 'chem-u10',
        title: 'Unit 10 — Environmental Chemistry',
        topics: [
          {
            id: 'chem-env',
            title: 'Environmental Chemistry',
            marks: 2,
            points: [
              'Lithosphere, hydrosphere, atmosphere, biosphere',
              'Pollutant, DO, BOD, COD, TLV',
              'Air pollution — acid rain, greenhouse effect, ozone depletion',
              'Water pollution — causes, effects & control',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    short: 'CSE',
    totalMarks: 100,
    accent: '#0f766e',
    source:
      'https://cets.apsche.ap.gov.in/ECET/PDF/Diploma%20Holders%20in%20Engineering/APECET2026_COMPUTER_SCIENCE_AND_ENGINEERING.pdf',
    units: [
      {
        id: 'cse-u1',
        title: '1. Digital Electronics',
        topics: [
          {
            id: 'cse-digital',
            title: 'Digital Electronics',
            marks: 6,
            points: [
              'Number systems',
              'Logic gates, Boolean algebra & basic combinational circuits',
              'Flip-flops; counters & registers',
              'Additional combinational circuits',
            ],
          },
        ],
      },
      {
        id: 'cse-u2',
        title: '2. Software Engineering',
        topics: [
          {
            id: 'cse-se',
            title: 'Software Engineering',
            marks: 6,
            points: [
              'Basics of SE; designs & life-cycle models',
              'Software project management',
              'Requirement analysis & specifications',
              'Software design & coding',
              'Testing, debugging, reliability, quality & maintenance',
            ],
          },
        ],
      },
      {
        id: 'cse-u3',
        title: '3. Computer Organisation & Microprocessors',
        topics: [
          {
            id: 'cse-co',
            title: 'Computer Organisation and Microprocessors',
            marks: 8,
            points: [
              'CPU organization',
              'Information representation & arithmetic operations',
              'Memory organization; I/O organization',
              'Fundamentals of 8086 & advanced processors',
            ],
          },
        ],
      },
      {
        id: 'cse-u4',
        title: '4. Data Structures through C',
        topics: [
          {
            id: 'cse-ds',
            title: 'Data Structures through C',
            marks: 10,
            points: [
              'Introduction; searching & sorting',
              'Linked storage; linked lists',
              'Stacks; queues',
              'Trees (non-linear data structures)',
            ],
          },
        ],
      },
      {
        id: 'cse-u5',
        title: '5. Computer Networks & Cyber Security',
        topics: [
          {
            id: 'cse-cn',
            title: 'Computer Networks & Cyber Security',
            marks: 6,
            points: [
              'Introduction to networks; LAN components, devices & topologies',
              'OSI reference model; TCP/IP suite',
              'Network addressing & subnetting',
              'Network protocols & management',
              'Network security; encryption techniques',
              'System security, threats & cyber crime',
            ],
          },
        ],
      },
      {
        id: 'cse-u6',
        title: '6. Operating Systems',
        topics: [
          {
            id: 'cse-os',
            title: 'Operating Systems',
            marks: 10,
            points: [
              'Introduction to OS',
              'Process management; synchronization & deadlocks',
              'Memory management',
              'Disk scheduling & file management',
            ],
          },
        ],
      },
      {
        id: 'cse-u7',
        title: '7. DBMS',
        topics: [
          {
            id: 'cse-dbms',
            title: 'DBMS',
            marks: 8,
            points: [
              'Concepts of DBMS & RDBMS',
              'SQL concepts',
              'Basics & advanced PL/SQL',
              'NoSQL & MongoDB',
            ],
          },
        ],
      },
      {
        id: 'cse-u8',
        title: '8. Java Programming',
        topics: [
          {
            id: 'cse-java',
            title: 'Java Programming',
            marks: 10,
            points: [
              'Basics of Java; overloading',
              'Inheritance, overriding, interfaces & packages',
              'I/O streams & collections',
              'Exception handling & multithreaded programming',
              'Applets, AWT & event handling',
            ],
          },
        ],
      },
      {
        id: 'cse-u9',
        title: '9. Web Technologies',
        topics: [
          {
            id: 'cse-web',
            title: 'Web Technologies',
            marks: 8,
            points: [
              'Principles of web designing; HTML introduction',
              'HTML tags & style sheets',
              'XML; client-side scripting with JavaScript',
              'Ajax & jQuery',
              'Web servers; server-side scripting with PHP',
            ],
          },
        ],
      },
      {
        id: 'cse-u10',
        title: '10. Big Data & Cloud Computing',
        topics: [
          {
            id: 'cse-bigdata',
            title: 'Big Data & Cloud Computing',
            marks: 6,
            points: [
              'Overview of data mining & data warehousing',
              'Introduction to Big Data; analytics & technologies',
              'Cloud computing',
            ],
          },
        ],
      },
      {
        id: 'cse-u11',
        title: '11. Android Programming',
        topics: [
          {
            id: 'cse-android',
            title: 'Android Programming',
            marks: 6,
            points: [
              'Android basics; anatomy & components',
              'Activity life cycle; intents',
              'UI — layouts & controls',
              'Advanced concepts; database connectivity',
            ],
          },
        ],
      },
      {
        id: 'cse-u12',
        title: '12. Internet of Things (IoT)',
        topics: [
          {
            id: 'cse-iot',
            title: 'Internet of Things (IoT)',
            marks: 8,
            points: [
              'Introduction; data protocols — MQTT, CoAP, XMPP, AMQP',
              'Communication — IEEE 802.15.4, ZigBee, NFC, Bluetooth',
              'Wireless sensor networks',
              'IoT in healthcare, smart homes, cities, classrooms, energy, factory, transport',
            ],
          },
        ],
      },
      {
        id: 'cse-u13',
        title: '13. Python Programming',
        topics: [
          {
            id: 'cse-python',
            title: 'Python Programming',
            marks: 8,
            points: [
              'Introduction to Python',
              'Control flow & loops; functions & arrays',
              'Data structures; OOP in Python',
              'File handling; exception handling',
            ],
          },
        ],
      },
    ],
  },
]

// Keep the editable source syllabi in `syllabi/cse` as the source of truth for
// CSE sub-topics, so adding detail there updates the tracker at build time.
function syllabusPoints(raw) {
  let section = ''
  const points = []
  const pointLessons = []

  for (const sourceLine of raw.split(/\r?\n/)) {
    const line = sourceLine.trim()
    if (!line) continue

    if (/^[-•*]\s+/.test(line)) {
      const point = line.replace(/^[-•*]\s+/, '').trim()
      points.push(point)
      pointLessons.push(section)
      continue
    }

    section = line.replace(/^\d+(?:\.\d+)*[.)]?\s*/, '').trim()
  }

  return { points, pointLessons }
}

const CSE_SYLLABUS_FILES = {
  'cse-digital': digitalElectronics,
  'cse-se': softwareEngineering,
  'cse-co': computerOrganization,
  'cse-dbms': dbms,
  'cse-os': operatingSystems,
  'cse-java': javaProgramming,
  'cse-web': webTechnologies,
  'cse-bigdata': bigDataCloud,
  'cse-iot': iot,
  'cse-python': pythonProgramming,
}

for (const unit of SUBJECTS.find((subject) => subject.id === 'cse').units) {
  for (const topic of unit.topics) {
    const source = CSE_SYLLABUS_FILES[topic.id]
    if (source) Object.assign(topic, syllabusPoints(source))
  }
}

export const STATUSES = [
  { id: 'todo', label: 'To do', short: 'To do', weight: 0 },
  { id: 'learning', label: 'Learning', short: 'Learning', weight: 0.4 },
  { id: 'done', label: 'Done', short: 'Done', weight: 0.85 },
  { id: 'revised', label: 'Revised', short: 'Revised', weight: 1 },
]

/** Per sub-topic mastery labels */
export const STRENGTHS = [
  { id: 'unrated', label: 'Unrated', short: '—', weight: 0, color: '#94a3b8' },
  { id: 'weak', label: 'Weak', short: 'Weak', weight: 0.25, color: '#c2410c' },
  { id: 'average', label: 'Average', short: 'Avg', weight: 0.6, color: '#c47a12' },
  { id: 'strong', label: 'Strong', short: 'Strong', weight: 1, color: '#0f766e' },
]

export const STRENGTH_ORDER = ['weak', 'average', 'strong', 'unrated']

export const STATUS_ORDER = STATUSES.map((s) => s.id)

export function allTopics(subjects = SUBJECTS) {
  return subjects.flatMap((subject) =>
    subject.units.flatMap((unit) =>
      unit.topics.map((topic) => ({
        ...topic,
        subjectId: subject.id,
        unitId: unit.id,
        unitTitle: unit.title,
        subjectName: subject.name,
        subjectShort: subject.short,
        accent: subject.accent,
      })),
    ),
  )
}

export function allSubtopics(subjects = SUBJECTS) {
  return allTopics(subjects).flatMap((topic) =>
    topic.points.map((title, index) => ({
      id: `${topic.id}::${index}`,
      topicId: topic.id,
      index,
      title,
      marksShare: topic.marks / topic.points.length,
      subjectId: topic.subjectId,
      subjectName: topic.subjectName,
      subjectShort: topic.subjectShort,
      accent: topic.accent,
      unitId: topic.unitId,
      unitTitle: topic.unitTitle,
      topicTitle: topic.title,
      topicMarks: topic.marks,
    })),
  )
}

export const EXAM_TOTAL = SUBJECTS.reduce((sum, s) => sum + s.totalMarks, 0)

/** CSE sits in the morning session on exam day. */
export const EXAM_DATE = '2026-04-23T09:00:00+05:30'
export const EXAM_LABEL = 'AP ECET 2026 · CSE morning'

/** Topics at or above this question weight are highlighted as high-mark. */
export const HIGH_MARK_THRESHOLD = 8

export function daysUntilExam(now = new Date()) {
  const exam = new Date(EXAM_DATE)
  exam.setHours(0, 0, 0, 0)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  return Math.round((exam - today) / (1000 * 60 * 60 * 24))
}

export function examPhase(daysLeft) {
  if (daysLeft < 0) {
    return {
      id: 'passed',
      label: 'Exam passed',
      hint: 'Keep revising weak high-mark topics for counselling confidence.',
    }
  }
  if (daysLeft === 0) {
    return {
      id: 'today',
      label: 'Exam day',
      hint: 'Only light revision of your highest-mark strong topics.',
    }
  }
  if (daysLeft <= 7) {
    return {
      id: 'final',
      label: 'Final week',
      hint: 'Protect high-mark topics first — revise gaps that cost the most marks.',
    }
  }
  if (daysLeft <= 21) {
    return {
      id: 'intensive',
      label: 'Intensive revise',
      hint: 'Close marks-at-risk on 8Q+ topics before polishing low-weight units.',
    }
  }
  if (daysLeft <= 45) {
    return {
      id: 'consolidate',
      label: 'Consolidate',
      hint: 'Finish rating remaining syllabus, then lock high-mark units with revision.',
    }
  }
  return {
    id: 'build',
    label: 'Build coverage',
    hint: 'Rate every sub-topic; high-mark units (8Q+) deserve early depth.',
  }
}

export function isHighMarkTopic(marks) {
  return marks >= HIGH_MARK_THRESHOLD
}
