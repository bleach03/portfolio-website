'use client';

import type { ViewMode } from './Stage';

interface Props {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: Props) {
  return (
    <div className="view-toggle" role="group" aria-label="display mode">
      <button
        type="button"
        className={`view-toggle-btn${mode === 'terminal' ? ' is-active' : ''}`}
        onClick={() => onChange('terminal')}
        aria-pressed={mode === 'terminal'}
      >
        terminal
      </button>
      <button
        type="button"
        className={`view-toggle-btn${mode === 'simple' ? ' is-active' : ''}`}
        onClick={() => onChange('simple')}
        aria-pressed={mode === 'simple'}
      >
        simple
      </button>
    </div>
  );
}
