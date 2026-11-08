import { useEffect, useMemo, useRef, useState } from 'react'
import {
  SUBJECTS,
  STATUSES,
  STRENGTHS,
  allSubtopics,
  allTopics,
  daysUntilExam,
  examPhase,
  isHighMarkTopic,
} from '../data/syllabus'

/** Days until next review after each successful revision, by strength. */
const REVIEW_INTERVALS = {
  weak: [1, 2, 4, 7, 14],
  average: [2, 4, 7, 14, 30],
  strong: [3, 7, 14, 30, 60],
}

function startOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, days) {
  const d = startOfDay(date)
  d.setDate(d.getDate() + days)
  return d
}

function toDateKey(date) {
  return startOfDay(date).toISOString()
}

/** Local calendar day key — avoids UTC shift from toISOString. */
export function localDayKey(date = new Date()) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function emptyActivity() {
  return { days: {} }
}

function bumpActivity(activity, kind = 'study') {
  const key = localDayKey()
  const prev = activity.days[key] || { count: 0, rated: 0, revised: 0 }
  const next = {
    ...prev,
    count: (prev.count || 0) + 1,
  }
  if (kind === 'rate') next.rated = (prev.rated || 0) + 1
  if (kind === 'revise') next.revised = (prev.revised || 0) + 1
  return {
    ...activity,
    days: { ...activity.days, [key]: next },
  }
}

export function buildStreak(activity, now = new Date()) {
  const days = activity?.days || {}
  const activeKeys = Object.keys(days)
    .filter((k) => (days[k]?.count || 0) > 0)
    .sort()

  const active = new Set(activeKeys)
  const todayKey = localDayKey(now)
  const yesterdayKey = localDayKey(addDays(now, -1))
  const activeToday = active.has(todayKey)
  const atRisk = !activeToday && active.has(yesterdayKey)

  let current = 0
  if (activeToday || atRisk) {
    let cursor = activeToday ? startOfDay(now) : addDays(now, -1)
    while (active.has(localDayKey(cursor))) {
      current += 1
      cursor = addDays(cursor, -1)
    }
  }

  let best = 0
  let run = 0
  let prev = null
  for (const key of activeKeys) {
    if (prev) {
      const prevDate = startOfDay(new Date(`${prev}T12:00:00`))
      const curDate = startOfDay(new Date(`${key}T12:00:00`))
      const diff = Math.round((curDate - prevDate) / (1000 * 60 * 60 * 24))
      run = diff === 1 ? run + 1 : 1
    } else {
      run = 1
    }
    best = Math.max(best, run)
    prev = key
  }
  best = Math.max(best, current)

  const recent = [  ]
  for (let i = 13; i >= 0; i -= 1) {
    const d = addDays(now, -i)
    const key = localDayKey(d)
    const entry = days[key]
    recent.push({
      key,
      label: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
      day: d.getDate(),
      active: (entry?.count || 0) > 0,
      count: entry?.count || 0,
      isToday: key === todayKey,
    })
  }

  const totalDays = activeKeys.length
  const todayCount = days[todayKey]?.count || 0

  return {
    current,
    best,
    activeToday,
    atRisk,
    totalDays,
    todayCount,
    todayRevised: days[todayKey]?.revised || 0,
    recent,
  }
}

/** Compress review gaps as the exam approaches. */
export function examIntervalScale(daysLeft = daysUntilExam()) {
  if (daysLeft < 0) return 1
  if (daysLeft <= 7) return 0.35
  if (daysLeft <= 21) return 0.55
  if (daysLeft <= 45) return 0.75
  return 1
}

export function intervalDays(strength, reviewCount, daysLeft = daysUntilExam()) {
  const ladder = REVIEW_INTERVALS[strength] || REVIEW_INTERVALS.average
  const idx = Math.max(0, Math.min(reviewCount, ladder.length - 1))
  const raw = ladder[idx]
  return Math.max(1, Math.round(raw * examIntervalScale(daysLeft)))
}

function strengthGapWeight(strength) {
  if (strength === 'weak') return 3
  if (strength === 'unrated') return 2.6
  if (strength === 'average') return 1.8
  return 1
}

