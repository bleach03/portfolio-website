'use client';

import type { ComponentPropsWithoutRef } from 'react';

/** Mac-style draggable title bar shared by the terminal and simple views. */
export function WindowBar({
  path,
  handleProps,
}: {
  path: string;
  handleProps: ComponentPropsWithoutRef<'div'>;
}) {
  return (
    <div className="terminal-bar" aria-hidden {...handleProps}>
      <span className="dots">
        <i />
        <i />
        <i />
      </span>
      <span className="path">{path}</span>
    </div>
  );
}
