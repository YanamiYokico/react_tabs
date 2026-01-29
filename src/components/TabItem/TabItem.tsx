import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TabItem.css';
import type { Tab } from '../../types/tab';

type Props = {
  tab: Tab;
  active: boolean;
  onClick: () => void;
  onTogglePin: () => void;
  setRef: (el: HTMLDivElement | null) => void;
};

export function TabItem({
  tab,
  active,
  onClick,
  onTogglePin,
  setRef,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tab.id,
    disabled: tab.pinned,
  });

  return (
    <div
      ref={el => {
        setNodeRef(el);
        setRef(el);
      }}
      className={`tab
        ${active ? 'active' : ''}
        ${tab.pinned ? 'pinned' : ''}
        ${isDragging ? 'dragging' : ''}
      `}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        pointerEvents: isDragging ? 'none' : 'auto',
      }}
      onClick={onClick}
    >
      {!tab.pinned && (
        <span
          className="drag-handle"
          {...attributes}
          {...listeners}
          onClick={e => e.stopPropagation()}
        >
          ⋮⋮
        </span>
      )}

      <span className="tab-title">{tab.title}</span>

      <button
        className="pin-btn"
        title={tab.pinned ? 'Unpin tab' : 'Pin tab'}
        onClick={e => {
          e.stopPropagation();
          onTogglePin();
        }}
      >
        {tab.pinned ? '📌' : '📍'}
      </button>
    </div>
  );
}