/** Marks still not fully earned for a topic — the main exam priority signal. */
export function topicMarksAtRisk(topic, entry) {
  const readiness = topicReadiness(topic, entry)
  const gap = Math.max(0, topic.marks - readiness.earned)
  const need =
    1 +
    (readiness.unrated / Math.max(1, readiness.totalSubs)) * 0.45 +
    (readiness.weak / Math.max(1, readiness.totalSubs)) * 0.55
  const daysLeft = daysUntilExam()
  const lateBoost = daysLeft >= 0 && daysLeft <= 21 ? 1.25 : 1
  const highBoost = isHighMarkTopic(topic.marks) ? 1.2 : 1
  const priority = gap * need * lateBoost * highBoost
  return {
    ...readiness,
    gap,
    priority,
    pct: topic.marks ? Math.round((readiness.earned / topic.marks) * 100) : 0,
    highMark: isHighMarkTopic(topic.marks),
  }
}

export function isReviewDue(sub, now = new Date()) {
  if (!sub || sub.strength === 'unrated') return false
  if (!sub.nextReviewAt) return !sub.revised
  return startOfDay(new Date(sub.nextReviewAt)) <= startOfDay(now)
}

export function daysUntilReview(sub, now = new Date()) {
  if (!sub?.nextReviewAt) return isReviewDue(sub, now) ? 0 : null
  const due = startOfDay(new Date(sub.nextReviewAt))
  const today = startOfDay(now)
  return Math.round((due - today) / (1000 * 60 * 60 * 24))
}

function emptySub() {
  return {
    strength: 'unrated',
    revised: false,
    revisedAt: null,
    nextReviewAt: null,
    reviewCount: 0,
  }
}

function emptyProgress() {
  const progress = {}
  for (const topic of allTopics()) {
    progress[topic.id] = {
      status: 'todo',
      notes: '',
      subs: Object.fromEntries(topic.points.map((_, i) => [i, emptySub()])),
    }
  }
  return progress
}

function normalizeSub(s) {
  if (!s) return emptySub()
  const strength = s.strength || 'unrated'
  const revised = !!s.revised
  const revisedAt = s.revisedAt || null
  const reviewCount = Number.isFinite(s.reviewCount)
    ? Math.max(0, s.reviewCount)
    : revised
      ? 1
      : 0

  let nextReviewAt = s.nextReviewAt || null
  if (strength !== 'unrated' && !nextReviewAt) {
    // Migrate older saves: unrevised → due today; revised strong → later.
    if (!revised || strength === 'weak' || strength === 'average') {
      nextReviewAt = toDateKey(new Date())
    } else if (revisedAt) {
      nextReviewAt = toDateKey(
        addDays(new Date(revisedAt), intervalDays(strength, reviewCount - 1)),
      )
    } else {
      nextReviewAt = toDateKey(addDays(new Date(), intervalDays(strength, 0)))
    }
  }

  return { strength, revised, revisedAt, nextReviewAt, reviewCount }
}

function normalizeProgress(saved) {
  const base = emptyProgress()
  for (const id of Object.keys(base)) {
    if (!saved?.[id]) continue
    const subs = { ...base[id].subs }
    for (const key of Object.keys(subs)) subs[key] = normalizeSub(saved[id].subs?.[key])
    base[id] = { status: saved[id].status || 'todo', notes: saved[id].notes || '', subs }
  }
  return base
}

function strengthMeta(id) {
  return STRENGTHS.find((s) => s.id === id) || STRENGTHS[0]
}

function statusWeight(status) {
  return STATUSES.find((s) => s.id === status)?.weight ?? 0
}

function deriveTopicStatus(subs, pointsLen) {
  const list = Array.from({ length: pointsLen }, (_, i) => subs[i] || emptySub())
  const rated = list.filter((s) => s.strength !== 'unrated')
  if (rated.length === 0) return 'todo'
  const allRevised = rated.length === list.length && list.every((s) => s.revised)
  if (allRevised) return 'revised'
  const allStrong =
    rated.length === list.length && list.every((s) => s.strength === 'strong')
  if (allStrong) return 'done'
  if (rated.some((s) => s.strength === 'strong' || s.revised)) return 'learning'
  if (rated.length > 0) return 'learning'
  return 'todo'
}

