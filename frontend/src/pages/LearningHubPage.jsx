import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, BookOpen, ChevronRight, Clock3, ExternalLink, Search, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { learningService } from '../services/learningService'

const sections = ['Learning Paths', 'Quick Tutorials', 'AI Glossary', 'Achievements']

function LearningHubPage() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('Learning Paths')
  const [searchTerm, setSearchTerm] = useState('')
  const [learningPaths, setLearningPaths] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState('')
  const [summary, setSummary] = useState(null)
  const [expandedPathId, setExpandedPathId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadSummary = async () => {
    const data = await learningService.getSummary()
    setSummary(data)
  }

  const loadPaths = async (search = '') => {
    setLoading(true)
    setError('')

    try {
      const paths = await learningService.listPaths(search)
      setLearningPaths(paths)
    } catch {
      setError('Failed to load learning paths.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      Promise.all([loadPaths(''), loadSummary()]).catch(() => {
        setError('Failed to load learning hub data.')
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const filteredPaths = useMemo(() => {
    if (tab !== 'Learning Paths') {
      return []
    }
    return learningPaths
  }, [learningPaths, tab])

  const handleSearch = async (event) => {
    const nextValue = event.target.value
    setSearchTerm(nextValue)
    await loadPaths(nextValue)
  }

  const handlePrimaryAction = async (path) => {
    setActionLoadingId(path.id)
    setError('')
    setSuccess('')

    try {
      if (!path.enrolled) {
        await learningService.enroll(path.id)
        setExpandedPathId(path.id)
        setSuccess('Path started. Open a module to continue.')
      } else {
        setExpandedPathId((prev) => (prev === path.id ? '' : path.id))
        setSuccess('Select a module and learn by doing.')
      }

      await Promise.all([loadPaths(searchTerm), loadSummary()])
    } catch {
      setError('Unable to save your learning update.')
    } finally {
      setActionLoadingId('')
    }
  }

  const handleUnenroll = async (path) => {
    if (!window.confirm(`Remove enrollment for "${path.title}"?`)) {
      return
    }

    setActionLoadingId(path.id)
    setError('')
    setSuccess('')

    try {
      await learningService.unenroll(path.id)
      setSuccess('Enrollment removed.')
      if (expandedPathId === path.id) {
        setExpandedPathId('')
      }
      await Promise.all([loadPaths(searchTerm), loadSummary()])
    } catch {
      setError('Unable to remove enrollment.')
    } finally {
      setActionLoadingId('')
    }
  }

  const handleOpenModule = async (pathId, module) => {
    setActionLoadingId(`${pathId}:${module.id}`)
    setError('')
    setSuccess('')

    try {
      await learningService.openModule(pathId, module.id)
      setSuccess('Module opened. Progress updated from your learning action.')
      window.open(module.url, '_blank', 'noopener,noreferrer')
      await Promise.all([loadPaths(searchTerm), loadSummary()])
    } catch {
      setError('Unable to open module right now.')
    } finally {
      setActionLoadingId('')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">N</div>
            <p className="text-xl font-semibold">Nexora</p>
          </div>

          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            <Link className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" to="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" to="/discover-tools">
              Discover Tools
            </Link>
            <Link className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-900" to="/learning-hub">
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

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-5xl font-semibold tracking-tight">Learning Hub</h1>
        <p className="mt-2 text-slate-500">Structured learning paths to master AI tools at your own pace</p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">
            Active learning path: {summary?.activePath?.title || 'No active path yet'}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Progress: {summary?.activePath?.progress ?? 0}%
          </p>
          <p className="mt-1 text-sm text-indigo-600">
            Next recommended step: {summary?.nextRecommendedStep || 'Start a path and open your first module.'}
          </p>
        </div>

        <div className="mt-5 max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search tutorials, courses..."
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {success ? <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 md:grid-cols-4">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setTab(section)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === section ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {loading ? <p className="text-sm text-slate-500">Loading learning paths...</p> : null}
          {!loading && tab !== 'Learning Paths' ? (
            <p className="text-sm text-slate-500">{tab} content is coming soon. Switch back to Learning Paths to continue.</p>
          ) : null}
          {filteredPaths.map((path) => (
            <article key={path.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img src={path.image} alt={path.title} className="h-44 w-full object-cover" />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-4xl font-semibold leading-tight">{path.title}</h3>
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {path.level}
                  </span>
                </div>

                <p className="mt-3 text-slate-500">{path.description}</p>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Progress</span>
                    <span>{path.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-slate-950" style={{ width: `${path.progress}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Next: {path.nextRecommendedStep}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-500">
                  <p className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" />
                    {path.duration}
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {path.modulesCount}
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {path.learners}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold">You'll learn:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {path.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handlePrimaryAction(path)}
                  disabled={actionLoadingId === path.id}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {actionLoadingId === path.id ? 'Saving...' : path.action}
                  <ChevronRight className="h-4 w-4" />
                </button>
                {path.enrolled ? (
                  <button
                    type="button"
                    onClick={() => handleUnenroll(path)}
                    disabled={actionLoadingId === path.id}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Unenroll
                  </button>
                ) : null}

                {path.enrolled && expandedPathId === path.id ? (
                  <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Modules</p>
                    {path.modules.map((module) => (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => handleOpenModule(path.id, module)}
                        disabled={actionLoadingId === `${path.id}:${module.id}`}
                        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                      >
                        <span>
                          {module.title}
                          <span className="ml-2 text-xs text-slate-500">{module.type}</span>
                        </span>
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">N</div>
              <p className="text-xl font-semibold">Nexora</p>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-500">
              Smarter AI routing for everyone, regardless of technical background.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Discover Tools</li>
              <li>Learning Hub</li>
              <li>Community</li>
              <li>Tool Comparison</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>AI Glossary</li>
              <li>Safety Guidelines</li>
              <li>Getting Started Guide</li>
              <li>Best Practices</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-sm text-slate-500">
            <p>© 2026 Nexora. All rights reserved.</p>
            <p>Accessibility: WCAG 2.1 AA Compliant</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default LearningHubPage
