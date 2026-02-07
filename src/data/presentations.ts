// 演示文稿数据结构

export interface Presentation {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage?: string;
  slideCount: number;
  tags?: string[];
}

export const presentations: Presentation[] = [
  {
    slug: 'rust-essentials',
    title: 'Rust 核心概念精讲',
    description:
      '从设计哲学到所有权系统，快速掌握 Rust 语言的核心设计理念与关键机制，涵盖零成本抽象、借用系统、无畏并发、智能指针等核心话题。',
    date: '2026-02-07',
    coverImage: '/images/presentations/rust-essentials/01.png',
    slideCount: 4,
    tags: ['Rust', '设计哲学', '所有权', '并发'],
  },
];

// 获取所有演示文稿
export function getAllPresentations(): Presentation[] {
  return [...presentations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// 获取指定演示文稿
export function getPresentation(slug: string): Presentation | undefined {
  return presentations.find((p) => p.slug === slug);
}
