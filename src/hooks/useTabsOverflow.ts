import { useLayoutEffect, useRef, useState } from 'react';
import type { Tab } from '../types/tab';

const OVERFLOW_BUTTON_WIDTH = 48;

export function useTabsOverflow(tabs: Tab[]) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [visible, setVisible] = useState<Tab[]>(tabs);
  const [hidden, setHidden] = useState<Tab[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const recalc = () => {
      const containerWidth = container.offsetWidth;

      let used = 0;
      const v: Tab[] = [];
      const h: Tab[] = [];

      for (const tab of tabs) {
        const el = tabRefs.current.get(tab.id);
        if (!el) continue;

        const w = el.offsetWidth;

        if (used + w <= containerWidth) {
          used += w;
          v.push(tab);
        } else {
          h.push(tab);
        }
      }

      // если overflow нужен — резервируем кнопку
      if (h.length > 0) {
        used = 0;
        v.length = 0;
        h.length = 0;

        const available =
          containerWidth - OVERFLOW_BUTTON_WIDTH;

        for (const tab of tabs) {
          const el = tabRefs.current.get(tab.id);
          if (!el) continue;

          const w = el.offsetWidth;

          if (used + w <= available) {
            used += w;
            v.push(tab);
          } else {
            h.push(tab);
          }
        }
      }

      setVisible(v);
      setHidden(h);
    };

    const ro = new ResizeObserver(recalc);
    ro.observe(container);
    recalc();

    return () => ro.disconnect();
  }, [tabs]);

  return {
    containerRef,
    tabRefs,
    visible,
    hidden,
  };
}
