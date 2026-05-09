type Props = {
  size?: number;
  color?: string;
  accent?: string;
  /** Show 01–05 labels around the blades. */
  labels?: boolean;
  /** Index 0–4 mapping clockwise from the top edge: BRIEF, MOOD, STORY, SCENE, RENDER. */
  activeBlade?: number;
  /** Thin outline ribbons (line) or filled blades (solid). */
  variant?: "line" | "solid";
  /** Hide the housing ring (compact inline lockup mark). */
  hideRing?: boolean;
  className?: string;
};

const STAGE_LABELS = ["BRIEF", "MOOD", "STORY", "SCENE", "RENDER"];
const VIEW = 90;
const HOUSING_R = 32;
const PENT_R = 13;

function polar(r: number, deg: number) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}

/**
 * Construction:
 *   1. Right-side-up pentagon (vertex 0 at top), inscribed at PENT_R.
 *      The pentagon IS the iris opening.
 *   2. Each of its 5 EDGES anchors one blade. Edge i runs from pent[i] to pent[i+1].
 *   3. The blade swings from the leading vertex (pent[i+1]) outward to the housing,
 *      arcs along the housing, and curves back inward via a swirl edge — landing
 *      on the trailing pentagon vertex (pent[i]).
 *   4. Drawn 5× rotated, the blades overlap one-by-one, creating the photographic
 *      "stop-down" iris pattern — pentagonal opening at center.
 *
 * Blade clockwise mapping (label order, starting from the upper-right edge):
 *   0 BRIEF · 1 MOOD · 2 STORY · 3 SCENE · 4 RENDER
 */
function bladePath(activeOffset = 0) {
  // Trailing inner anchor (this blade's "back" corner — top vertex of pentagon)
  const innerTrail = { x: 0, y: -PENT_R - activeOffset };
  // Leading inner anchor (the pentagon vertex 72° clockwise — covered by next blade)
  const innerLead = polar(PENT_R, 72);
  // Housing tangent points — the blade pivots between these two pins
  const housingTrail = polar(HOUSING_R, 18);   // ~18° past the trailing anchor
  const housingLead  = polar(HOUSING_R, 60);   // ~12° before the leading anchor
  // Swirl control point — pulled toward the leading side, mid-radius. Creates the curve.
  const swirlCtrl = polar(HOUSING_R * 0.55, 50);

  return [
    // Trailing-inner-anchor (top of pentagon)
    `M ${innerTrail.x.toFixed(2)} ${innerTrail.y.toFixed(2)}`,
    // Out along the trailing blade edge to the housing pivot
    `L ${housingTrail.x.toFixed(2)} ${housingTrail.y.toFixed(2)}`,
    // Housing arc to the leading pivot
    `A ${HOUSING_R} ${HOUSING_R} 0 0 1 ${housingLead.x.toFixed(2)} ${housingLead.y.toFixed(2)}`,
    // The photographic swirl — quadratic curve back to leading inner anchor
    `Q ${swirlCtrl.x.toFixed(2)} ${swirlCtrl.y.toFixed(2)}, ${innerLead.x.toFixed(2)} ${innerLead.y.toFixed(2)}`,
    `Z`
  ].join(" ");
}

export function ApertureMark({
  size = 24,
  color = "currentColor",
  accent = "#e61919",
  labels = false,
  activeBlade,
  variant = "line",
  hideRing = false,
  className
}: Props) {
  const blades = [];
  for (let i = 0; i < 5; i++) {
    const rotation = i * 72;
    const isActive = activeBlade === i;
    const d = bladePath(isActive ? 1.6 : 0);

    blades.push(
      <path
        key={i}
        d={d}
        transform={`rotate(${rotation})`}
        fill={variant === "solid" ? (isActive ? accent : color) : "none"}
        fillOpacity={variant === "solid" ? (isActive ? 1 : 0.96) : 0}
        stroke={isActive ? accent : color}
        strokeOpacity={variant === "solid" ? 0.7 : isActive ? 1 : 0.92}
        strokeWidth={variant === "solid" ? 0.5 : isActive ? 1.6 : 1.1}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    );
  }

  // Pentagon outline drawn on top — anchors the eye to the construction logic.
  const pent = Array.from({ length: 5 }, (_, i) => polar(PENT_R, i * 72));
  const pentPath = pent.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ") + " Z";

  const labelEls = labels ? STAGE_LABELS.map((label, i) => {
    // Label sits at the midpoint angle of each blade's housing arc
    const pos = polar(HOUSING_R + 8, 36 + i * 72);
    return (
      <text
        key={label}
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={4.4}
        fontFamily="var(--font-geist-mono), monospace"
        fill={color}
        opacity={activeBlade === i ? 1 : 0.5}
        style={{ letterSpacing: "0.16em" }}
      >
        {`0${i + 1} ${label}`}
      </text>
    );
  }) : null;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`-${VIEW / 2} -${VIEW / 2} ${VIEW} ${VIEW}`}
      className={className}
      aria-hidden="true"
      role="img"
    >
      {!hideRing && (
        <circle cx={0} cy={0} r={HOUSING_R + 1} stroke={color} strokeWidth={0.8} fill="none" opacity={0.55} />
      )}
      <g>{blades}</g>
      {variant === "line" && (
        <path d={pentPath} stroke={color} strokeWidth={0.8} fill="none" strokeOpacity={0.55} strokeLinejoin="round" />
      )}
      {labelEls}
      <circle cx={0} cy={0} r={2.2} fill={accent} />
    </svg>
  );
}
