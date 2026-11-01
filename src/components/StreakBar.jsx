export default function StreakBar({ streak }) {
  if (!streak) return null

  const { current, best, activeToday, atRisk, todayCount, recent, totalDays } =
    streak

  let status = 'Rate a sub-topic or revise to start a streak.'
  if (activeToday) {
    status =
      todayCount === 1
        ? 'Logged today — streak is safe.'
        : `${todayCount} study actions today — streak is safe.`
  } else if (atRisk) {
    status = 'Study today or this streak resets at midnight.'
  } else if (current === 0 && totalDays > 0) {
    status = 'Streak broken — one rating or revision starts it again.'
  }

  return (
    <section className="streak-bar" aria-label="Study streak">
      <div className="streak-stats">
        <div>
          <p className="streak-label">Study streak</p>
          <p className="streak-value">
            {current}
            <span> day{current === 1 ? '' : 's'}</span>
          </p>
        </div>
        <div className="streak-meta">
          <span>
            Best <strong>{best}</strong>
          </span>
          <span>
            Active days <strong>{totalDays}</strong>
          </span>
        </div>
      </div>

      <div className="streak-calendar" role="list" aria-label="Last 14 days">
        {recent.map((day) => (
          <div
            key={day.key}
            role="listitem"
            className={[
              'streak-day',
              day.active ? 'on' : '',
              day.isToday ? 'today' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            title={`${day.key}${day.active ? ` · ${day.count} action${day.count === 1 ? '' : 's'}` : ''}`}
          >
            <span className="streak-day-label">{day.label}</span>
            <span className="streak-day-dot" aria-hidden="true" />
          </div>
        ))}
      </div>

      <p className={`streak-status${atRisk ? ' risk' : ''}`}>{status}</p>
    </section>
  )
}
