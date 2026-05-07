/**
 * Global SVG filter defs. Mounted once in the root layout.
 *
 * `#torn-edge` produces a ripped-paper edge WITHOUT warping the image
 * inside. The trick:
 *   1. Make a solid-white "shape" the same alpha as the source.
 *   2. Distort that shape via fractal noise + feDisplacementMap.
 *   3. Composite the original SourceGraphic *inside* that distorted
 *      shape (operator="in"). Edges get torn; the image content is
 *      pixel-for-pixel unchanged.
 */
export function Filters() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', overflow: 'hidden' }}
      aria-hidden
      focusable="false"
    >
      <defs>
        <filter id="torn-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feFlood floodColor="white" result="white" />
          <feComposite in="white" in2="SourceGraphic" operator="in" result="shape" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="shape"
            in2="noise"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
            result="tornShape"
          />
          <feComposite in="SourceGraphic" in2="tornShape" operator="in" />
        </filter>

        <filter id="torn-edge-rough" x="-12%" y="-12%" width="124%" height="124%">
          <feFlood floodColor="white" result="white" />
          <feComposite in="white" in2="SourceGraphic" operator="in" result="shape" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.024"
            numOctaves="4"
            seed="13"
            result="noise"
          />
          <feDisplacementMap
            in="shape"
            in2="noise"
            scale="11"
            xChannelSelector="R"
            yChannelSelector="G"
            result="tornShape"
          />
          <feComposite in="SourceGraphic" in2="tornShape" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
