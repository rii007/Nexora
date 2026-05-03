const TOOL_CATALOG = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com/',
    category: 'Writing & Editing',
    description: 'Advanced AI assistant for writing, coding, and problem-solving.',
    rating: 4.8,
    pricing: 'Freemium',
    time: '15 min',
    tags: ['Beginner', 'Popular', 'Verified'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=60',
    verified: true,
  },
  {
    id: 'canva-ai',
    name: 'Canva AI',
    url: 'https://www.canva.com/magic-write/',
    category: 'Creative & Design',
    description: 'Create stunning designs with AI-powered templates and tools.',
    rating: 4.7,
    pricing: 'Free',
    time: '10 min',
    tags: ['Beginner', 'Easy to use', 'Popular'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=60',
    verified: true,
  },
  {
    id: 'tableau-ai',
    name: 'Tableau AI',
    url: 'https://www.tableau.com/products/tableau-ai',
    category: 'Data Analysis',
    description: 'Transform your data into interactive visual dashboards.',
    rating: 4.6,
    pricing: 'Paid',
    time: '45 min',
    tags: ['Intermediate', 'Professional', 'Enterprise'],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=60',
    verified: true,
  },
  {
    id: 'otter',
    name: 'Otter.ai',
    url: 'https://otter.ai/',
    category: 'Communication',
    description: 'AI-powered meeting transcription and note-taking.',
    rating: 4.5,
    pricing: 'Freemium',
    time: '5 min',
    tags: ['Beginner', 'Meeting notes', 'Transcription'],
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=60',
    verified: true,
  },
  {
    id: 'runway-ml',
    name: 'Runway ML',
    url: 'https://runwayml.com/',
    category: 'Photo & Video',
    description: 'AI video editing and generation for creators.',
    rating: 4.4,
    pricing: 'Freemium',
    time: '60 min',
    tags: ['Advanced', 'Video AI', 'Creative'],
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1200&q=60',
    verified: false,
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    url: 'https://www.grammarly.com/',
    category: 'Writing & Editing',
    description: 'AI writing assistant for grammar and style improvements.',
    rating: 4.9,
    pricing: 'Freemium',
    time: '5 min',
    tags: ['Beginner', 'Grammar', 'Writing'],
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=60',
    verified: true,
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    url: 'https://www.notion.com/product/ai',
    category: 'Productivity',
    description: 'Draft notes, summarize pages, and automate docs in your workspace.',
    rating: 4.6,
    pricing: 'Freemium',
    time: '12 min',
    tags: ['Productivity', 'Notes', 'Automation'],
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=60',
    verified: true,
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    url: 'https://www.midjourney.com/',
    category: 'Creative & Design',
    description: 'High-quality image generation for concept art and design iteration.',
    rating: 4.7,
    pricing: 'Paid',
    time: '20 min',
    tags: ['Creative', 'Image Generation', 'Advanced'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60',
    verified: true,
  },
];

const LEARNING_PATHS = [
  {
    id: 'ai-writing-mastery',
    title: 'AI Writing Mastery',
    level: 'Beginner',
    description: 'Master AI tools for content creation, editing, and collaboration',
    next: 'Advanced Prompting Techniques',
    duration: '2-3 weeks',
    modules: [
      {
        id: 'prompt-fundamentals',
        title: 'Prompt Engineering Fundamentals',
        type: 'YouTube',
        url: 'https://www.youtube.com/watch?v=dOxUroR57xs',
      },
      {
        id: 'openai-prompt-guide',
        title: 'OpenAI Prompting Guide',
        type: 'Documentation',
        url: 'https://platform.openai.com/docs/guides/prompt-engineering',
      },
      {
        id: 'grammarly-style-guide',
        title: 'Grammarly Writing Style Guide',
        type: 'Blog',
        url: 'https://www.grammarly.com/blog/category/handbook/',
      },
    ],
    learners: '1,250',
    skills: ['ChatGPT', 'Claude AI', 'Grammarly AI', 'Notion AI'],
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=60',
  },
  {
    id: 'data-analysis-ai',
    title: 'Data Analysis with AI',
    level: 'Intermediate',
    description: 'Learn to analyze and visualize data using AI-powered tools',
    next: 'Predictive Analytics Basics',
    duration: '4-5 weeks',
    modules: [
      {
        id: 'tableau-ai-overview',
        title: 'Tableau AI Overview',
        type: 'Documentation',
        url: 'https://www.tableau.com/products/tableau-ai',
      },
      {
        id: 'python-data-analysis',
        title: 'Data Analysis with Python',
        type: 'YouTube',
        url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
      },
      {
        id: 'powerbi-guide',
        title: 'Power BI Learning Resources',
        type: 'Documentation',
        url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi/',
      },
    ],
    learners: '890',
    skills: ['Excel AI', 'Tableau AI', 'Python', 'Power BI'],
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1400&q=60',
  },
  {
    id: 'creative-ai-tools',
    title: 'Creative AI Tools',
    level: 'Beginner',
    description: 'Explore AI tools for design, art, and creative projects',
    next: 'Image Generation Fundamentals',
    duration: '3-4 weeks',
    modules: [
      {
        id: 'canva-magic-studio',
        title: 'Canva Magic Studio Basics',
        type: 'Documentation',
        url: 'https://www.canva.com/magic-studio/',
      },
      {
        id: 'midjourney-starter',
        title: 'Midjourney Beginner Guide',
        type: 'Blog',
        url: 'https://docs.midjourney.com/docs/quick-start',
      },
      {
        id: 'runway-video',
        title: 'Runway Creative Video Tutorial',
        type: 'YouTube',
        url: 'https://www.youtube.com/watch?v=VJ4wQ9fVKfE',
      },
    ],
    learners: '2,100',
    skills: ['DALL-E', 'Midjourney', 'Canva AI', 'Runway ML'],
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=60',
  },
  {
    id: 'ai-productivity-bootcamp',
    title: 'AI Productivity Bootcamp',
    level: 'Beginner',
    description: 'Automate workflows and boost productivity with AI assistants',
    next: 'AI Workflow Fundamentals',
    duration: '2 weeks',
    modules: [
      {
        id: 'notion-ai-workflows',
        title: 'Build Workflows with Notion AI',
        type: 'Documentation',
        url: 'https://www.notion.com/help/guides/category/ai',
      },
      {
        id: 'otter-productivity',
        title: 'Meeting Notes Automation with Otter',
        type: 'Blog',
        url: 'https://otter.ai/blog',
      },
      {
        id: 'zapier-ai-automation',
        title: 'Zapier AI Automation Guide',
        type: 'Documentation',
        url: 'https://zapier.com/blog/ai/',
      },
    ],
    learners: '1,680',
    skills: ['Zapier', 'Notion AI', 'Otter.ai', 'Calendly AI'],
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=60',
  },
];

function filterTools({ search = '', category = 'All Tools', pricing = [], verified, skillLevel }) {
  const normalized = search.trim().toLowerCase();

  return TOOL_CATALOG.filter((tool) => {
    const matchesSearch =
      !normalized ||
      tool.name.toLowerCase().includes(normalized) ||
      tool.description.toLowerCase().includes(normalized) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(normalized));

    const matchesCategory = category === 'All Tools' || tool.category === category;
    const matchesPricing = pricing.length === 0 || pricing.includes(tool.pricing);
    const matchesVerified = typeof verified !== 'boolean' || tool.verified === verified;

    const matchesSkill =
      !skillLevel ||
      skillLevel === 'Any level' ||
      tool.tags.some((tag) => tag.toLowerCase().includes(skillLevel.toLowerCase()));

    return matchesSearch && matchesCategory && matchesPricing && matchesVerified && matchesSkill;
  });
}

