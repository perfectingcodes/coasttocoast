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
  // Retired. Wavy section dividers are the single most recognisable mark of
  // a template; sections now meet on a straight edge. The component and its
  // call sites stay so the change is one line to reverse.
  void className; void fill; void swell; void flip; void height;
  return null;
}
