import { useEffect, useState, useRef } from 'react';

export function useInfiniteScroll<T>(items: T[], pageSize = 24) {
  const [count, setCount] = useState(pageSize);
  const sentinel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCount(pageSize);
  }, [items, pageSize]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + pageSize, items.length));
        }
      },
      { rootMargin: '600px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [items.length, pageSize]);

  return { visible: items.slice(0, count), sentinel, hasMore: count < items.length };
}