function topicReadiness(topic, entry) {
  const share = topic.marks / topic.points.length
  let earned = 0
  let strong = 0
  let average = 0
  let weak = 0
  let unrated = 0
  let revised = 0

  topic.points.forEach((_, i) => {
    const sub = entry?.subs?.[i] || emptySub()
    let w = strengthMeta(sub.strength).weight
    if (sub.revised) w = Math.min(1, w + 0.15)
    earned += share * w
    if (sub.strength === 'strong') strong += 1
    else if (sub.strength === 'average') average += 1
    else if (sub.strength === 'weak') weak += 1
    else unrated += 1
    if (sub.revised) revised += 1
  })

  return {
    earned,
    strong,
    average,
    weak,
    unrated,
    revised,
    totalSubs: topic.points.length,
  }
}

export function subjectStats(subject, progress) {
  let earned = 0
  let doneTopics = 0
  let totalTopics = 0
  let strong = 0
  let average = 0
  let weak = 0
  let unrated = 0
  let revised = 0
  let totalSubs = 0

  for (const unit of subject.units) {
    for (const topic of unit.topics) {
      totalTopics += 1
      const entry = progress[topic.id]
      const r = topicReadiness(topic, entry)
      earned += r.earned
      strong += r.strong
      average += r.average
      weak += r.weak
      unrated += r.unrated
      revised += r.revised
      totalSubs += r.totalSubs
      const weight = statusWeight(entry?.status)
      if (weight >= 0.85) doneTopics += 1
    }
  }

  const total = subject.totalMarks
  const marksAtRisk = Math.max(0, Math.round((total - earned) * 10) / 10)

  return {
    earned,
    total,
    marksAtRisk,
    pct: total ? Math.round((earned / total) * 100) : 0,
    riskPct: total ? Math.round((marksAtRisk / total) * 100) : 0,
    doneTopics,
    totalTopics,
    strong,
    average,
    weak,
    unrated,
    revised,
    totalSubs,
    revisionPct: totalSubs ? Math.round((revised / totalSubs) * 100) : 0,
  }
}

