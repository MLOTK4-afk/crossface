import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy-900">
      <Image
        src="/logos/crossface-logo.png"
        alt="Crossface"
        width={140}
        height={140}
        priority
      />
    </div>
  );
}
