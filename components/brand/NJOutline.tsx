// Real New Jersey state outline (bounding box: x 994.8-1022.3, y 288.3-345.9
// in its original source coordinate space) -- traced from a public-domain
// US states map, not hand-drawn, so the silhouette is actually accurate:
// https://github.com/WebsiteBeaver/interactive-and-responsive-svg-map-of-us-states-capitals
export function NJOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="994.8 288.3 27.5 57.6"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M1002.2,290.3l-2.1,2.4v3.1l-1.9,3.1l-0.2,1.6l1.3,1.3l-0.2,2.4l-2.3,1.1l0.8,2.7l0.2,1.1l2.7,0.3l1,2.6l3.6,2.4l2.4,1.6v0.8l-3.2,3.1l-1.6,2.3l-1.5,2.7l-2.3,1.3l-1.2,0.7l-0.2,1.2l-0.6,2.6l1.1,2.2l3.2,2.9l4.8,2.3l4,0.6l0.2,1.5l-0.8,1l0.3,2.7h0.8l2.1-2.4l0.8-4.8l2.7-4l3.1-6.5l1.1-5.5l-0.6-1.1l-0.2-9.4l-1.6-3.4l-1.1,0.8l-2.7,0.3l-0.5-0.5l1.1-1l2.1-1.9l0.1-1.1l-0.4-3.4l0.5-2.7l-0.2-2.1l-2.6-1.1l-4.5-1l-3.9-1.1L1002.2,290.3z" />
    </svg>
  );
}
