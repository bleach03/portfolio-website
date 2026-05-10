'use client';

import { useRef, useState, type PointerEvent as RPointerEvent } from 'react';

export function useDraggable() {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  const onPointerDown = (e: RPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: pos.x,
      baseY: pos.y,
    };
    setDragging(true);
  };

  const onPointerMove = (e: RPointerEvent<HTMLElement>) => {
    if (!dragRef.current) return;
    const { startX, startY, baseX, baseY } = dragRef.current;
    setPos({
      x: baseX + (e.clientX - startX),
      y: baseY + (e.clientY - startY),
    });
  };

  const endDrag = (e: RPointerEvent<HTMLElement>) => {
    if (!dragRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    setDragging(false);
  };

  return {
    pos,
    dragging,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
