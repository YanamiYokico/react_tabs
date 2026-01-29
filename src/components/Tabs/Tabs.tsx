import './Tabs.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import type { Tab } from '../../types/tab';
import { TabItem } from '../TabItem/TabItem';
import { TabsOverflow } from '../TabsOverflow/TabsOverflow';
import { useTabsOverflow } from '../../hooks/useTabsOverflow';

const STORAGE_KEY = 'tabs-state';

const INITIAL_TABS: Tab[] = [
  { id: '1', title: 'Dashboard', url: '/', pinned: true },
  { id: '2', title: 'Banking', url: '/banking', pinned: false },
  { id: '3', title: 'Telefonie', url: '/telefonie', pinned: false },
  { id: '4', title: 'Accounting', url: '/accounting', pinned: false },
  { id: '5', title: 'Post Office', url: '/post-office', pinned: false },
  { id: '6', title: 'Administration', url: '/admin', pinned: false },
];

export function Tabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TABS;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  const { containerRef, tabRefs, visible, hidden } =
    useTabsOverflow(tabs, !isDragging);

  const pinnedTabs = visible.filter(t => t.pinned);
  const draggableTabs = visible.filter(t => !t.pinned);

  function setTabRef(id: string, el: HTMLDivElement | null) {
    if (el) tabRefs.current.set(id, el);
  }

  function onDragEnd(event: DragEndEvent) {
    if (!event.over) return;

    const active = event.active.id as string;
    const over = event.over.id as string;

    if (active === over) return;

    setTabs(prev => {
      const oldIndex = prev.findIndex(t => t.id === active);
      const newIndex = prev.findIndex(t => t.id === over);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function togglePin(id: string) {
    setTabs(prev =>
      prev.map(t =>
        t.id === id ? { ...t, pinned: !t.pinned } : t
      )
    );
  }

  const dragTab = activeDragId
    ? tabs.find(t => t.id === activeDragId)
    : null;

  return (
    <>
      <div className="tabs-root" ref={containerRef}>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={e => {
            setIsDragging(true);
            setActiveDragId(e.active.id as string);
          }}
          onDragEnd={e => {
            setIsDragging(false);
            setActiveDragId(null);
            onDragEnd(e);
          }}
          onDragCancel={() => {
            setIsDragging(false);
            setActiveDragId(null);
          }}
        >
          <div className="tabs-row">
            {pinnedTabs.map(tab => (
              <TabItem
                key={tab.id}
                tab={tab}
                active={location.pathname === tab.url}
                onClick={() => navigate(tab.url)}
                onTogglePin={() => togglePin(tab.id)}
                setRef={el => setTabRef(tab.id, el)}
              />
            ))}

            <SortableContext
              items={draggableTabs.map(t => t.id)}
              strategy={horizontalListSortingStrategy}
            >
              {draggableTabs.map(tab => (
                <TabItem
                  key={tab.id}
                  tab={tab}
                  active={location.pathname === tab.url}
                  onClick={() => navigate(tab.url)}
                  onTogglePin={() => togglePin(tab.id)}
                  setRef={el => setTabRef(tab.id, el)}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay dropAnimation={null}>
            {dragTab ? (
              <div className="tab tab--overlay">
                {dragTab.title}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {hidden.length > 0 && (
          <TabsOverflow
            tabs={hidden}
            onSelect={t => navigate(t.url)}
          />
        )}
      </div>

      <Outlet />
    </>
  );
}
