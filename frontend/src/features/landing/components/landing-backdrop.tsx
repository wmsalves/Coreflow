import type { CSSProperties } from "react";
import type { LandingTheme } from "@/features/landing/types";

export function LandingBackdrop({ theme }: { theme: LandingTheme }) {
  const cursorLayer = {
    background:
      "radial-gradient(360px circle at var(--cursor-x, 50%) var(--cursor-y, 18%), var(--landing-cursor-light), transparent 64%)",
  } satisfies CSSProperties;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className={
          theme === "dark"
            ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.022),transparent_18%,transparent_74%,rgba(255,255,255,0.015))]"
            : "absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08)_22%,transparent_68%,rgba(255,248,239,0.38))]"
        }
      />
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(100,114,223,0.14),transparent_40%),radial-gradient(circle_at_84%_8%,rgba(239,174,126,0.11),transparent_24%),radial-gradient(circle_at_14%_12%,rgba(255,251,246,0.82),transparent_24%),radial-gradient(circle_at_72%_28%,rgba(249,216,190,0.14),transparent_19%)]" />
          <div className="absolute left-[-14rem] top-[-7rem] h-[36rem] w-[36rem] rounded-full bg-[rgba(255,248,239,0.9)] blur-[140px]" />
          <div className="absolute right-[-12rem] top-[-3rem] h-[34rem] w-[34rem] rounded-full bg-[rgba(243,179,132,0.12)] blur-[180px]" />
          <div className="absolute left-[10%] top-[16rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(255,235,219,0.24)] blur-[130px]" />
          <div className="absolute right-[8%] top-[18rem] h-[22rem] w-[22rem] rounded-full bg-[rgba(122,136,232,0.08)] blur-[160px]" />
          <div className="absolute inset-x-0 top-[44rem] h-[22rem] bg-[linear-gradient(180deg,transparent,rgba(255,250,244,0.54),transparent)] opacity-80" />
        </>
      )}
      <div className="absolute inset-0 hidden md:block" style={cursorLayer} />
    </div>
  );
}
