/**
 * The layered wave divider from the brand sheet — a solid crest with a lighter
 * swell behind it. Used wherever a colored band meets the page body.
 *
 * `flip` turns the wave upside down for a band that starts (rather than ends)
 * with the divider.
 */
export function Wave({
  className,
  fill = "white",
  swell,
  flip = false,
  height = 72,
}: {
  className?: string;
  /** Color of the section the wave transitions *into*. */
  fill?: string;
  /** Optional lighter crest behind the main wave. */
  swell?: string;
  flip?: boolean;
  height?: number;
}) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ lineHeight: 0, transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height }}
      >
        {swell && (
          <path
            fill={swell}
            d="M0 62c140 34 260 44 420 22 132-18 214-46 352-46 150 0 232 32 372 44 118 10 218 2 296-16v54H0z"
          />
        )}
        <path
          fill={fill}
          d="M0 84c150 26 268 30 430 8 138-19 216-44 350-44 146 0 236 30 372 42 116 10 210 4 288-12v42H0z"
        />
      </svg>
    </div>
  );
}
