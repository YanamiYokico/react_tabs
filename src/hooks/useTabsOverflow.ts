import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Tab } from '../types/tab';

const OVERFLOW_BUTTON_WIDTH = 48;

export function useTabsOverflow(tabs: Tab[], enabled = true) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [visible, setVisible] = useState<Tab[]>(tabs);
  const [hidden, setHidden] = useState<Tab[]>([]);

  const frozenRef = useRef(false);

  useEffect(() => {
    frozenRef.current = !enabled;
  }, [enabled]);

  useLayoutEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const row = container.querySelector('.tabs-row') as HTMLDivElement;
    if (!row) return;

    const recalc = () => {
      if (frozenRef.current) return;

      const containerWidth = row.clientWidth;

      const pinned = tabs.filter(t => t.pinned);
      const normal = tabs.filter(t => !t.pinned);

      let usedWidth = 0;
      let pinnedWidth = 0;

      for (const tab of pinned) {
        const el = tabRefs.current.get(tab.id);
        if (el) pinnedWidth += el.offsetWidth;
      }

      let available = containerWidth - pinnedWidth;
      if (available <= 0) {
        setVisible(pinned);
        setHidden(normal);
        return;
      }

      const visibleNormal: Tab[] = [];
      const hiddenNormal: Tab[] = [];

      for (const tab of normal) {
        const el = tabRefs.current.get(tab.id);
        if (!el) continue;

        const w = el.offsetWidth;

        if (usedWidth + w <= available) {
          usedWidth += w;
          visibleNormal.push(tab);
        } else {
          hiddenNormal.push(tab);
        }
      }

      if (hiddenNormal.length > 0) {
        available -= OVERFLOW_BUTTON_WIDTH;
        usedWidth = 0;
        visibleNormal.length = 0;
        hiddenNormal.length = 0;

        for (const tab of normal) {
          const el = tabRefs.current.get(tab.id);
          if (!el) continue;

          const w = el.offsetWidth;

          if (usedWidth + w <= available) {
            usedWidth += w;
            visibleNormal.push(tab);
          } else {
            hiddenNormal.push(tab);
          }
        }
      }

      setVisible([...pinned, ...visibleNormal]);
      setHidden(hiddenNormal);
    };

    const ro = new ResizeObserver(recalc);
    ro.observe(container);
    recalc();

    return () => ro.disconnect();
  }, [tabs, enabled]);

  return {
    containerRef,
    tabRefs,
    visible,
    hidden,
  };
}
