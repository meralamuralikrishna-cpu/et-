import { STRENGTHS } from '../data/syllabus'

function BarChart({ items, valueKey = 'pct', max = 100, valueSuffix = '%' }) {
  const peak = Math.max(
    max,
    ...items.map((item) => Number(item[valueKey]) || 0),
    1,
  )

  return (
    <div className="bar-chart" role="img" aria-label="Subject chart">
      {items.map((item) => {
        const value = Number(item[valueKey]) || 0
        const width = Math.max(value > 0 ? 4 : 0, (value / peak) * 100)
        return (
          <div className="bar-row" key={item.id}>
            <div className="bar-label">
              <span>{item.name}</span>
              <strong>
                {Number.isInteger(value) ? value : value.toFixed(1)}
                {valueSuffix}
              </strong>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${width}%`,
                  background: item.accent,
                }}
              />
            </div>
            {item.meta ? <div className="bar-meta">{item.meta}</div> : null}
          </div>
        )
      })}
    </div>
  )
}

function StackedStrength({ bySubject }) {
  return (
    <div className="stack-chart" role="img" aria-label="Strength mix by subject">
      {bySubject.map((s) => {
        const total = s.totalSubs || 1
        const segments = [
          { id: 'strong', n: s.strong, color: '#0f766e' },
          { id: 'average', n: s.average, color: '#c47a12' },
          { id: 'weak', n: s.weak, color: '#c2410c' },
          { id: 'unrated', n: s.unrated, color: '#cbd5e1' },
        ]
        return (
          <div className="stack-row" key={s.id}>
            <span className="stack-name">{s.name}</span>
            <div className="stack-track">
              {segments.map((seg) =>
                seg.n ? (
                  <div
                    key={seg.id}
                    className="stack-seg"
                    title={`${seg.id}: ${seg.n}`}
                    style={{
                      width: `${(seg.n / total) * 100}%`,
                      background: seg.color,
                    }}
                  />
                ) : null,
              )}
            </div>
            <span className="stack-count">
              {s.strong}S · {s.average}A · {s.weak}W
            </span>
          </div>
        )
      })}
    </div>
  )
}

function Donut({ strong, average, weak, unrated }) {
  const parts = [
    { id: 'strong', value: strong, color: '#0f766e' },
    { id: 'average', value: average, color: '#c47a12' },
    { id: 'weak', value: weak, color: '#c2410c' },
    { id: 'unrated', value: unrated, color: '#cbd5e1' },
  ]
  const total = parts.reduce((s, p) => s + p.value, 0)
  const safeTotal = total || 1
  const r = 42
  const c = 2 * Math.PI * r
  let cursor = 0

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 120 120" className="donut" aria-hidden="true">
        <circle cx="60" cy="60" r={r} className="donut-track" />
        {total === 0 ? null : (
          parts.map((p) => {
            if (!p.value) return null
            const len = (p.value / safeTotal) * c
            const el = (
              <circle
                key={p.id}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={p.color}
                strokeWidth="14"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-cursor}
                transform="rotate(-90 60 60)"
              />
            )
            cursor += len
            return el
          })
        )}
        <text x="60" y="56" textAnchor="middle" className="donut-num">
          {Math.round(((strong + average) / safeTotal) * 100)}%
        </text>
        <text x="60" y="72" textAnchor="middle" className="donut-caption">
          rated ok+
        </text>
      </svg>
      <ul className="donut-legend">
        {parts.map((p) => (
          <li key={p.id}>
            <span style={{ background: p.color }} />
            {STRENGTHS.find((s) => s.id === p.id)?.label || p.id}
            <strong>{p.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RevisionBars({ bySubject }) {
  return (
    <div className="rev-chart" role="img" aria-label="Revision coverage">
      {bySubject.map((s) => (
        <div className="rev-col" key={s.id}>
          <div className="rev-bar-wrap">
            <div
              className="rev-bar"
              style={{
                height: `${Math.min(100, Math.max(s.revisionPct > 0 ? 6 : 0, s.revisionPct))}%`,
                background: s.accent,
              }}
              title={`${s.revisionPct}%`}
            />
          </div>
          <span className="rev-name">{s.name}</span>
          <strong>{s.revisionPct}%</strong>
        </div>
      ))}
    </div>
  )
}

export default function Analytics({
  analytics,
  streak,
  onJumpRevision,
  onJumpSubject,
}) {
  const { bySubject, totals, weakList, exam } = analytics

  const readinessItems = bySubject.map((s) => ({
    ...s,
    meta: `${s.earned.toFixed(1)} / ${s.marks} marks`,
  }))

  const riskItems = [...(exam.riskBySubject || [])].map((s) => ({
    id: s.id,
    name: s.name,
    accent: s.accent,
    gap: s.gap,
    meta: `${s.gap.toFixed(1)} of ${s.marks} at risk · ${s.pct}% ready`,
  }))

  return (
    <section className="analytics" aria-label="Analytics">
      <header className="analytics-head">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Analytics</h2>
        </div>
        <p className="analytics-lede">
          Strength mix, subject readiness, and mark-weighted priorities across{' '}
          {totals.totalSubs} sub-topics.
        </p>
      </header>

      <div className="kpi-grid">
        <article className="kpi">
          <span>Exam in</span>
          <strong>
            {exam.daysLeft < 0
              ? '—'
              : exam.daysLeft === 0
                ? 'Today'
                : exam.daysLeft}
          </strong>
          <em>{exam.phase.label}</em>
        </article>
        <article className="kpi">
          <span>Marks at risk</span>
          <strong className="c-weak">{exam.marksAtRisk}</strong>
          <em>of {totals.total} total</em>
        </article>
        <article className="kpi">
          <span>Readiness</span>
          <strong>{totals.pct}%</strong>
          <em>
            {totals.earned.toFixed(1)} / {totals.total} marks
          </em>
        </article>
        <article className="kpi">
          <span>Strong</span>
          <strong className="c-strong">{totals.strong}</strong>
          <em>sub-topics</em>
        </article>
        <article className="kpi">
          <span>Average</span>
          <strong className="c-avg">{totals.average}</strong>
          <em>sub-topics</em>
        </article>
        <article className="kpi">
          <span>Weak</span>
          <strong className="c-weak">{totals.weak}</strong>
          <em>need focus</em>
        </article>
        <article className="kpi">
          <span>Revised</span>
          <strong>{totals.revisionPct}%</strong>
          <em>
            {totals.revised} / {totals.totalSubs}
          </em>
        </article>
        <article className="kpi">
          <span>Streak</span>
          <strong>{streak?.current ?? 0}</strong>
          <em>
            best {streak?.best ?? 0}
            {streak?.atRisk
              ? ' · at risk'
              : streak?.activeToday
                ? ' · today done'
                : ''}
          </em>
        </article>
      </div>

      <div className="chart-grid">
        <article className="chart-card">
          <h3>Subject readiness</h3>
          <p>Weighted by exam marks and your strength labels.</p>
          <BarChart items={readinessItems} valueKey="pct" valueSuffix="%" />
        </article>

        <article className="chart-card">
          <h3>Marks at risk by subject</h3>
          <p>Uncovered question weight — updates as you rate each subject.</p>
          <BarChart
            items={riskItems}
            valueKey="gap"
            max={Math.max(...riskItems.map((s) => s.gap), 1)}
            valueSuffix="Q"
          />
        </article>

        <article className="chart-card">
          <h3>Strength distribution</h3>
          <p>How many sub-topics sit in each band.</p>
          <Donut
            strong={totals.strong}
            average={totals.average}
            weak={totals.weak}
            unrated={totals.unrated}
          />
        </article>

        <article className="chart-card">
          <h3>Strength mix by subject</h3>
          <p>Stacked Strong / Average / Weak / Unrated.</p>
          <StackedStrength bySubject={bySubject} />
        </article>

        <article className="chart-card">
          <h3>Revision coverage</h3>
          <p>Share of sub-topics marked revised.</p>
          <RevisionBars bySubject={bySubject} />
        </article>
      </div>

      <article className="focus-card">
        <header>
          <div>
            <h3>Highest marks at risk</h3>
            <p>
              Grouped by subject — gap shrinks when you rate or revise topics in
              that subject.
            </p>
          </div>
          <button type="button" className="ghost" onClick={onJumpRevision}>
            Open revision queue
          </button>
        </header>

        {!exam.riskBySubject?.some((s) => s.gap >= 0.35) ? (
          <p className="empty-inline">No significant mark gaps right now.</p>
        ) : (
          <div className="risk-by-subject">
            {exam.riskBySubject
              .filter((s) => s.gap >= 0.35)
              .map((subject) => (
                <section
                  key={subject.id}
                  className="risk-subject-block"
                  style={{ '--item-accent': subject.accent }}
                >
                  <header className="risk-subject-head">
                    <div>
                      <h4>{subject.fullName}</h4>
                      <p>
                        {subject.pct}% ready · {subject.gap.toFixed(1)}Q still
                        at risk
                      </p>
                    </div>
                    <button
                      type="button"
                      className="ghost tiny"
                      onClick={() => onJumpSubject?.(subject.id)}
                    >
                      Open subject
                    </button>
                  </header>

                  {subject.topics.length === 0 ? (
                    <p className="empty-inline">
                      Remaining gap is spread across smaller topics.
                    </p>
                  ) : (
                    <ul className="focus-list priority-marks-list">
                      {subject.topics.map((topic) => (
                        <li key={topic.id}>
                          <span className="marks-pill">
                            {topic.marks}Q
                            {topic.highMark ? ' ★' : ''}
                          </span>
                          <div>
                            <strong>{topic.title}</strong>
                            <span>
                              {topic.pct}% ready · gap {topic.gap.toFixed(1)}Q
                            </span>
                          </div>
                          <em>{topic.unitTitle.replace(/^Unit [^—]+ — /, '')}</em>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
          </div>
        )}
      </article>

      <article className="focus-card">
        <header>
          <div>
            <h3>Focus list</h3>
            <p>
              Weak spots inside higher-mark topics — revise these for the best
              score lift.
            </p>
          </div>
          <button type="button" className="ghost" onClick={onJumpRevision}>
            Open revision queue
          </button>
        </header>
        {weakList.length === 0 ? (
          <p className="empty-inline">
            No weak spots yet. Rate sub-topics as you study.
          </p>
        ) : (
          <ul className="focus-list">
            {weakList.slice(0, 12).map((item) => (
              <li key={item.id}>
                <span className={`pill strength-${item.strength}`}>
                  {item.strength}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <span>
                    {item.subjectShort} · {item.topicTitle} · {item.topicMarks}Q
                  </span>
                </div>
                {!item.revised && <em>needs revision</em>}
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}
