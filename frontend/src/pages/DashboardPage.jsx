import { useCallback, useEffect, useMemo, useState } from 'react'
import { BarChart3, Bell, Lightbulb, Search, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardService } from '../services/dashboardService'
import { learningService } from '../services/learningService'
import { GoalsSection } from '../components/GoalsSection'
import { createGoalFromKey, getGoalSuggestions, calculateGoalProgress } from '../utils/goalsLogic'
import { shortDate } from '../utils/formatters'

const STARTER_TOOLS = [
  {
    name: 'ChatGPT',
    description: 'Best for coding, writing, and general tasks.',
    url: 'https://chat.openai.com/',
  },
  {
    name: 'Grammarly',
    description: 'Writing improvement with grammar and tone help.',
    url: 'https://www.grammarly.com/',
  },
  {
    name: 'Canva AI',
    description: 'Quickly generate polished designs and visuals.',
    url: 'https://www.canva.com/magic-write/',
  },
]

function DashboardPage() {
  const { user, logout } = useAuth()
  const [sessionId] = useState(() => crypto.randomUUID())
  const [queryText, setQueryText] = useState('')
  const [queryLoading, setQueryLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [activityActionId, setActivityActionId] = useState('')
  const [activity, setActivity] = useState([])
  const [goals, setGoals] = useState(() => [
    createGoalFromKey('routing_mastery'),
    createGoalFromKey('tool_exploration'),
    createGoalFromKey('query_optimization'),
  ])
  const [, setGoalMetrics] = useState({
    routedQueries: 0,
    toolUses: 0,
    uniqueToolsUsed: 0,
    activeDays: 0,
    avgScore: 0,
  })
  const [stats, setStats] = useState({ queries: 0, hoursSaved: 0, avgScore: 0 })
  const [learningSummary, setLearningSummary] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastRoute, setLastRoute] = useState(null)

  const isNewUser = stats.queries === 0
  const goalSuggestions = useMemo(() => getGoalSuggestions(goals), [goals])

  const metrics = useMemo(
    () => [
      { icon: BarChart3, label: 'Queries', value: String(stats.queries), color: 'text-indigo-600' },
      { icon: Sparkles, label: 'Hours Saved', value: String(Number(stats.hoursSaved).toFixed(1)), color: 'text-emerald-600' },
      { icon: BarChart3, label: 'Avg Score', value: `${Number(stats.avgScore).toFixed(0)}%`, color: 'text-blue-600' },
    ],
    [stats],
  )

  const applyGoalEvent = useCallback((eventType, payload = {}) => {
    const today = new Date().toISOString().slice(0, 10)

    setGoalMetrics((prev) => {
      const nextMetrics = {
        ...prev,
        routedQueries: eventType === 'route_query' ? prev.routedQueries + 1 : prev.routedQueries,
        toolUses: eventType === 'tool_click' ? prev.toolUses + 1 : prev.toolUses,
        uniqueToolsUsed: payload.toolName
          ? Math.max(prev.uniqueToolsUsed, new Set([...(payload.currentTools || []), payload.toolName]).size)
          : prev.uniqueToolsUsed,
        activeDays: Math.max(prev.activeDays, new Set([...(payload.activeDates || []), today]).size || 1),
      }

      setGoals((previousGoals) => calculateGoalProgress(previousGoals, nextMetrics, eventType))
      return nextMetrics
    })
  }, [])

  const loadDashboardData = useCallback(async () => {
    setInitialLoading(true)
    setError('')

    try {
      const [statsData, historyData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getHistory(20),
      ])

      learningService.getSummary().then(setLearningSummary).catch(() => {})

      const rows = historyData || []
      const routedQueries = rows.length
      const uniqueTools = new Set(rows.map((item) => item.model).filter(Boolean)).size
      const activeDays = new Set(rows.map((item) => String(item.createdAt).slice(0, 10))).size

      setStats({
        queries: Number(statsData.queries || 0),
        hoursSaved: Number(statsData.hoursSaved || 0),
        avgScore: Number(statsData.avgScore || 0),
      })

      setActivity(
        rows.map((item) => ({
          id: item.id,
          query: item.query,
          toolUsed: item.model,
          createdAt: item.createdAt,
        })),
      )

      const nextMetrics = {
        routedQueries,
        toolUses: 0,
        uniqueToolsUsed: uniqueTools,
        activeDays,
        avgScore: Number(statsData.avgScore || 0),
      }

      setGoalMetrics(nextMetrics)
      setGoals((prevGoals) => calculateGoalProgress(prevGoals, nextMetrics, 'daily_usage'))
    } catch (apiError) {
      if (apiError.response?.status === 401) {
        setError('Session expired. Redirecting to login...')
      } else {
        setError(apiError.response?.data?.message || 'Failed to load dashboard data.')
      }
    } finally {
      setInitialLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboardData()
    }, 0)

    return () => clearTimeout(timer)
  }, [loadDashboardData])

  const submitQuery = async (event) => {
    event.preventDefault()
    if (!queryText.trim()) {
      return
    }

    setQueryLoading(true)
    setError('')
    setSuccess('')

    try {
      const trimmedQuery = queryText.trim()
      const data = await dashboardService.routeQuery({ text: trimmedQuery, sessionId })

      setStats((prev) => ({
        ...prev,
        queries: prev.queries + 1,
      }))

      setLastRoute(data)
      setActivity((prev) => [
        {
          id: data.queryId,
          query: trimmedQuery,
          toolUsed: data.toolName,
          createdAt: data.timestamp,
        },
        ...prev,
      ])

      applyGoalEvent('route_query', {
        activeDates: activity.map((item) => String(item.createdAt).slice(0, 10)),
      })

      learningService.trackToolUsage(data.toolName).then(() => {
        return learningService.getSummary().then(setLearningSummary)
      }).catch(() => {})

      setQueryText('')
      setSuccess(`Routed to ${data.toolName}. Opening tool...`)
      window.open(data.toolUrl, '_blank', 'noopener,noreferrer')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to route query.')
    } finally {
      setQueryLoading(false)
    }
  }

  const handleToolClick = async (tool) => {
    setError('')
    setSuccess('')

    try {
      await dashboardService.trackToolClick(tool.name)
      setStats((prev) => ({
        ...prev,
        queries: prev.queries + 1,
      }))

      applyGoalEvent('tool_click', {
        toolName: tool.name,
        currentTools: activity.map((item) => item.toolUsed).filter(Boolean),
        activeDates: activity.map((item) => String(item.createdAt).slice(0, 10)),
      })

      learningService.trackToolUsage(tool.name).then(() => {
        return learningService.getSummary().then(setLearningSummary)
      }).catch(() => {})

      setSuccess(`Opening ${tool.name}...`)
      window.open(tool.url, '_blank', 'noopener,noreferrer')
    } catch {
      setError('Failed to track tool click.')
    }
  }

  const handleAddGoalSuggestion = useCallback((goalKey) => {
    const nextGoal = createGoalFromKey(goalKey)
    if (!nextGoal) {
      return
    }

    setGoals((prev) => {
      if (prev.some((goal) => goal.key === nextGoal.key)) {
        return prev
      }
      return [...prev, nextGoal]
    })

    setSuccess('Goal added from suggestions.')
  }, [])

  const handleEditActivity = async (item) => {
    const nextQuery = window.prompt('Edit query text:', item.query)
    if (nextQuery === null) {
      return
    }

    const trimmed = nextQuery.trim()
    if (trimmed.length < 3) {
      setError('Query must be at least 3 characters.')
      return
    }

    setError('')
    setSuccess('')
    setActivityActionId(String(item.id))

    try {
      const data = await dashboardService.updateHistoryItem(item.id, { query: trimmed })
      setActivity((prev) =>
        prev.map((entry) =>
          String(entry.id) === String(item.id)
            ? {
                ...entry,
                query: data.item?.query || trimmed,
              }
            : entry,
        ),
      )
      setSuccess('Activity updated.')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to update activity.')
    } finally {
      setActivityActionId('')
    }
  }

  const handleDeleteActivity = async (item) => {
    if (!window.confirm('Delete this activity item?')) {
      return
    }

    setError('')
    setSuccess('')
    setActivityActionId(String(item.id))

    try {
      await dashboardService.deleteHistoryItem(item.id)
      setActivity((prev) => prev.filter((entry) => String(entry.id) !== String(item.id)))
      setStats((prev) => ({
        ...prev,
        queries: Math.max(0, prev.queries - 1),
      }))
      setSuccess('Activity deleted.')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to delete activity.')
    } finally {
      setActivityActionId('')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">N</div>
            <p className="text-xl font-semibold">Nexora</p>
          </div>

          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            <Link className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-900" to="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" to="/discover-tools">
              Discover Tools
            </Link>
            <Link className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" to="/learning-hub">
              Learning Hub
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 lg:flex">
              <Search className="h-4 w-4" />
              <span>Describe what you want to accomplish...</span>
            </div>
            <button type="button" className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-200 text-center text-xs font-semibold leading-8 text-slate-700">
              {user?.name?.[0] ?? 'U'}
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h1>
          <p className="mt-2 text-slate-600">Nexora will learn from your usage and improve recommendations.</p>
        </div>

        {error ? <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {success ? <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}

        {!isNewUser ? (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <Icon className={`mb-3 h-5 w-5 ${metric.color}`} />
                  <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{metric.label}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No activity yet. Start by routing your first query 🚀
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-slate-900">In-app Learning Tip</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                {learningSummary?.tip || 'Use one tool action plus one learning module to accelerate progress today.'}
              </p>
              <p className="mt-2 text-xs font-semibold text-indigo-600">
                Next step: {learningSummary?.nextRecommendedStep || 'Open Learning Hub and start a path.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-1 font-semibold text-slate-900">Route your query</h2>
              <p className="mb-5 text-sm text-slate-600">We will route this request to the best matching tool.</p>

              <form className="space-y-4" onSubmit={submitQuery}>
                <textarea
                  value={queryText}
                  onChange={(event) => setQueryText(event.target.value)}
                  rows={4}
                  placeholder="Ask anything... Nexora will route you to the right tool"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />

                <button
                  type="submit"
                  disabled={queryLoading || !queryText.trim()}
                  className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {queryLoading ? 'Routing...' : 'Route Query'}
                </button>
              </form>

              {lastRoute ? (
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  Routed to <strong>{lastRoute.toolName}</strong>. The tool opened in a new tab.
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <GoalsSection
              goals={goals}
              isNewUser={isNewUser}
              goalSuggestions={goalSuggestions}
              onAddGoal={handleAddGoalSuggestion}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-slate-900">Recent Activity</h3>
            <div className="space-y-3">
              {initialLoading ? <p className="py-2 text-sm text-slate-500">Loading activity...</p> : null}
              {!initialLoading && activity.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">No activity yet. Try routing a query!</p>
              ) : null}
              {activity.slice(0, 5).map((item) => (
                <div key={item.id} className="border-b border-slate-100 pb-3 last:border-0">
                  <p className="text-sm font-medium text-slate-900">{item.query}</p>
                  <p className="mt-1 text-xs text-slate-600">Tool: {item.toolUsed}</p>
                  <p className="mt-1 text-xs text-slate-500">{shortDate(item.createdAt)}</p>
                  <div className="mt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditActivity(item)}
                      disabled={activityActionId === String(item.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteActivity(item)}
                      disabled={activityActionId === String(item.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-slate-900">Popular with new users</h3>
            <div className="space-y-3">
              {STARTER_TOOLS.map((tool) => (
                <div key={tool.name} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">{tool.name}</p>
                  <p className="mt-1 text-xs text-slate-600">{tool.description}</p>
                  <button
                    type="button"
                    onClick={() => handleToolClick(tool)}
                    className="mt-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-slate-50"
                  >
                    Try Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage
