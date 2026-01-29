import './TabsOverflow.css';
import { useEffect, useRef, useState } from 'react';
import type { Tab } from '../../types/tab';

type Props = {
  tabs: Tab[];
  onSelect: (tab: Tab) => void;
};

export function TabsOverflow({ tabs, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  return (
    <div className="overflow" ref={ref}>
      <button
        className={`overflow-btn ${open ? 'is-open' : ''}`}
        onClick={e => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <img
          src="/public/icons/expand_more_FILL0_wght400_GRAD0_opsz24 1.svg"
          alt="open"
        />
      </button>

      {open && (
        <div className="overflow-menu" role="menu">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className="overflow-item"
              role="menuitem"
              onClick={() => {
                onSelect(tab);
                setOpen(false);
              }}
            >
              <span className="overflow-item-title">
                {tab.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
