import { STRENGTHS } from '../data/syllabus'
import { intervalDays } from '../hooks/useProgress'

function dueLabel(dueIn) {
  if (dueIn == null) return 'Due'
  if (dueIn <= 0) return dueIn < 0 ? `${Math.abs(dueIn)}d overdue` : 'Due today'
  if (dueIn === 1) return 'Tomorrow'
  return `In ${dueIn}d`
}

function nextGapLabel(item) {
  const days = intervalDays(item.strength, item.reviewCount || 0)
  return `+${days}d after revise`
}

export default function RevisionQueue({
  queue,
  upcoming = [],
  onCycleStrength,
  onCompleteRevision,
}) {
  return (
    <section className="revision-panel" aria-label="Revision queue">
      <header className="analytics-head">
        <div>
          <p className="eyebrow">Spaced practice</p>
          <h2>Revision</h2>
        </div>
        <p className="analytics-lede">
          Due items are ordered by exam impact — higher-mark and weaker topics
          first. Gaps shrink as the exam gets closer.
        </p>
      </header>

      {queue.length === 0 ? (
        <p className="empty">
          Nothing due right now. Rate sub-topics while studying — they show up
          here the same day, then again on a spaced schedule.
        </p>
      ) : (
        <ul className="revision-list">
          {queue.map((item) => {
            const meta =
              STRENGTHS.find((s) => s.id === item.strength) || STRENGTHS[0]
            return (
              <li
                key={item.id}
                className={`revision-item strength-${item.strength}`}
                style={{ '--item-accent': item.accent }}
              >
                <div className="revision-main">
                  <span className="rev-subject">{item.subjectShort}</span>
                  <strong>{item.title}</strong>
                  <span className="rev-path">
                    {item.topicTitle} · {item.topicMarks}Q
                    {item.highMark ? ' · high weight' : ''}
                  </span>
                  <span className="rev-due-meta">
                    <em className={item.dueIn < 0 ? 'overdue' : 'due-now'}>
                      {dueLabel(item.dueIn)}
                    </em>
                    <span>· {nextGapLabel(item)}</span>
                    {item.reviewCount > 0 && (
                      <span>· pass {item.reviewCount}</span>
                    )}
                  </span>
                </div>
                <div className="revision-actions">
                  <button
                    type="button"
                    className={`pill strength-${item.strength}`}
                    onClick={() => onCycleStrength(item.topicId, item.index)}
                    title="Cycle Strong / Average / Weak"
                  >
                    {meta.label}
                  </button>
                  <button
                    type="button"
                    className="revise-btn"
                    onClick={() =>
                      onCompleteRevision(item.topicId, item.index)
                    }
                  >
                    Mark revised
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {upcoming.length > 0 && (
        <div className="upcoming-block">
          <h3>Coming up</h3>
          <p className="upcoming-lede">
            Already revised — they reappear automatically on these days.
          </p>
          <ul className="revision-list upcoming-list">
            {upcoming.map((item) => (
              <li
                key={item.id}
                className={`revision-item upcoming strength-${item.strength}`}
                style={{ '--item-accent': item.accent }}
              >
                <div className="revision-main">
                  <span className="rev-subject">{item.subjectShort}</span>
                  <strong>{item.title}</strong>
                  <span className="rev-path">
                    {item.topicTitle} · {dueLabel(item.dueIn)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
