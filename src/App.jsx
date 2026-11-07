import { useDeferredValue, useMemo, useState } from 'react'
import {
  SUBJECTS,
  STATUSES,
  STRENGTHS,
  isHighMarkTopic,
} from './data/syllabus'
import { isReviewDue, useProgress } from './hooks/useProgress'
import Analytics from './components/Analytics'
import RevisionQueue from './components/RevisionQueue'
import StreakBar from './components/StreakBar'
import './App.css'

const DREAM_COLLEGES = [
  'Andhra University College of Engineering',
  'Jawaharlal Nehru Technological University',
  'Sri Venkateswara University College of Engineering',
  'Gayatri Vidya Parishad College of Engineering',
  'GMR Institute of Technology',
]

const MOTIVATION_QUOTES = [
  {
    quote: 'Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.',
    author: 'A. P. J. Abdul Kalam',
  },
  {
    quote: 'Education is the most powerful weapon which you can use to change the world.',
    author: 'Nelson Mandela',
  },
  {
    quote: 'Genius is one percent inspiration and ninety-nine percent perspiration.',
    author: 'Thomas Edison',
  },
]

function CollegesPage() {
  return (
    <div className="app colleges-page">
      <div className="atmosphere" aria-hidden="true" />
      <a className="colleges-back" href="/">← Back to your tracker</a>
      <header className="colleges-hero">
        <p className="eyebrow">Keep your goal in sight</p>
        <h1>Your dream colleges</h1>
        <p>Every focused study session brings you one step closer.</p>
      </header>
      <main className="colleges-grid">
        {DREAM_COLLEGES.map((college, index) => (
          <article className="college-card" key={college}>
            <span className="college-number">0{index + 1}</span>
            <h2>{college}</h2>
            <span className="college-star" aria-hidden="true">✦</span>
          </article>
        ))}
      </main>
      <section className="your-why" aria-labelledby="your-why-title">
        <span className="your-why-star" aria-hidden="true">✦</span>
        <p className="eyebrow">For the days you need a reminder</p>
        <h2 id="your-why-title">This dream is yours. Keep showing up for it.</h2>
        <p>
          These campuses are more than names on a list—they’re a picture of the
          future you’re working toward. One topic mastered, one revision
          finished, one focused session at a time: you are moving closer to
          your ECET goal. Start with what you can do today.
        </p>
        <strong>Today’s step: study one topic. Your future self will thank you.</strong>
      </section>
      <section className="motivation-section" aria-labelledby="motivation-title">
        <p className="eyebrow">Words to carry with you</p>
        <h2 id="motivation-title">From people who changed the world</h2>
        <div className="motivation-grid">
          {MOTIVATION_QUOTES.map(({ quote, author }) => (
            <blockquote className="motivation-quote" key={author}>
              <span aria-hidden="true">“</span>
              <p>{quote}</p>
              <cite>— {author}</cite>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  )
}

function Ring({ pct, color, size = 72 }) {
  const r = 28
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <svg
      className="ring"
      width={size}
      height={size}
      viewBox="0 0 72 72"
      aria-hidden="true"
    >
      <circle className="ring-track" cx="36" cy="36" r={r} />
      <circle
        className="ring-value"
        cx="36"
        cy="36"
        r={r}
        stroke={color}
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <text x="36" y="40" textAnchor="middle" className="ring-label">
        {pct}%
      </text>
    </svg>
  )
}

function StatusChip({ status, onClick }) {
  const meta = STATUSES.find((s) => s.id === status) || STATUSES[0]
  return (
    <button
      type="button"
      className={`status-chip status-${meta.id}`}
      onClick={onClick}
      title="Click to cycle topic status"
    >
      {meta.label}
    </button>
  )
}

function StrengthButtons({ value, onSelect }) {
  return (
    <div className="strength-group" role="group" aria-label="Strength">
      {['weak', 'average', 'strong'].map((id) => {
        const meta = STRENGTHS.find((s) => s.id === id)
        return (
          <button
            key={id}
            type="button"
            className={`strength-btn strength-${id}${value === id ? ' active' : ''}`}
            onClick={() => onSelect(id)}
          >
            {meta.short}
          </button>
        )
      })}
    </div>
  )
}

function TopicCard({
  topic,
  entry,
  onCycle,
  onSetStrength,
  onToggleRevised,
  onMarkRevised,
  onNotes,
}) {
  const [open, setOpen] = useState(false)
  const counts = topic.points.reduce(
    (acc, _, i) => {
      const s = entry.subs?.[i]?.strength || 'unrated'
      acc[s] = (acc[s] || 0) + 1
      if (entry.subs?.[i]?.revised) acc.revised += 1
      return acc
    },
    { strong: 0, average: 0, weak: 0, unrated: 0, revised: 0 },
  )

  return (
    <article className={`topic status-${entry.status}`}>
      <header className="topic-head">
        <div className="topic-title-block">
          <button
            type="button"
            className="topic-toggle"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="chevron" aria-hidden="true">
              {open ? '▾' : '▸'}
            </span>
            <span className="topic-title">{topic.title}</span>
          </button>
          <div className="topic-meta">
            <span
              className={
                isHighMarkTopic(topic.marks) ? 'marks high-mark' : 'marks'
              }
              title={
                isHighMarkTopic(topic.marks)
                  ? 'High-mark topic — prioritize for exam'
                  : undefined
              }
            >
              {topic.marks} Q
              {isHighMarkTopic(topic.marks) ? ' · priority' : ''}
            </span>
            <span className="points-count">
              {topic.points.length} sub-topics
            </span>
            <span className="strength-summary">
              <em className="c-strong">{counts.strong}S</em>
              <em className="c-avg">{counts.average}A</em>
              <em className="c-weak">{counts.weak}W</em>
              <em>{counts.revised} revised</em>
            </span>
          </div>
        </div>
        <div className="topic-actions">
          <StatusChip status={entry.status} onClick={() => onCycle(topic.id)} />
          <button
            type="button"
            className="ghost tiny"
            onClick={() => onMarkRevised(topic.id)}
            title="Mark all rated sub-topics as revised"
          >
            Revise all
          </button>
        </div>
      </header>

      {open && (
        <div className="topic-body">
          <ul className="subtopic-list">
            {topic.points.map((point, i) => {
              const sub = entry.subs?.[i] || {
                strength: 'unrated',
                revised: false,
              }
              const due = isReviewDue(sub)
              const reviseClass = due
                ? 'revise-btn due'
                : sub.revised
                  ? 'revise-btn on'
                  : 'revise-btn'
              const reviseLabel = due
                ? sub.revised
                  ? 'Due again'
                  : 'Revise'
                : sub.revised
                  ? 'Revised ✓'
                  : 'Revise'
              return (
                <li key={i} className={`subtopic strength-${sub.strength}`}>
                  <div className="subtopic-main">
                    <span className="subtopic-title">{point}</span>
                    <StrengthButtons
                      value={sub.strength}
                      onSelect={(strength) =>
                        onSetStrength(topic.id, i, strength)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className={reviseClass}
                    onClick={() => onToggleRevised(topic.id, i)}
                    disabled={sub.strength === 'unrated'}
                    title={
                      due
                        ? 'Mark this revision done — next review is scheduled automatically'
                        : sub.revised
                          ? 'Click to undo and put back in revision today'
                          : 'Mark revised'
                    }
                  >
                    {reviseLabel}
                  </button>
                </li>
              )
            })}
          </ul>
          <label className="notes-label">
            Notes
            <textarea
              value={entry.notes}
              onChange={(e) => onNotes(topic.id, e.target.value)}
              placeholder="Formulas, weak spots, resources…"
              rows={2}
            />
          </label>
        </div>
      )}
    </article>
  )
}

function SubjectPanel({
  subject,
  progress,
  stats,
  onCycle,
  onSetStrength,
  onToggleRevised,
  onMarkRevised,
  onNotes,
}) {
  return (
    <section
      className="subject-panel"
      style={{ '--subject-accent': subject.accent }}
      id={`subject-${subject.id}`}
    >
      <header className="subject-head">
        <div>
          <p className="eyebrow">
            {subject.short} · {subject.totalMarks} marks
          </p>
          <h2>{subject.name}</h2>
          <p className="subject-strength-line">
            <span className="c-strong">{stats.strong} strong</span>
            <span className="c-avg">{stats.average} average</span>
            <span className="c-weak">{stats.weak} weak</span>
            <span>{stats.revised} revised</span>
          </p>
        </div>
        <div className="subject-stats">
          <Ring pct={stats.pct} color={subject.accent} />
          <div className="stat-text">
            <strong>
              {stats.earned.toFixed(1)} / {stats.total}
            </strong>
            <span>
              {stats.doneTopics}/{stats.totalTopics} topics ready
            </span>
            <a
              className="syllabus-link"
              href={subject.source}
              target="_blank"
              rel="noreferrer"
            >
              Official PDF
            </a>
          </div>
        </div>
      </header>

      <div className="units">
        {subject.units.map((unit) => (
          <div className="unit" key={unit.id}>
            <h3>{unit.title}</h3>
            <div className="topics">
              {unit.topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  entry={progress[topic.id]}
                  onCycle={onCycle}
                  onSetStrength={onSetStrength}
                  onToggleRevised={onToggleRevised}
                  onMarkRevised={onMarkRevised}
                  onNotes={onNotes}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function App() {
  const {
    progress,
    cycleStatus,
    setSubStrength,
    cycleSubStrength,
    toggleRevised,
    completeRevision,
    markTopicRevised,
    setNotes,
    resetAll,
    analytics,
    streak,
    overall,
    subjectStats,
  } = useProgress()

  const [view, setView] = useState('syllabus')
  const [active, setActive] = useState('all')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const isCollegesRoute = window.location.pathname.replace(/\/$/, '') === '/colleges'

  const filtered = useMemo(() => {
    const base =
      active === 'all' ? SUBJECTS : SUBJECTS.filter((s) => s.id === active)

    if (!deferredQuery) return base

    return base
      .map((subject) => ({
        ...subject,
        units: subject.units
          .map((unit) => ({
            ...unit,
            topics: unit.topics.filter(
              (t) =>
                t.title.toLowerCase().includes(deferredQuery) ||
                unit.title.toLowerCase().includes(deferredQuery) ||
                t.points.some((p) => p.toLowerCase().includes(deferredQuery)),
            ),
          }))
          .filter((unit) => unit.topics.length > 0),
      }))
      .filter((subject) => subject.units.length > 0)
  }, [active, deferredQuery])

  if (isCollegesRoute) return <CollegesPage />

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />

      <header className="hero">
        <div className="hero-copy">
          <p className="brand">AP ECET Tracker</p>
          <h1>Diploma CSE · 2026</h1>
          <p className="lede">
            Break every unit into sub-topics, label them Strong / Average /
            Weak, revise, and watch readiness climb across {overall.total}{' '}
            marks.
          </p>
        </div>

        <div className="hero-progress">
          <Ring pct={overall.pct} color="#0f766e" size={96} />
          <div>
            <p className="progress-label">Overall readiness</p>
            <p className="progress-value">
              {overall.earned.toFixed(1)}
              <span> / {overall.total} marks</span>
            </p>
            <p className="progress-sub">
              {overall.strong} strong · {overall.weak} weak ·{' '}
              {overall.revisionPct}% revised
            </p>
          </div>
        </div>
      </header>

      <StreakBar streak={streak} />

      <nav className="view-tabs" aria-label="Views">
        {[
          { id: 'syllabus', label: 'Syllabus' },
          { id: 'analytics', label: 'Analytics' },
          {
            id: 'revision',
            label: `Revision (${analytics.revisionQueue.length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={view === tab.id ? 'view-tab active' : 'view-tab'}
            onClick={() => setView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {view === 'syllabus' && (
        <>
          <nav className="toolbar" aria-label="Subjects">
            <div className="tabs">
              <button
                type="button"
                className={active === 'all' ? 'tab active' : 'tab'}
                onClick={() => setActive('all')}
              >
                All
              </button>
              {SUBJECTS.map((s) => {
                const stats = subjectStats(s)
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={active === s.id ? 'tab active' : 'tab'}
                    onClick={() => setActive(s.id)}
                    style={{ '--tab-accent': s.accent }}
                  >
                    <span>{s.short}</span>
                    <span className="tab-pct">{stats.pct}%</span>
                  </button>
                )
              })}
            </div>

            <div className="toolbar-actions">
              <input
                className="search"
                type="search"
                placeholder="Search sub-topics…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search sub-topics"
              />
              <button type="button" className="ghost" onClick={resetAll}>
                Reset
              </button>
            </div>
          </nav>

          <div className="legend">
            {['weak', 'average', 'strong'].map((id) => {
              const s = STRENGTHS.find((x) => x.id === id)
              return (
                <span key={id} className={`legend-item strength-${id}`}>
                  {s.label}
                </span>
              )
            })}
            <span className="legend-hint">
              Label a sub-topic → it enters Revision today · revise → returns
              after a few days
            </span>
          </div>

          <main className="main">
            {filtered.length === 0 ? (
              <p className="empty">No topics match that search.</p>
            ) : (
              filtered.map((subject) => (
                <SubjectPanel
                  key={subject.id}
                  subject={subject}
                  progress={progress}
                  stats={subjectStats(
                    SUBJECTS.find((s) => s.id === subject.id),
                  )}
                  onCycle={cycleStatus}
                  onSetStrength={setSubStrength}
                  onToggleRevised={toggleRevised}
                  onMarkRevised={markTopicRevised}
                  onNotes={setNotes}
                />
              ))
            )}
          </main>
        </>
      )}

      {view === 'analytics' && (
        <Analytics
          analytics={analytics}
          streak={streak}
          onJumpRevision={() => setView('revision')}
          onJumpSubject={(subjectId) => {
            setView('syllabus')
            setActive(subjectId)
          }}
        />
      )}

      {view === 'revision' && (
        <RevisionQueue
          queue={analytics.revisionQueue}
          upcoming={analytics.upcomingReviews}
          onCycleStrength={cycleSubStrength}
          onCompleteRevision={completeRevision}
        />
      )}

      <footer className="footer">
        <p>
          Syllabus from APSCHE APECET 2026 · Diploma Holders in Engineering
          (CSE). Progress saves in this browser.
        </p>
      </footer>
    </div>
  )
}
