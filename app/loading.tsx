export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy-900">
      <span
        className="font-stencil uppercase leading-none"
        style={{
          fontSize: 40,
          backgroundImage: "linear-gradient(90deg, #d4a017 0%, #dc2626 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Snapdown
      </span>
    </div>
  );
}
