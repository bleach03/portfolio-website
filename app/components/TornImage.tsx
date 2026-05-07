'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from 'react';

type Props = {
  src: string;
  alt?: string;
  rough?: boolean;
  rotate?: number;
  style?: CSSProperties;
  awake?: boolean;
};

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

/**
 * Module-level counter — every time a tile becomes active (wake / hover /
 * drag) it grabs the next number and stores it as its `--stack-order`,
 * which the CSS adds to the base z-index. Most recently touched tile
 * always renders above any previously touched tile, even after returning
 * to its resting state.
 */
let stackCounter = 0;

export function TornImage({
  src,
  alt = '',
  rough = false,
  rotate = 0,
  style,
  awake,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);

  // Drag state
  const [drag, setDrag] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Persistent stacking order — bumps to a fresh value on every activation
  const [stackOrder, setStackOrder] = useState(0);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    moved: boolean;
  } | null>(null);

  const focused = !!awake || hovered;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (focused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [focused]);

  // Bump stack order any time this tile becomes active. The counter is
  // module-level so all tiles share the same monotonically increasing
  // sequence — most-recent tile is always on top.
  useEffect(() => {
    if (awake || hovered || dragging) {
      stackCounter += 1;
      setStackOrder(stackCounter);
    }
  }, [awake, hovered, dragging]);

  // ── Drag handlers ──
  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseX: drag.x,
      baseY: drag.y,
      moved: false,
    };
    setDragging(true);
  };

  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 3) return; // ignore micro-jitter
    d.moved = true;
    setDrag({ x: d.baseX + dx, y: d.baseY + dy });
  };

  const endDrag = (e: RPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = null;
    setDragging(false);
  };

  const cls = [
    'scrap-tile',
    awake ? 'is-awake' : '',
    dragging ? 'is-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inlineStyle: CSSProperties = {
    ['--rot' as string]: `${rotate}deg`,
    ['--dx' as string]: `${drag.x}px`,
    ['--dy' as string]: `${drag.y}px`,
    ['--stack-order' as string]: stackOrder,
    ...style,
  };

  return (
    <div
      className={cls}
      style={inlineStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="scrap-frame"
        style={{
          // SVG mask + drop-shadow chained: image content is unchanged,
          // edges are ragged, shadow follows the ragged silhouette.
          filter: `${rough ? 'url(#torn-edge-rough)' : 'url(#torn-edge)'} drop-shadow(0 12px 28px rgba(0, 0, 0, 0.55)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45))`,
        }}
      >
        {isVideo(src) ? (
          <video
            ref={videoRef}
            src={src}
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={alt}
          />
        ) : (
          <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} />
        )}
      </div>
    </div>
  );
}
