import type { CSSProperties } from "react";
import type { LandingTheme } from "@/features/landing/types";

export function LandingBackdrop({ theme }: { theme: LandingTheme }) {
  const cursorLayer = {
    background:
      "radial-gradient(360px circle at var(--cursor-x, 50%) var(--cursor-y, 18%), rgba(255,168,104,0.05), transparent 62%)",
  } satisfies CSSProperties;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.022),transparent_18%,transparent_74%,rgba(255,255,255,0.015))]" />
      {theme === "dark" ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-18%,rgba(112,120,255,0.16),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(255,170,112,0.12),transparent_26%),radial-gradient(circle_at_18%_18%,rgba(92,108,255,0.11),transparent_28%),radial-gradient(circle_at_68%_28%,rgba(255,208,180,0.06),transparent_18%)]" />
          <div className="absolute left-[-18rem] top-[-8rem] h-[44rem] w-[44rem] rounded-full bg-[rgba(94,108,255,0.09)] blur-[210px]" />
          <div className="absolute right-[-18rem] top-[-4rem] h-[42rem] w-[42rem] rounded-full bg-[rgba(255,166,103,0.09)] blur-[220px]" />
          <div className="absolute right-[8%] top-[18rem] h-[30rem] w-[30rem] rounded-full bg-[rgba(255,219,196,0.07)] blur-[170px]" />
          <div className="absolute inset-x-0 top-[46rem] h-[24rem] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.022),transparent)] opacity-75" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-16%,rgba(88,108,255,0.15),transparent_38%),radial-gradient(circle_at_82%_10%,rgba(244,169,120,0.14),transparent_24%),radial-gradient(circle_at_16%_16%,rgba(88,108,255,0.09),transparent_24%),radial-gradient(circle_at_70%_28%,rgba(255,223,201,0.18),transparent_18%)]" />
          <div className="absolute left-[-16rem] top-[-6rem] h-[40rem] w-[40rem] rounded-full bg-[rgba(255,255,255,0.84)] blur-[135px]" />
          <div className="absolute right-[-14rem] top-[-2rem] h-[36rem] w-[36rem] rounded-full bg-[rgba(245,168,120,0.13)] blur-[170px]" />
          <div className="absolute right-[10%] top-[18rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(118,136,255,0.1)] blur-[150px]" />
          <div className="absolute inset-x-0 top-[46rem] h-[22rem] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.44),transparent)] opacity-50" />
        </>
      )}
      <div className="absolute inset-0 hidden md:block" style={cursorLayer} />
    </div>
  );
}
