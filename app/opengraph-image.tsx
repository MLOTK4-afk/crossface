import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F172A",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: 2,
            color: "#D4A017",
            textTransform: "uppercase",
          }}
        >
          Snapdown
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 32,
            letterSpacing: 6,
            color: "#D8C89D",
            textTransform: "uppercase",
          }}
        >
          New Jersey&apos;s Home for Wrestling
        </div>
      </div>
    ),
    { ...size }
  );
}
