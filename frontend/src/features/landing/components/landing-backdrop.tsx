import type { CSSProperties } from "react";
import type { LandingTheme } from "@/features/landing/types";

type LandingBackdropProps = {
  priority?: "compact" | "full";
  theme: LandingTheme;
};

export function LandingBackdrop({
  priority = "full",
  theme,
}: LandingBackdropProps) {
  const cursorLayer = {
    background:
      "radial-gradient(360px circle at var(--cursor-x, 50%) var(--cursor-y, 18%), var(--landing-cursor-light), transparent 64%)",
  } satisfies CSSProperties;
  const fullBackdrop = priority === "full";

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
          <div className="absolute left-[-12rem] top-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[rgba(94,108,255,0.08)] blur-[140px] sm:left-[-15rem] sm:top-[-7rem] sm:h-[36rem] sm:w-[36rem] sm:blur-[180px] lg:left-[-18rem] lg:top-[-8rem] lg:h-[44rem] lg:w-[44rem] lg:blur-[210px]" />
          <div className="absolute right-[-10rem] top-[-2rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(255,166,103,0.08)] blur-[130px] sm:right-[-14rem] sm:top-[-3rem] sm:h-[32rem] sm:w-[32rem] sm:blur-[170px] lg:right-[-18rem] lg:top-[-4rem] lg:h-[42rem] lg:w-[42rem] lg:blur-[220px]" />
          {fullBackdrop ? (
            <>
              <div className="absolute right-[8%] top-[18rem] hidden h-[30rem] w-[30rem] rounded-full bg-[rgba(255,219,196,0.07)] blur-[170px] lg:block" />
              <div className="absolute inset-x-0 top-[46rem] hidden h-[24rem] bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.022),transparent)] opacity-75 lg:block" />
            </>
          ) : null}
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(100,114,223,0.14),transparent_40%),radial-gradient(circle_at_84%_8%,rgba(239,174,126,0.11),transparent_24%),radial-gradient(circle_at_14%_12%,rgba(255,251,246,0.82),transparent_24%),radial-gradient(circle_at_72%_28%,rgba(249,216,190,0.14),transparent_19%)]" />
          <div className="absolute left-[-10rem] top-[-5rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(255,248,239,0.88)] blur-[90px] sm:left-[-12rem] sm:top-[-6rem] sm:h-[30rem] sm:w-[30rem] sm:blur-[120px] lg:left-[-14rem] lg:top-[-7rem] lg:h-[36rem] lg:w-[36rem] lg:blur-[140px]" />
          <div className="absolute right-[-8rem] top-[-2rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(243,179,132,0.1)] blur-[110px] sm:right-[-10rem] sm:top-[-3rem] sm:h-[28rem] sm:w-[28rem] sm:blur-[140px] lg:right-[-12rem] lg:h-[34rem] lg:w-[34rem] lg:blur-[180px]" />
          {fullBackdrop ? (
            <>
              <div className="absolute left-[10%] top-[16rem] hidden h-[24rem] w-[24rem] rounded-full bg-[rgba(255,235,219,0.24)] blur-[130px] lg:block" />
              <div className="absolute right-[8%] top-[18rem] hidden h-[22rem] w-[22rem] rounded-full bg-[rgba(122,136,232,0.08)] blur-[160px] lg:block" />
              <div className="absolute inset-x-0 top-[44rem] hidden h-[22rem] bg-[linear-gradient(180deg,transparent,rgba(255,250,244,0.54),transparent)] opacity-80 lg:block" />
            </>
          ) : null}
        </>
      )}
      {fullBackdrop ? (
        <div className="absolute inset-0 hidden lg:block" style={cursorLayer} />
      ) : null}
    </div>
  );
}
