import { Trophy } from 'lucide-react'

function GoalProgressBar({ progress }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function formatUpdatedAt(value) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function GoalsSection({ goals, isNewUser, goalSuggestions, onAddGoal }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-5 flex items-center gap-2 font-semibold text-slate-900">
        <Trophy className="h-4 w-4 text-amber-500" /> Goals
      </h3>

      {isNewUser ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
          Start using Nexora to track your progress
        </p>
      ) : null}

      {!isNewUser ? (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.key} className="rounded-xl border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">{goal.title}</span>
                <span className="text-xs font-bold text-slate-700">{goal.progress}%</span>
              </div>

              <GoalProgressBar progress={goal.progress} />

              <p className="mt-2 text-xs text-slate-600">
                {goal.completed ? '✅ Completed' : goal.remainingHint}
              </p>

              <p className="mt-1 text-xs text-indigo-600">{goal.statusMessage}</p>

              <p className="mt-1 text-[11px] text-slate-500">Updated: {formatUpdatedAt(goal.lastUpdated)}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Add from suggestions</p>
        <div className="flex flex-wrap gap-2">
          {goalSuggestions.length === 0 ? (
            <span className="text-xs text-slate-500">All default goals are already active.</span>
          ) : (
            goalSuggestions.map((goal) => (
              <button
                key={goal.key}
                type="button"
                onClick={() => onAddGoal(goal.key)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {goal.title}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export { GoalsSection }
