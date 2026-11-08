import { useMemo, useState } from 'react'
import { SUBJECTS, allTopics } from '../data/syllabus'

const MISTAKES = [
  ['concept', 'Concept gap'], ['silly', 'Silly mistake'], ['formula', 'Forgot formula'],
  ['guessed', 'Guessed'], ['time', 'Ran out of time'],
]
const today = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export default function Tests({ tests, onAdd, onDelete, settings, onSettings, onExport, onImport, todayRevised = 0, progress = {} }) {
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id)
  const [error, setError] = useState('')
  const topics = useMemo(() => allTopics().filter((t) => t.subjectId === subjectId), [subjectId])
  const [form, setForm] = useState({ date: today(), topicId: topics[0]?.id || '', total: '', attempted: '', correct: '', score: '', maxMarks: '', minutes: '', note: '', mistakes: Object.fromEntries(MISTAKES.map(([id]) => [id, 0])) })
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  const selectedTopic = topics.some((t) => t.id === form.topicId) ? form.topicId : topics[0]?.id || ''
  const submit = (event) => {
    event.preventDefault()
    const total = Number(form.total), attempted = Number(form.attempted), correct = Number(form.correct)
    const score = form.score === '' ? correct : Number(form.score)
    const maxMarks = form.maxMarks === '' ? total : Number(form.maxMarks)
    const wrong = attempted - correct
    const mistakes = Object.fromEntries(MISTAKES.map(([id]) => [id, Number(form.mistakes[id]) || 0]))
    if (!form.date || !selectedTopic || !Number.isInteger(total) || !Number.isInteger(attempted) || !Number.isInteger(correct) || total < 1 || attempted < 0 || correct < 0 || attempted > total || correct > attempted) return setError('Check the question counts: correct ≤ attempted ≤ total.')
    if (!Number.isFinite(score) || !Number.isFinite(maxMarks) || maxMarks <= 0 || score < 0 || score > maxMarks) return setError('Enter a score from 0 up to the full marks.')
    if (Object.values(mistakes).some((n) => !Number.isInteger(n) || n < 0) || Object.values(mistakes).reduce((a, b) => a + b, 0) !== wrong) return setError(`Mistake counts must add up to ${wrong} wrong answer${wrong === 1 ? '' : 's'}.`)
    onAdd({ date: form.date, subjectId, topicId: selectedTopic, total, attempted, correct, score, maxMarks, wrong, skipped: total - attempted, minutes: Number(form.minutes) || 0, note: form.note.trim(), mistakes })
    setError('')
    setForm((prev) => ({ ...prev, total: '', attempted: '', correct: '', score: '', maxMarks: '', minutes: '', note: '', mistakes: Object.fromEntries(MISTAKES.map(([id]) => [id, 0])) }))
  }
  const totalQuestions = tests.reduce((sum, t) => sum + t.total, 0)
  const attempted = tests.reduce((sum, t) => sum + t.attempted, 0)
  const correct = tests.reduce((sum, t) => sum + t.correct, 0)
  const questionBreakdown = [
    { label: 'Correct', value: correct, color: 'var(--teal)' },
    { label: 'Wrong', value: tests.reduce((sum, t) => sum + (t.wrong ?? t.attempted - t.correct), 0), color: '#c47a12' },
    { label: 'Skipped', value: tests.reduce((sum, t) => sum + (t.skipped ?? t.total - t.attempted), 0), color: '#82909b' },
  ]
  const breakdownTotal = questionBreakdown.reduce((sum, item) => sum + item.value, 0)
  let pieOffset = 0
  const pieSegments = questionBreakdown.map((item) => {
    const segment = { ...item, offset: pieOffset, fraction: breakdownTotal ? item.value / breakdownTotal : 0 }
    pieOffset += segment.fraction
    return segment
  })
  const recentTests = [...tests].slice(0, 8).reverse()
  const inputFile = (event) => { const file = event.target.files?.[0]; if (file) onImport(file); event.target.value = '' }

  return <section className="tests-page">
    <header className="analytics-head"><div><p className="eyebrow">Gemini quiz log</p><h2>Tests</h2></div><p className="analytics-lede">Log practice tests by syllabus topic and track what to revisit.</p></header>
    <div className="test-summary">
      <article className="kpi"><span>Tests</span><strong>{tests.length}</strong></article>
      <article className="kpi"><span>Hit rate</span><strong>{totalQuestions ? Math.round(correct / totalQuestions * 100) : 0}%</strong><em>{correct} / {totalQuestions} correct</em></article>
      <article className="kpi"><span>Accuracy</span><strong>{attempted ? Math.round(correct / attempted * 100) : 0}%</strong><em>{correct} / {attempted} attempted</em></article>
      <article className="kpi"><span>Wrong · skipped</span><strong>{attempted - correct} · {totalQuestions - attempted}</strong></article>
    </div>

    <div className="chart-grid test-chart-grid">
      <article className="chart-card"><h3>Score by test</h3><p>Score earned as a percentage of full marks.</p>{recentTests.length ? <div className="test-score-chart" role="img" aria-label="Score percentage by recent test">{recentTests.map((test, index) => { const score = Number(test.score ?? test.correct); const max = Number(test.maxMarks ?? test.total) || 1; const percent = Math.max(0, Math.min(100, score / max * 100)); return <div className="test-score-column" key={test.id}><strong>{Math.round(percent)}%</strong><div className="test-score-track"><i style={{ height: `${percent}%` }} /></div><span>{test.date.slice(5)}</span><small>Test {tests.length - recentTests.length + index + 1}</small></div> })}</div> : <p className="empty-inline">Save a test to see your score chart.</p>}</article>
      <article className="chart-card"><h3>Question breakdown</h3><p>Correct, wrong and skipped questions across your tests.</p>{breakdownTotal ? <div className="question-pie-wrap"><div className="question-pie" role="img" aria-label={questionBreakdown.map((item) => `${item.label}: ${item.value}`).join(', ')} style={{ background: `conic-gradient(${pieSegments.map((segment) => `${segment.color} ${segment.offset * 100}% ${(segment.offset + segment.fraction) * 100}%`).join(', ')})` }}><div><strong>{breakdownTotal}</strong><span>questions</span></div></div><ul className="question-pie-legend">{questionBreakdown.map((item) => <li key={item.label}><i style={{ background: item.color }} /><span>{item.label}</span><strong>{item.value} · {Math.round(item.value / breakdownTotal * 100)}%</strong></li>)}</ul></div> : <p className="empty-inline">Save a test to see your question breakdown.</p>}</article>
    </div>

    <form className="test-form chart-card" onSubmit={submit}>
      <h3>Log a test</h3>
      <div className="form-grid">
        <label>Date<input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required /></label>
        <label>Subject<select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); const next = allTopics().find((t) => t.subjectId === e.target.value); update('topicId', next?.id || '') }}>{SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <label className="wide-field">Topic<select value={selectedTopic} onChange={(e) => update('topicId', e.target.value)} required>{topics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></label>
        {[['total', 'Total questions', 0, undefined], ['attempted', 'Attempted', 0, form.total || undefined], ['correct', 'Correct answers', 0, form.attempted || undefined], ['score', 'Score earned', 0, form.maxMarks || undefined], ['maxMarks', 'Full marks', 0.01, undefined], ['minutes', 'Time taken (min)', 0, undefined]].map(([key, label, min, max]) => <label key={key}>{label}<input type="number" min={min} max={max} step={key === 'score' || key === 'maxMarks' ? 'any' : '1'} value={form[key]} onChange={(e) => update(key, e.target.value)} required={key === 'total' || key === 'attempted' || key === 'correct'} /></label>)}
        <label className="wide-field">Note<textarea rows="2" value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="What should you remember next time?" /></label>
      </div>
      <fieldset className="mistake-fields"><legend>Mistake types · total must equal {Math.max(0, Number(form.attempted || 0) - Number(form.correct || 0))} wrong</legend>{MISTAKES.map(([id, label]) => <label key={id}>{label}<input type="number" min="0" step="1" value={form.mistakes[id]} onChange={(e) => setForm((prev) => ({ ...prev, mistakes: { ...prev.mistakes, [id]: e.target.value } }))} /></label>)}</fieldset>
      {error && <p className="form-error" role="alert">{error}</p>}<button className="primary-btn" type="submit">Save test</button>
    </form>

    <section className="chart-card planning-card"><h3>Study plan & backup</h3><div className="form-grid planning-grid">
      <label>Exam date<input type="date" value={settings.examDate} onChange={(e) => onSettings({ examDate: e.target.value })} /></label>
      <label>Daily revision target<input type="number" min="1" max="100" value={settings.dailyTarget} onChange={(e) => onSettings({ dailyTarget: Math.max(1, Number(e.target.value) || 1) })} /></label>
      <label className="theme-toggle"><input type="checkbox" checked={settings.darkMode} onChange={(e) => onSettings({ darkMode: e.target.checked })} /> Dark mode</label>
      <div className="backup-actions"><button type="button" className="ghost" onClick={onExport}>Export JSON</button><label className="ghost file-button">Import JSON<input type="file" accept="application/json,.json" onChange={inputFile} /></label></div>
    </div>
      {settings.examDate && <ExamCountdown examDate={settings.examDate} progress={progress} />}
      <DailyTarget target={settings.dailyTarget} revised={todayRevised} />
    </section>

    <section className="chart-card"><h3>Test history</h3>{tests.length === 0 ? <p className="empty-inline">Your saved tests will appear here.</p> : <div className="table-scroll"><table className="data-table"><thead><tr><th>Date</th><th>Subject · topic</th><th>Marks</th><th>Questions</th><th>Hit / accuracy</th><th>Time</th><th>Note</th><th /></tr></thead><tbody>{tests.map((test) => { const topic = allTopics().find((t) => t.id === test.topicId); const subject = SUBJECTS.find((s) => s.id === test.subjectId); return <tr key={test.id}><td>{test.date}</td><td>{subject?.short} · {topic?.title || 'Unknown topic'}</td><td>{test.score ?? test.correct}/{test.maxMarks ?? test.total}</td><td>{test.correct}/{test.total}<small>{test.wrong} wrong · {test.skipped} skipped</small></td><td>{Math.round(test.correct / Math.max(1, test.total) * 100)}% / {Math.round(test.correct / Math.max(1, test.attempted) * 100)}%</td><td>{test.minutes} min</td><td>{test.note || '—'}</td><td><button className="delete-btn" type="button" onClick={() => { if (window.confirm('Delete this test record?')) onDelete(test.id) }}>Delete</button></td></tr> })}</tbody></table></div>}</section>
  </section>
}

function ExamCountdown({ examDate, progress }) {
  const days = Math.max(0, Math.ceil((new Date(`${examDate}T00:00:00`) - new Date(new Date().toDateString())) / 86400000))
  const topicsLeft = allTopics().filter((topic) => !['done', 'revised'].includes(progress[topic.id]?.status)).length
  const perDay = Math.ceil(topicsLeft / Math.max(1, days))
  return <p className="plan-countdown">{days} days left · {topicsLeft} topics left · aim for {perDay} topics per day.</p>
}

function DailyTarget({ target, revised }) {
  const done = Math.min(Number(target) || 1, revised)
  return <div className="daily-target"><div><strong>Revise {target} topics today</strong><span>{done} / {target} revised today</span></div><div className="target-track"><i style={{ width: `${Math.min(100, done / target * 100)}%` }} /></div><small>Completed revisions count toward your daily target.</small></div>
}