export function buildAnalytics(progress) {
  const bySubject = SUBJECTS.map((subject) => {
    const stats = subjectStats(subject, progress)
    return {
      id: subject.id,
      name: subject.short,
      fullName: subject.name,
      accent: subject.accent,
      marks: subject.totalMarks,
      ...stats,
    }
  })

  const totals = bySubject.reduce(
    (acc, s) => {
      acc.earned += s.earned
      acc.total += s.total
      acc.strong += s.strong
      acc.average += s.average
      acc.weak += s.weak
      acc.unrated += s.unrated
      acc.revised += s.revised
      acc.totalSubs += s.totalSubs
      acc.doneTopics += s.doneTopics
      acc.totalTopics += s.totalTopics
      return acc
    },
    {
      earned: 0,
      total: 0,
      strong: 0,
      average: 0,
      weak: 0,
      unrated: 0,
      revised: 0,
      totalSubs: 0,
      doneTopics: 0,
      totalTopics: 0,
    },
  )

  totals.pct = totals.total
    ? Math.round((totals.earned / totals.total) * 100)
    : 0
  totals.revisionPct = totals.totalSubs
    ? Math.round((totals.revised / totals.totalSubs) * 100)
    : 0

  const daysLeft = daysUntilExam()
  const phase = examPhase(daysLeft)

  const priorityTopics = allTopics()
    .map((topic) => {
      const entry = progress[topic.id]
      const risk = topicMarksAtRisk(topic, entry)
      return {
        id: topic.id,
        title: topic.title,
        marks: topic.marks,
        subjectId: topic.subjectId,
        subjectShort: topic.subjectShort,
        accent: topic.accent,
        unitTitle: topic.unitTitle,
        ...risk,
      }
    })
    .filter((t) => t.gap >= 0.35)
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      return b.marks - a.marks
    })

  // Full paper risk from subject stats (keeps charts + list in sync)
  const totalMarksAtRisk = Math.round(
    bySubject.reduce((sum, s) => sum + s.marksAtRisk, 0) * 10,
  ) / 10

  const riskBySubject = [...bySubject]
    .map((s) => ({
      id: s.id,
      name: s.name,
      fullName: s.fullName,
      accent: s.accent,
      marks: s.marks,
      gap: s.marksAtRisk,
      earned: s.earned,
      pct: s.pct,
      riskPct: s.riskPct,
      topics: priorityTopics
        .filter((t) => t.subjectId === s.id)
        .slice(0, 4),
    }))
    .sort((a, b) => b.gap - a.gap)

  const topPriorityTopics = priorityTopics.slice(0, 12)

  const weakList = allSubtopics()
    .map((sub) => {
      const entry = progress[sub.topicId]?.subs?.[sub.index] || emptySub()
      return { ...sub, ...entry }
    })
    .filter((s) => s.strength === 'weak' || (s.strength === 'average' && !s.revised))
    .sort((a, b) => {
      // Prefer weak spots inside higher-mark topics.
      const score = (s) =>
        (s.topicMarks || 0) * strengthGapWeight(s.strength)
      if (score(b) !== score(a)) return score(b) - score(a)
      const rank = { weak: 0, average: 1 }
      return (rank[a.strength] ?? 2) - (rank[b.strength] ?? 2)
    })

  const enriched = allSubtopics().map((sub) => {
    const entry = progress[sub.topicId]?.subs?.[sub.index] || emptySub()
    const dueIn = daysUntilReview(entry)
    const markScore =
      (sub.topicMarks || 0) * strengthGapWeight(entry.strength || sub.strength)
    return {
      ...sub,
      ...entry,
      dueIn,
      due: isReviewDue(entry),
      markScore,
      highMark: isHighMarkTopic(sub.topicMarks),
    }
  })

  const revisionQueue = enriched
    .filter((s) => s.due)
    .sort((a, b) => {
      // Overdue first, then highest exam-mark impact, then weakness.
      if (a.dueIn !== b.dueIn) return (a.dueIn ?? 0) - (b.dueIn ?? 0)
      if (b.markScore !== a.markScore) return b.markScore - a.markScore
      const rank = { weak: 0, average: 1, strong: 2 }
      if (a.revised !== b.revised) return a.revised ? 1 : -1
      return (rank[a.strength] ?? 3) - (rank[b.strength] ?? 3)
    })

  const upcomingReviews = enriched
    .filter((s) => s.strength !== 'unrated' && !s.due && s.nextReviewAt)
    .sort((a, b) => {
      if ((a.dueIn ?? 99) !== (b.dueIn ?? 99)) {
        return (a.dueIn ?? 99) - (b.dueIn ?? 99)
      }
      return (b.markScore || 0) - (a.markScore || 0)
    })
    .slice(0, 20)

  const exam = {
    daysLeft,
    phase,
    priorityTopics: topPriorityTopics,
    riskBySubject,
    marksAtRisk: totalMarksAtRisk,
    intervalScale: examIntervalScale(daysLeft),
  }

  return { bySubject, totals, weakList, revisionQueue, upcomingReviews, exam }
}

