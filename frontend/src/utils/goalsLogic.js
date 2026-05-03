const GOAL_CATALOG = {
  routing_mastery: {
    key: 'routing_mastery',
    title: 'AI Routing Mastery',
    target: 100,
  },
  tool_exploration: {
    key: 'tool_exploration',
    title: 'Tool Exploration',
    target: 100,
  },
  query_optimization: {
    key: 'query_optimization',
    title: 'Query Optimization',
    target: 100,
  },
}

function createGoalFromKey(goalKey) {
  const config = GOAL_CATALOG[goalKey]
  if (!config) {
    return null
  }

  return {
    key: config.key,
    title: config.title,
    progress: 0,
    target: config.target,
    lastUpdated: new Date().toISOString(),
    remainingHint: 'Start with your first action in Nexora.',
    statusMessage: 'Waiting for your first activity',
    completed: false,
  }
}

function getGoalSuggestions(activeGoals) {
  const activeKeys = new Set(activeGoals.map((goal) => goal.key))
  return Object.values(GOAL_CATALOG).filter((goal) => !activeKeys.has(goal.key))
}

function computeGoalHint(goalKey, progress) {
  if (progress >= 100) {
    return 'Goal completed. Great consistency.'
  }

  if (goalKey === 'routing_mastery') {
    const remaining = Math.ceil((100 - progress) / 5)
    return `${remaining} more queries to reach 100%`
  }

  if (goalKey === 'tool_exploration') {
    const remaining = Math.ceil((100 - progress) / 10)
    return `Use ${remaining} more tools to complete this goal`
  }

  const remaining = Math.ceil((100 - progress) / 5)
  return `${remaining} more quality interactions to complete`
}

function calculateGoalProgress(goals, metrics, trigger) {
  return goals.map((goal) => {
    if (goal.completed) {
      return goal
    }

    const previousProgress = goal.progress
    let nextProgress = previousProgress

    if (goal.key === 'routing_mastery') {
      nextProgress = Math.min(100, metrics.routedQueries * 5 + metrics.activeDays)
    }

    if (goal.key === 'tool_exploration') {
      const multiToolBonus = Math.max(0, (metrics.uniqueToolsUsed - 1) * 5)
      nextProgress = Math.min(100, metrics.toolUses * 10 + multiToolBonus + metrics.activeDays)
    }

    if (goal.key === 'query_optimization') {
      const scoreLift = Math.round(metrics.avgScore * 0.35)
      nextProgress = Math.min(100, scoreLift + metrics.routedQueries * 3 + metrics.activeDays * 2)
    }

    const delta = Math.max(0, nextProgress - previousProgress)
    const statusMessage =
      delta > 0
        ? trigger === 'route_query'
          ? `+${delta}% from your last query`
          : trigger === 'tool_click'
            ? `+${delta}% from recent tool usage`
            : 'Progress increased today'
        : 'Updated from recent activity'

    const completed = nextProgress >= 100

    return {
      ...goal,
      progress: nextProgress,
      completed,
      statusMessage: completed ? '✅ Completed' : statusMessage,
      remainingHint: computeGoalHint(goal.key, nextProgress),
      lastUpdated: new Date().toISOString(),
    }
  })
}

export { createGoalFromKey, getGoalSuggestions, calculateGoalProgress }
