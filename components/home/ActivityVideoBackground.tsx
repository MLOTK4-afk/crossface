"use client";

import { useEffect, useRef } from "react";

/**
 * React's `muted` JSX prop doesn't reliably set the video element's `muted`
 * property before the browser evaluates its autoplay policy (a known React
 * gotcha), which silently blocks autoplay and leaves the poster frame
 * frozen with no visible error. Setting it imperatively via ref, then
 * calling play() ourselves, avoids the race.
 */
export function ActivityVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Autoplay can still be blocked by the browser (e.g. data saver);
      // the poster image remains as a reasonable static fallback.
    });
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      poster="/video/rugby-montage-bg-poster.jpg"
    >
      <source src="/video/rugby-montage-bg.mp4" type="video/mp4" />
    </video>
  );
}
