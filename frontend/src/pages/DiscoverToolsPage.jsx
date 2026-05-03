import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  Camera,
  ChevronDown,
  ChevronRight,
  Headphones,
  MessageSquare,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
  Wand2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toolsService } from '../services/toolsService'
import { learningService } from '../services/learningService'

const categories = [
  { name: 'All Tools', count: 150, icon: Search },
  { name: 'Writing & Editing', count: 25, icon: Wand2 },
  { name: 'Data Analysis', count: 18, icon: Sparkles },
  { name: 'Creative & Design', count: 32, icon: Palette },
  { name: 'Productivity', count: 28, icon: Sparkles },
  { name: 'Communication', count: 15, icon: MessageSquare },
  { name: 'Photo & Video', count: 22, icon: Camera },
  { name: 'Audio & Music', count: 8, icon: Headphones },
  { name: 'Research & Learning', count: 20, icon: Video },
]

function DiscoverToolsPage() {
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Tools')
  const [selectedPricing, setSelectedPricing] = useState([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [skillLevel, setSkillLevel] = useState('Any level')
  const [sort, setSort] = useState('Most Popular')
  const [tools, setTools] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [wizardLoading, setWizardLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchTools = useCallback(async (targetPage, append = false) => {
    setLoading(true)
    setError('')

    try {
      const data = await toolsService.listTools({
        search: query,
        category: selectedCategory,
        pricing: selectedPricing.join(','),
        verified: verifiedOnly ? 'true' : undefined,
        skillLevel,
        page: targetPage,
        limit: 6,
      })

      setTools((prev) => (append ? [...prev, ...data.items] : data.items))
      setPage(data.page)
      setHasMore(data.hasMore)
      setTotal(data.total)
    } catch {
      setError('Failed to load tools.')
    } finally {
      setLoading(false)
    }
  }, [query, selectedCategory, selectedPricing, verifiedOnly, skillLevel])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTools(1, false)
    }, 0)

    return () => clearTimeout(timer)
  }, [fetchTools])

  const filteredTools = useMemo(() => {
    if (sort === 'Most Popular') {
      return [...tools].sort((a, b) => b.rating - a.rating)
    }
    return [...tools].sort((a, b) => a.name.localeCompare(b.name))
  }, [tools, sort])

  const onFindTools = async () => {
    await fetchTools(1, false)
  }

  const onWizard = async () => {
    setWizardLoading(true)
    setError('')
    setSuccess('')

    try {
      const data = await toolsService.runWizard({ query })
      setTools(data.items || [])
      setTotal((data.items || []).length)
      setHasMore(false)
      setSuccess(data.message || 'Recommendations ready.')
    } catch {
      setError('Failed to generate recommendations.')
    } finally {
      setWizardLoading(false)
    }
  }

  const onPricingChange = (option) => {
    setSelectedPricing((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]))
  }

  const onToolAction = async (tool) => {
    setSuccess('')
    setError('')

    try {
      await toolsService.trackToolClick(tool.name)
      learningService.trackToolUsage(tool.name).catch(() => {})
      setSuccess(`Opening ${tool.name}...`)
      window.open(tool.url, '_blank', 'noopener,noreferrer')
    } catch {
      setError('Action failed. Please try again.')
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
            <Link className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-900" to="/discover-tools">
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

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-4xl font-semibold tracking-tight">Discover AI Tools</h1>
        <p className="mt-2 text-slate-500">
          Find the perfect AI tools for your tasks. Describe what you want to accomplish or browse by category.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Describe your task... (e.g., summarize lecture notes, create presentations)"
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            type="button"
            onClick={onFindTools}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Find Tools'}
          </button>
        </div>

        {error ? <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        {success ? <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <div>
            <p className="text-lg font-semibold">Not sure what you need?</p>
            <p className="text-sm text-slate-500">Take our 3-step quiz to find personalized AI tool recommendations</p>
          </div>
          <button
            type="button"
            onClick={onWizard}
            disabled={wizardLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 disabled:opacity-60"
          >
            Start Wizard
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-3 text-2xl font-semibold">Categories</h2>
              <ul className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  const active = selectedCategory === category.name

                  return (
                    <li key={category.name}>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(category.name)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                          active ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {category.name}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{category.count}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="mb-4 text-2xl font-semibold">Filters</h2>

              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-slate-700">Skill Level</p>
                <button type="button" className="inline-flex w-full items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  {skillLevel}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="mt-2 flex gap-1 text-xs">
                  {['Any level', 'Beginner', 'Intermediate', 'Advanced'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setSkillLevel(option)}
                      type="button"
                      className={`rounded px-2 py-1 ${skillLevel === option ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Pricing</p>
                <div className="space-y-2 text-sm">
                  {['Free', 'Freemium', 'Paid'].map((option) => (
                    <label key={option} className="flex items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedPricing.includes(option)}
                        onChange={() => onPricingChange(option)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-300"
                      />
                      {option}
                    </label>
                  ))}
                  <label className="mt-2 flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(event) => setVerifiedOnly(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-300"
                    />
                    Safety Verified
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </label>
                </div>
              </div>
            </section>
          </aside>

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-semibold">AI Tools</h2>
                <p className="text-sm text-slate-500">{total} tools found</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="bg-transparent outline-none"
                >
                  <option>Most Popular</option>
                  <option>Name A-Z</option>
                </select>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTools.map((tool) => (
                <article
                  key={tool.id}
                  onClick={() => onToolAction(tool)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onToolAction(tool)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-sm"
                >
                  <img alt={tool.name} className="h-28 w-full object-cover" src={tool.image} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-2xl font-semibold leading-tight">{tool.name}</h3>
                      {tool.verified ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> : null}
                    </div>
                    <p className="mt-2 min-h-11 text-sm text-slate-500">{tool.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>⭐ {tool.rating}</span>
                      <span>{tool.pricing}</span>
                      <span>{tool.time}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tool.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onToolAction(tool)
                        }}
                        className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Try Now
                      </button>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 text-center">
              {hasMore ? (
                <button
                  type="button"
                  onClick={() => fetchTools(page + 1, true)}
                  disabled={loading}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  {loading ? 'Loading...' : 'Load More Tools'}
                </button>
              ) : (
                <span className="text-sm text-slate-500">No more tools to load.</span>
              )}
            </div>
          </section>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">N</div>
              <p className="text-lg font-semibold">Nexora</p>
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
      </footer>
    </main>
  )
}

export default DiscoverToolsPage
