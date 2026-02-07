// 知识库数据结构 - 可扩展的主题与文章管理

export interface Article {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
  updated?: string;
  readingTime?: string;
  image?: string;          // 文章封面图（相对于 public 目录的路径）
}

export interface Topic {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  heroImage?: string;      // 主题 Hero 背景图（相对于 public 目录的路径）
  articles: Article[];
}

export const topics: Topic[] = [
  {
    slug: 'rust',
    name: 'Rust',
    description: 'Rust 语言核心概念、所有权系统、并发编程、生态工具等',
    icon: '🦀',
    color: '#dea584',
    heroImage: '/images/topics/rust-hero.png',
    articles: [
      {
        slug: 'design-philosophy',
        title: 'Rust 设计哲学：安全、并发与零成本抽象',
        summary: '深入剖析 Rust 语言的六大设计哲学：零成本抽象、所有权系统、无畏并发、显式优于隐式、编译期保证和实用主义，理解 Rust 为何能在安全性和性能之间取得完美平衡。',
        tags: ['Rust', '设计哲学', '所有权', '并发', '类型系统'],
        date: '2026-02-07',
        readingTime: '10 分钟',
        image: '/images/articles/rust-design-philosophy.png',
      },
      {
        slug: 'ownership-system',
        title: 'Rust 所有权系统深度解析：从设计原理到最佳实践',
        summary: '全方位深入剖析 Rust 所有权系统的设计哲学与内部机制，涵盖所有权规则、借用系统、生命周期、智能指针、内部可变性等核心概念，结合 Mermaid 图表与实战场景详解最佳实践。',
        tags: ['Rust', '所有权', '借用', '生命周期', '智能指针', '内存安全'],
        date: '2026-02-07',
        readingTime: '25 分钟',
        image: '/images/articles/rust-ownership-system.png',
      },
    ],
  },
  {
    slug: 'multimodal-agent',
    name: '多模态Agent',
    description: '多模态AI Agent架构、工具调用、视觉推理、编排框架等',
    icon: '🤖',
    color: '#8b5cf6',
    heroImage: '/images/topics/multimodal-agent-hero.png',
    articles: [],
  },
  {
    slug: 'python',
    name: 'Python',
    description: 'Python 高级特性、异步编程、数据科学、Web开发等',
    icon: '🐍',
    color: '#3572A5',
    heroImage: '/images/topics/python-hero.png',
    articles: [],
  },
];

// 获取指定主题
export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

// 获取所有主题摘要
export function getTopicsSummary() {
  return topics.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    icon: t.icon,
    color: t.color,
    heroImage: t.heroImage,
    articleCount: t.articles.length,
  }));
}

// 获取所有文章（跨主题），按日期降序
export function getAllArticles() {
  return topics
    .flatMap((t) =>
      t.articles.map((a) => ({
        ...a,
        topicSlug: t.slug,
        topicName: t.name,
        topicIcon: t.icon,
        topicColor: t.color,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 获取主题 Hero 图片映射
export function getTopicHeroImages(): Record<string, string> {
  const map: Record<string, string> = {};
  topics.forEach((t) => {
    if (t.heroImage) map[t.slug] = t.heroImage;
  });
  return map;
}

// 获取所有标签
export function getAllTags(): string[] {
  const tags = new Set<string>();
  topics.forEach((t) => t.articles.forEach((a) => a.tags.forEach((tag) => tags.add(tag))));
  return Array.from(tags).sort();
}

// 统计信息
export function getStats() {
  const totalArticles = topics.reduce((sum, t) => sum + t.articles.length, 0);
  const totalTags = getAllTags().length;
  return {
    topicCount: topics.length,
    articleCount: totalArticles,
    tagCount: totalTags,
  };
}