export function useProgress() {
  const [progress, setProgress] = useState(emptyProgress)
  const [activity, setActivity] = useState(emptyActivity)
  const [tests, setTests] = useState([])
  const [settings, setSettings] = useState({ examDate: '', dailyTarget: 5, darkMode: false })
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [storageError, setStorageError] = useState('')
  const saveQueue = useRef(Promise.resolve())

  useEffect(() => {
    let active = true
    fetch('/api/data')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load data.json')
        return response.json()
      })
      .then((saved) => {
        if (!active) return
        setProgress(normalizeProgress(saved.progress))
        setActivity(saved.activity || emptyActivity())
        setTests(Array.isArray(saved.tests) ? saved.tests : [])
        setSettings({ examDate: '', dailyTarget: 5, darkMode: false, ...(saved.settings || {}) })
        setStorageError('')
        setLoaded(true)
        setReady(true)
      })
      .catch(() => {
        if (!active) return
        setStorageError('Could not load data.json. Start the app with npm run dev to save data.')
        setReady(true)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!ready || !loaded) return
    const snapshot = JSON.stringify({ progress, activity, tests, settings })
    saveQueue.current = saveQueue.current
      .catch(() => {})
      .then(async () => {
        const response = await fetch('/api/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: snapshot,
        })
        if (!response.ok) throw new Error('Save failed')
        setStorageError('')
      })
      .catch(() => setStorageError('Could not save data.json. Your latest changes may not be saved.'))
  }, [progress, activity, tests, settings, ready, loaded])

  const analytics = useMemo(() => buildAnalytics(progress), [progress])
  const streak = useMemo(() => buildStreak(activity), [activity])

  function logActivity(kind) {
    setActivity((prev) => bumpActivity(prev, kind))
  }

  function addTest(test) {
    setTests((prev) => [{ ...test, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }, ...prev])
    logActivity('test')
    if (test.attempted - test.correct > 0 && test.mistakes.reduce((sum, n) => sum + Number(n || 0), 0) !== test.attempted - test.correct) return
    if (test.attempted > 0 && (test.correct / test.attempted) * 100 < 60) {
      const topic = allTopics().find((item) => item.id === test.topicId)
      if (!topic) return
      setProgress((prev) => {
        const entry = prev[topic.id]
        const subs = { ...entry.subs, 0: { ...entry.subs[0], strength: 'weak', revised: false, nextReviewAt: toDateKey(new Date()) } }
        return { ...prev, [topic.id]: { ...entry, subs, status: deriveTopicStatus(subs, topic.points.length) } }
      })
    }
  }

  function deleteTest(id) { setTests((prev) => prev.filter((test) => test.id !== id)) }
  function updateSettings(patch) { setSettings((prev) => ({ ...prev, ...patch })) }
  function replaceBackup(data) {
    const next = JSON.parse(data)
    const imported = next?.progress ? next : { progress: next }
    setProgress(normalizeProgress(imported.progress))
    setActivity(imported.activity || emptyActivity())
    setTests(Array.isArray(imported.tests) ? imported.tests : [])
    setSettings({ examDate: '', dailyTarget: 5, darkMode: false, ...(imported.settings || {}) })
  }

  const backupData = JSON.stringify({ progress, activity, tests, settings }, null, 2)

  function applyStrength(sub, strength) {
    const wasUnrated = !sub || sub.strength === 'unrated'
    const next = { ...emptySub(), ...sub, strength }
    // First time you finish studying a sub-topic → due for revision today.
    if (wasUnrated && strength !== 'unrated') {
      next.nextReviewAt = toDateKey(new Date())
      if (!next.revised) next.reviewCount = 0
    }
    return next
  }

  function completeSubRevision(sub) {
    let strength = sub.strength
    if (strength === 'unrated') strength = 'average'
    if (strength === 'weak') strength = 'average'
    const reviewCount = (sub.reviewCount || 0) + 1
    const days = intervalDays(strength, reviewCount - 1)
    return {
      ...sub,
      strength,
      revised: true,
      revisedAt: new Date().toISOString(),
      reviewCount,
      nextReviewAt: toDateKey(addDays(new Date(), days)),
    }
  }

  function setSubStrength(topicId, index, strength) {
    setProgress((prev) => {
      const entry = prev[topicId]
      const topic = allTopics().find((t) => t.id === topicId)
      const subs = {
        ...entry.subs,
        [index]: applyStrength(entry.subs[index], strength),
      }
      return {
        ...prev,
        [topicId]: {
          ...entry,
          subs,
          status: deriveTopicStatus(subs, topic.points.length),
        },
      }
    })
  }

  function cycleSubStrength(topicId, index) {
    const order = ['weak', 'average', 'strong']
    setProgress((prev) => {
      const entry = prev[topicId]
      const current = entry.subs[index]?.strength || 'unrated'
      const at = order.indexOf(current)
      const next = order[at < 0 ? 0 : (at + 1) % order.length]
      const topic = allTopics().find((t) => t.id === topicId)
      const subs = {
        ...entry.subs,
        [index]: applyStrength(entry.subs[index], next),
      }
      return {
        ...prev,
        [topicId]: {
          ...entry,
          subs,
          status: deriveTopicStatus(subs, topic.points.length),
        },
      }
    })
  }

  function completeRevision(topicId, index) {
    setProgress((prev) => {
      const entry = prev[topicId]
      const sub = entry.subs[index] || emptySub()
      const topic = allTopics().find((t) => t.id === topicId)
      const subs = {
        ...entry.subs,
        [index]: completeSubRevision(sub),
      }
      return {
        ...prev,
        [topicId]: {
          ...entry,
          subs,
          status: deriveTopicStatus(subs, topic.points.length),
        },
      }
    })
    logActivity('revise')
  }

  function toggleRevised(topicId, index) {
    let counted = false
    setProgress((prev) => {
      const entry = prev[topicId]
      const sub = entry.subs[index] || emptySub()
      const topic = allTopics().find((t) => t.id === topicId)

      // Due again (or never revised) → complete this review cycle.
      if (isReviewDue(sub) || !sub.revised) {
        counted = true
        const subs = {
          ...entry.subs,
          [index]: completeSubRevision(sub),
        }
        return {
          ...prev,
          [topicId]: {
            ...entry,
            subs,
            status: deriveTopicStatus(subs, topic.points.length),
          },
        }
      }

      // Not due and already revised → undo last revision mark.
      const subs = {
        ...entry.subs,
        [index]: {
          ...sub,
          revised: false,
          revisedAt: null,
          reviewCount: Math.max(0, (sub.reviewCount || 1) - 1),
          nextReviewAt: toDateKey(new Date()),
        },
      }
      return {
        ...prev,
        [topicId]: {
          ...entry,
          subs,
          status: deriveTopicStatus(subs, topic.points.length),
        },
      }
    })
    if (counted) logActivity('revise')
  }

  function cycleStatus(topicId) {
    setProgress((prev) => {
      const current = prev[topicId]?.status || 'todo'
      const idx = STATUSES.findIndex((s) => s.id === current)
      const next = STATUSES[(idx + 1) % STATUSES.length].id
      return {
        ...prev,
        [topicId]: { ...prev[topicId], status: next },
      }
    })
  }

  function setNotes(topicId, notes) {
    setProgress((prev) => ({
      ...prev,
      [topicId]: { ...prev[topicId], notes },
    }))
  }

  function markTopicRevised(topicId) {
    let completed = 0
    setProgress((prev) => {
      const entry = prev[topicId]
      const topic = allTopics().find((t) => t.id === topicId)
      const subs = { ...entry.subs }
      for (let i = 0; i < topic.points.length; i += 1) {
        const sub = subs[i] || emptySub()
        if (sub.strength === 'unrated') continue
        // Only complete reviews that are currently due (or never revised).
        if (isReviewDue(sub) || !sub.revised) {
          subs[i] = completeSubRevision(sub)
          completed += 1
        }
      }
      return {
        ...prev,
        [topicId]: {
          ...entry,
          subs,
          status: deriveTopicStatus(subs, topic.points.length),
        },
      }
    })
    if (completed > 0) logActivity('revise')
  }

  function resetAll() {
    setProgress(emptyProgress())
    setActivity(emptyActivity())
    setTests([])
    setSettings({ examDate: '', dailyTarget: 5, darkMode: false })
  }

  return {
    progress,
    cycleStatus,
    cycleSubStrength,
    setSubStrength,
    toggleRevised,
    completeRevision,
    markTopicRevised,
    setNotes,
    resetAll,
    analytics,
    streak,
    overall: analytics.totals,
    subjectStats: (subject) => subjectStats(subject, progress),
    tests, addTest, deleteTest, settings, updateSettings, replaceBackup,
    backupData,
    storageError,
  }
}
