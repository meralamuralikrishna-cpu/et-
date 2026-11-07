import { SUBJECTS, allTopics } from '../data/syllabus'

export default function QuizAnalytics({ tests }) {
  const hit = (list) => { const total = list.reduce((n, t) => n + Number(t.total || 0), 0); const correct = list.reduce((n, t) => n + Number(t.correct || 0), 0); return total ? correct / total * 100 : 0 }
  const subjectRows = SUBJECTS.map((subject) => ({ ...subject, rate: hit(tests.filter((t) => t.subjectId === subject.id)) }))
  const topics = allTopics().map((topic) => {
    const group = tests.filter((test) => test.topicId === topic.id)
    const attempted = group.reduce((n, t) => n + Number(t.attempted || 0), 0)
    const correct = group.reduce((n, t) => n + Number(t.correct || 0), 0)
    return { ...topic, tests: group.length, attempted, correct, accuracy: attempted ? correct / attempted * 100 : null }
  }).filter((topic) => topic.tests).sort((a, b) => (a.accuracy ?? 101) - (b.accuracy ?? 101))
  const mistakes = [['concept', 'Concept gap'], ['silly', 'Silly mistake'], ['formula', 'Forgot formula'], ['guessed', 'Guessed'], ['time', 'Ran out of time']].map(([id, label]) => ({ id, label, count: tests.reduce((sum, t) => sum + Number(t.mistakes?.[id] || 0), 0) }))
  const chronological = [...tests].sort((a, b) => a.date.localeCompare(b.date))
  const points = chronological.map((test, i) => ({ x: chronological.length < 2 ? 50 : 8 + i * 84 / (chronological.length - 1), y: 92 - test.correct / Math.max(1, test.attempted) * 80 }))
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')
  const totalMistakes = mistakes.reduce((n, item) => n + item.count, 0)
  const score = Math.round(subjectRows.reduce((sum, subject) => sum + subject.totalMarks * subject.rate / 100, 0) * 10) / 10

  return <section className="quiz-analytics">
    <div className="quiz-kpis"><article className="kpi"><span>Estimated score</span><strong>{score} / 200</strong><em>subject marks × logged hit rate</em></article><article className="kpi"><span>Logged tests</span><strong>{tests.length}</strong></article><article className="kpi"><span>Known mistakes</span><strong>{totalMistakes}</strong></article></div>
    <div className="chart-grid">
      <article className="chart-card"><h3>Hit rate by subject</h3><p>Correct answers divided by all questions.</p>{subjectRows.map((s) => <div className="bar-row" key={s.id}><div className="bar-label"><span>{s.short}</span><strong>{Math.round(s.rate)}%</strong></div><div className="bar-track"><div className="bar-fill" style={{ width: `${s.rate}%`, background: s.accent }} /></div></div>)}</article>
      <article className="chart-card"><h3>Accuracy trend</h3><p>Correct divided by attempted, in test date order.</p>{points.length ? <div className="trend-wrap"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Accuracy trend line"><line x1="8" y1="12" x2="92" y2="12" /><line x1="8" y1="52" x2="92" y2="52" /><line x1="8" y1="92" x2="92" y2="92" /><polyline points={polyline} />{points.map((p, i) => <circle key={`${p.x}-${i}`} cx={p.x} cy={p.y} r="2" />)}</svg><div className="trend-labels"><span>{chronological[0].date}</span><span>{chronological.at(-1).date}</span></div></div> : <p className="empty-inline">Log tests to see your trend.</p>}</article>
      <article className="chart-card"><h3>Mistake types</h3><p>Breakdown across all test logs.</p>{mistakes.map((item) => <div className="bar-row" key={item.id}><div className="bar-label"><span>{item.label}</span><strong>{item.count}</strong></div><div className="bar-track"><div className="bar-fill mistake-fill" style={{ width: `${totalMistakes ? item.count / totalMistakes * 100 : 0}%` }} /></div></div>)}</article>
    </div>
    <article className="chart-card"><h3>Topic accuracy · weakest first</h3><p>Weak under 60% · Average under 80% · Strong otherwise.</p><div className="table-scroll"><table className="data-table"><thead><tr><th>Topic</th><th>Tests</th><th>Score</th><th>Accuracy</th><th>Level</th></tr></thead><tbody>{topics.map((topic) => { const accuracy = topic.accuracy ?? 0; const level = accuracy < 60 ? 'Weak' : accuracy < 80 ? 'Average' : 'Strong'; return <tr key={topic.id}><td>{topic.title}<small>{topic.subjectShort} · {topic.unitTitle}</small></td><td>{topic.tests}</td><td>{topic.correct}/{topic.attempted}</td><td>{Math.round(accuracy)}%</td><td><span className={`pill strength-${level.toLowerCase()}`}>{level}</span></td></tr> })}</tbody></table></div>{topics.length === 0 && <p className="empty-inline">Topic analytics appear after you log a test.</p>}</article>
  </section>
}