function recommendToolsForProfile({ primaryUseCase = 'general', query = '' }) {
  const preferenceMap = {
    coding: ['Data Analysis', 'Productivity'],
    writing: ['Writing & Editing', 'Communication'],
    research: ['Research & Learning', 'Data Analysis'],
    image_generation: ['Creative & Design', 'Photo & Video'],
    general: ['Productivity', 'Writing & Editing'],
  };

  const preferredCategories = preferenceMap[primaryUseCase] || preferenceMap.general;
  const filtered = filterTools({ search: query });

  return filtered
    .sort((a, b) => {
      const aPreferred = preferredCategories.includes(a.category) ? 1 : 0;
      const bPreferred = preferredCategories.includes(b.category) ? 1 : 0;
      if (aPreferred !== bPreferred) {
        return bPreferred - aPreferred;
      }
      return b.rating - a.rating;
    })
    .slice(0, 4);
}

function getToolById(id) {
  return TOOL_CATALOG.find((tool) => tool.id === id) || null;
}

function getToolByName(name) {
  const normalized = String(name || '').trim().toLowerCase();
  return TOOL_CATALOG.find((tool) => tool.name.toLowerCase() === normalized) || null;
}

function getStarterTools() {
  const names = ['ChatGPT', 'Grammarly', 'Canva AI'];
  return names
    .map((name) => getToolByName(name))
    .filter(Boolean)
    .map((tool) => ({
      ...tool,
      starterDescription:
        tool.name === 'ChatGPT'
          ? 'Great for coding, writing, and general tasks.'
          : tool.name === 'Grammarly'
            ? 'Improve writing quality and tone instantly.'
            : 'Create visuals and designs quickly.',
    }));
}

function chooseToolForIntent(intent) {
  const mapping = {
    coding: 'ChatGPT',
    writing: 'Grammarly',
    research: 'ChatGPT',
    image_generation: 'Canva AI',
    general: 'ChatGPT',
  };

  return getToolByName(mapping[intent] || 'ChatGPT') || TOOL_CATALOG[0];
}

function getLearningPathById(pathId) {
  return LEARNING_PATHS.find((item) => item.id === pathId) || null;
}

function getModuleFromPath(pathId, moduleId) {
  const path = getLearningPathById(pathId);
  if (!path) {
    return null;
  }

  return path.modules.find((module) => module.id === moduleId) || null;
}

module.exports = {
  TOOL_CATALOG,
  LEARNING_PATHS,
  filterTools,
  recommendToolsForProfile,
  getToolById,
  getToolByName,
  getStarterTools,
  chooseToolForIntent,
  getLearningPathById,
  getModuleFromPath,
};
