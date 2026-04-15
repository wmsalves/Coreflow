import type { LandingLocale } from "@/features/landing/types";

export type LandingCopy = {
  controls: {
    languages: {
      en: string;
      ptBR: string;
    };
    localeLabel: string;
    theme: {
      dark: string;
      label: string;
      light: string;
    };
  };
  finalCta: {
    body: string;
    eyebrow: string;
    primaryCta: string;
    secondaryCta: string;
    title: string;
  };
  header: {
    cta: string;
    nav: Array<{
      href: string;
      label: string;
    }>;
    signIn: string;
    tagline: string;
  };
  hero: {
    badge: string;
    ctaPrimary: string;
    ctaSecondary: string;
    headline: string;
    preview: {
      aligned: string;
      consistencyBody: string;
      consistencyLabel: string;
      consistencyPeriod: string;
      dailyFlow: string;
      dailyFlowCaption: string;
      metrics: Array<{
        detail: string;
        label: string;
        value: string;
      }>;
      rows: Array<{
        badge: string;
        detail: string;
        status: "done" | "live" | "next";
        title: string;
      }>;
      title: string;
      today: string;
    };
    principles: string[];
    subheadline: string;
  };
  pillars: {
    cards: Array<{
      description: string;
      key: "habits" | "focus" | "fitness";
      kicker: string;
      stat: string;
      value: string;
    }>;
    description: string;
    eyebrow: string;
    footerLabel: string;
    title: string;
  };
  pricing: {
    description: string;
    eyebrow: string;
    plans: Array<{
      cta: string;
      detail: string;
      features: string[];
      name: string;
      price: string;
    }>;
    title: string;
  };
  problem: {
    description: string;
    eyebrow: string;
    panels: Array<{
      body: string;
      title: string;
    }>;
    title: string;
  };
  showcase: {
    description: string;
    eyebrow: string;
    highlightCards: Array<{
      body: string;
      kicker: string;
      title: string;
    }>;
    stats: Array<{
      label: string;
      value: string;
    }>;
    summaryChips: Array<{
      label: string;
      value: string;
    }>;
    systemHealth: {
      rows: Array<{
        label: string;
        value: string;
        width: string;
      }>;
      title: string;
    };
    title: string;
    weeklySummary: string;
  };
  solution: {
    description: string;
    eyebrow: string;
    points: Array<{
      body: string;
      kicker: string;
      title: string;
    }>;
    title: string;
  };
  workflow: {
    description: string;
    eyebrow: string;
    highlights: Array<{
      body: string;
      kicker: string;
      title: string;
    }>;
    rows: Array<{
      body: string;
      step: string;
    }>;
    title: string;
    todayView: {
      label: string;
      stats: Array<{
        label: string;
        value: string;
      }>;
      title: string;
      unifiedRows: Array<{
        label: string;
        note: string;
        progress: string;
      }>;
    };
  };
};

export const landingCopy: Record<LandingLocale, LandingCopy> = {
  en: {
    controls: {
      languages: {
        en: "EN",
        ptBR: "PT",
      },
      localeLabel: "Language",
      theme: {
        dark: "Dark",
        label: "Theme",
        light: "Light",
      },
    },
    finalCta: {
      body: "Build a system that makes disciplined execution easier to see, easier to repeat, and harder to fragment.",
      eyebrow: "Final CTA",
      primaryCta: "Start with Coreflow",
      secondaryCta: "Sign in",
      title: "Bring your habits, focus, and training into one flow.",
    },
    header: {
      cta: "Start free",
      nav: [
        { href: "#problem", label: "Why Coreflow" },
        { href: "#pillars", label: "Pillars" },
        { href: "#daily-flow", label: "Daily flow" },
        { href: "#pricing", label: "Pricing" },
      ],
      signIn: "Sign in",
      tagline: "Personal operating system for self-improvement",
    },
    hero: {
      badge: "Personal operating system for self-improvement",
      ctaPrimary: "Build your system",
      ctaSecondary: "View product preview",
      headline: "One disciplined system for habits, focus, and training.",
      preview: {
        aligned: "82% aligned",
        consistencyBody:
          "One surface for habits, focus, and fitness removes friction from the day.",
        consistencyLabel: "Consistency score",
        consistencyPeriod: "Week 18",
        dailyFlow: "Daily flow",
        dailyFlowCaption: "Single workspace",
        metrics: [
          { detail: "7 of 9 completed", label: "Habits", value: "07" },
          { detail: "2h 40m deep work", label: "Focus", value: "160" },
          { detail: "Strength session logged", label: "Training", value: "01" },
        ],
        rows: [
          {
            badge: "Done",
            detail: "Morning reading and journal",
            status: "done",
            title: "Habit block",
          },
          {
            badge: "Live",
            detail: "90 min strategy sprint",
            status: "live",
            title: "Focus session",
          },
          {
            badge: "Next",
            detail: "Upper body workout at 18:00",
            status: "next",
            title: "Training plan",
          },
        ],
        title: "Execution dashboard",
        today: "Today",
      },
      principles: [
        "Consistency > intensity",
        "Clarity > complexity",
        "Systems > motivation",
      ],
      subheadline:
        "Coreflow gives you one place to run the day, one workflow for execution, and one source of truth for consistency.",
    },
    pillars: {
      cards: [
        {
          description:
            "Track the daily actions that matter, see streaks, and keep consistency visible.",
          key: "habits",
          kicker: "Habits",
          stat: "Streak clarity",
          value: "Daily actions",
        },
        {
          description:
            "Run focused sessions, track deep work time, and measure effort without extra tools.",
          key: "focus",
          kicker: "Focus",
          stat: "Measured effort",
          value: "Session blocks",
        },
        {
          description:
            "Manage workouts, log training, and keep physical momentum inside the same system.",
          key: "fitness",
          kicker: "Fitness",
          stat: "Training momentum",
          value: "Workout logs",
        },
      ],
      description:
        "The product is built around the three systems that define daily execution.",
      eyebrow: "Product pillars",
      footerLabel: "Designed for",
      title: "Three pillars. One operating system.",
    },
    pricing: {
      description:
        "A simple model that makes the product feel legitimate without overcomplicating the decision.",
      eyebrow: "Pricing preview",
      plans: [
        {
          cta: "Start free",
          detail: "Core habits and a clean daily operating layer.",
          features: ["Habit tracking", "Basic focus history", "Workout logging foundation"],
          name: "Free",
          price: "$0",
        },
        {
          cta: "Upgrade to Pro",
          detail: "More depth, better analytics, and a stronger system.",
          features: ["Advanced insights", "Longer history", "Premium workflow controls"],
          name: "Pro",
          price: "$12",
        },
      ],
      title: "Start with clarity. Upgrade when the system becomes essential.",
    },
    problem: {
      description:
        "Most people trying to improve their lives are forced into separate tools for separate intentions.",
      eyebrow: "The problem",
      panels: [
        {
          body: "Habits in one app. Focus sessions in another. Workouts somewhere else. The day becomes operationally noisy.",
          title: "Three tools. Three contexts.",
        },
        {
          body: "The friction is small in isolation, but it compounds. Consistency slips when the system asks for too many switches.",
          title: "Small friction. Large cost.",
        },
      ],
      title: "Progress gets weaker when the system is fragmented.",
    },
    showcase: {
      description: "A product surface built to feel credible, quiet, and precise.",
      eyebrow: "Product showcase",
      highlightCards: [
        {
          body: "The interface is designed to feel like a serious product, not a motivational toy.",
          kicker: "Credible software",
          title: "Built for disciplined use",
        },
        {
          body: "Today, progress, and system health stay readable without ornamental noise.",
          kicker: "Clear hierarchy",
          title: "The important things surface first",
        },
        {
          body: "A calm interface, precise spacing, and subtle gradients where they earn their place.",
          kicker: "Premium restraint",
          title: "Confidence without excess",
        },
      ],
      stats: [
        { label: "Consistency", value: "86%" },
        { label: "Focus time", value: "11.4h" },
        { label: "Sessions closed", value: "17" },
      ],
      summaryChips: [
        { label: "Streak intact", value: "14 days" },
        { label: "Deep work", value: "4 sessions" },
        { label: "Training", value: "3 logs" },
      ],
      systemHealth: {
        rows: [
          { label: "Habits", value: "91%", width: "91%" },
          { label: "Focus", value: "78%", width: "78%" },
          { label: "Fitness", value: "72%", width: "72%" },
        ],
        title: "System health",
      },
      title: "A dashboard that treats self-improvement like a real operating system.",
      weeklySummary: "Weekly summary",
    },
    solution: {
      description:
        "Coreflow gives you one place to run your day, one structure for execution, and one record of whether the system is working.",
      eyebrow: "Solution",
      points: [
        {
          body: "Habits, focus blocks, and training live in one operating layer.",
          kicker: "One place",
          title: "See the day clearly",
        },
        {
          body: "Review the day, do the work, and close the loop without changing context.",
          kicker: "One workflow",
          title: "Move from intent to execution",
        },
        {
          body: "Progress is easier to trust when it is not scattered across disconnected histories.",
          kicker: "One source of truth",
          title: "Measure consistency honestly",
        },
      ],
      title:
        "One workflow across the parts of self-improvement that actually need to work together.",
    },
    workflow: {
      description:
        "Your day should feel like one system, not a collection of separate intentions.",
      eyebrow: "Daily flow",
      highlights: [
        {
          body: "The product removes operational friction before it becomes missed execution.",
          kicker: "Less fragmentation",
          title: "Fewer context switches",
        },
        {
          body: "Planning, doing, and reviewing live in one system instead of separate apps.",
          kicker: "More consistency",
          title: "A tighter daily loop",
        },
      ],
      rows: [
        {
          body: "Review what must happen across habits, focus, and training before the day fragments.",
          step: "Open one daily view",
        },
        {
          body: "Move from planned execution to completed work inside the same system, not across tabs.",
          step: "Run the work",
        },
        {
          body: "Close the day with a single record of consistency instead of disconnected history.",
          step: "See the score clearly",
        },
      ],
      title: "Coreflow is designed around execution, not scattered tracking.",
      todayView: {
        label: "Today view",
        stats: [
          { label: "Execution score", value: "82%" },
          { label: "Focus minutes", value: "160" },
          { label: "Training streak", value: "4d" },
        ],
        title: "One place to run the day",
        unifiedRows: [
          { label: "Habits", note: "Reading, hydration, mobility", progress: "75%" },
          { label: "Focus", note: "Strategy sprint in progress", progress: "68%" },
          { label: "Fitness", note: "Upper body planned for tonight", progress: "40%" },
        ],
      },
    },
  },
  "pt-BR": {
    controls: {
      languages: {
        en: "EN",
        ptBR: "PT",
      },
      localeLabel: "Idioma",
      theme: {
        dark: "Escuro",
        label: "Tema",
        light: "Claro",
      },
    },
    finalCta: {
      body: "Construa um sistema que torne a execução disciplinada mais visível, mais repetível e menos sujeita à fragmentação.",
      eyebrow: "CTA final",
      primaryCta: "Começar com Coreflow",
      secondaryCta: "Entrar",
      title: "Traga hábitos, foco e treino para um único fluxo.",
    },
    header: {
      cta: "Começar grátis",
      nav: [
        { href: "#problem", label: "Por que Coreflow" },
        { href: "#pillars", label: "Pilares" },
        { href: "#daily-flow", label: "Fluxo diário" },
        { href: "#pricing", label: "Planos" },
      ],
      signIn: "Entrar",
      tagline: "Sistema operacional pessoal para evolução consistente",
    },
    hero: {
      badge: "Sistema operacional pessoal para evolução consistente",
      ctaPrimary: "Construir meu sistema",
      ctaSecondary: "Ver visão do produto",
      headline: "Um sistema disciplinado para hábitos, foco e treino.",
      preview: {
        aligned: "82% alinhado",
        consistencyBody:
          "Uma única superfície para hábitos, foco e treino reduz o atrito do dia.",
        consistencyLabel: "Pontuação de consistência",
        consistencyPeriod: "Semana 18",
        dailyFlow: "Fluxo diário",
        dailyFlowCaption: "Espaço unificado",
        metrics: [
          { detail: "7 de 9 concluídos", label: "Hábitos", value: "07" },
          { detail: "2h40 de trabalho profundo", label: "Foco", value: "160" },
          { detail: "Treino de força registrado", label: "Treino", value: "01" },
        ],
        rows: [
          {
            badge: "Feito",
            detail: "Leitura matinal e journal",
            status: "done",
            title: "Bloco de hábito",
          },
          {
            badge: "Agora",
            detail: "Sprint estratégico de 90 min",
            status: "live",
            title: "Sessão de foco",
          },
          {
            badge: "Próximo",
            detail: "Treino de membros superiores às 18h",
            status: "next",
            title: "Plano de treino",
          },
        ],
        title: "Painel de execução",
        today: "Hoje",
      },
      principles: [
        "Consistência > intensidade",
        "Clareza > complexidade",
        "Sistemas > motivação",
      ],
      subheadline:
        "Coreflow dá a você um lugar para conduzir o dia, um fluxo para executar e uma fonte única de verdade para consistência.",
    },
    pillars: {
      cards: [
        {
          description:
            "Acompanhe as ações diárias que importam, veja sequências e mantenha a consistência visível.",
          key: "habits",
          kicker: "Hábitos",
          stat: "Clareza de sequência",
          value: "Ações diárias",
        },
        {
          description:
            "Execute sessões de foco, acompanhe tempo de trabalho profundo e meça esforço sem ferramentas extras.",
          key: "focus",
          kicker: "Foco",
          stat: "Esforço medido",
          value: "Blocos de sessão",
        },
        {
          description:
            "Gerencie treinos, registre execuções e mantenha o ritmo físico dentro do mesmo sistema.",
          key: "fitness",
          kicker: "Treino",
          stat: "Ritmo de treino",
          value: "Registros de treino",
        },
      ],
      description:
        "O produto foi construído em torno dos três sistemas que definem a execução diária.",
      eyebrow: "Pilares do produto",
      footerLabel: "Pensado para",
      title: "Três pilares. Um sistema operacional.",
    },
    pricing: {
      description:
        "Um modelo simples que transmite legitimidade ao produto sem complicar a decisão.",
      eyebrow: "Prévia de planos",
      plans: [
        {
          cta: "Começar grátis",
          detail: "Hábitos essenciais e uma camada diária de execução.",
          features: ["Rastreamento de hábitos", "Histórico básico de foco", "Base para registros de treino"],
          name: "Free",
          price: "$0",
        },
        {
          cta: "Ir para Pro",
          detail: "Mais profundidade, melhores análises e um sistema mais forte.",
          features: ["Insights avançados", "Histórico mais longo", "Controles premium de fluxo"],
          name: "Pro",
          price: "$12",
        },
      ],
      title: "Comece com clareza. Evolua quando o sistema se tornar essencial.",
    },
    problem: {
      description:
        "A maioria das pessoas que tenta evoluir precisa dividir intenções em ferramentas separadas.",
      eyebrow: "O problema",
      panels: [
        {
          body: "Hábitos em um app. Sessões de foco em outro. Treinos em outro lugar. O dia fica operacionalmente ruidoso.",
          title: "Três ferramentas. Três contextos.",
        },
        {
          body: "O atrito parece pequeno isoladamente, mas se acumula. A consistência cai quando o sistema exige trocas demais.",
          title: "Pequeno atrito. Custo alto.",
        },
      ],
      title: "O progresso enfraquece quando o sistema é fragmentado.",
    },
    showcase: {
      description: "Uma superfície de produto criada para parecer crível, silenciosa e precisa.",
      eyebrow: "Visão do produto",
      highlightCards: [
        {
          body: "A interface foi desenhada para parecer um produto sério, não um brinquedo motivacional.",
          kicker: "Software confiável",
          title: "Feito para uso disciplinado",
        },
        {
          body: "Hoje, progresso e saúde do sistema permanecem legíveis sem ruído ornamental.",
          kicker: "Hierarquia clara",
          title: "O que importa aparece primeiro",
        },
        {
          body: "Uma interface calma, espaçamento preciso e gradientes sutis apenas quando fazem sentido.",
          kicker: "Restrição premium",
          title: "Confiança sem excesso",
        },
      ],
      stats: [
        { label: "Consistência", value: "86%" },
        { label: "Tempo de foco", value: "11.4h" },
        { label: "Sessões concluídas", value: "17" },
      ],
      summaryChips: [
        { label: "Sequência ativa", value: "14 dias" },
        { label: "Trabalho profundo", value: "4 sessões" },
        { label: "Treino", value: "3 registros" },
      ],
      systemHealth: {
        rows: [
          { label: "Hábitos", value: "91%", width: "91%" },
          { label: "Foco", value: "78%", width: "78%" },
          { label: "Treino", value: "72%", width: "72%" },
        ],
        title: "Saúde do sistema",
      },
      title: "Um dashboard que trata evolução pessoal como um sistema operacional real.",
      weeklySummary: "Resumo semanal",
    },
    solution: {
      description:
        "Coreflow entrega um lugar para conduzir o dia, uma estrutura para executar e um registro claro de se o sistema está funcionando.",
      eyebrow: "Solução",
      points: [
        {
          body: "Hábitos, blocos de foco e treino vivem na mesma camada operacional.",
          kicker: "Um lugar",
          title: "Veja o dia com clareza",
        },
        {
          body: "Revise o dia, execute e feche o ciclo sem trocar de contexto.",
          kicker: "Um fluxo",
          title: "Saia da intenção para a execução",
        },
        {
          body: "É mais fácil confiar no progresso quando ele não está espalhado em históricos desconectados.",
          kicker: "Uma fonte de verdade",
          title: "Meça consistência com honestidade",
        },
      ],
      title:
        "Um fluxo único para as partes da evolução pessoal que realmente precisam funcionar juntas.",
    },
    workflow: {
      description:
        "Seu dia deve funcionar como um único sistema, não como uma coleção de intenções separadas.",
      eyebrow: "Fluxo diário",
      highlights: [
        {
          body: "O produto remove atrito operacional antes que ele vire execução perdida.",
          kicker: "Menos fragmentação",
          title: "Menos trocas de contexto",
        },
        {
          body: "Planejar, executar e revisar vivem no mesmo sistema em vez de apps separados.",
          kicker: "Mais consistência",
          title: "Um ciclo diário mais firme",
        },
      ],
      rows: [
        {
          body: "Veja o que precisa acontecer em hábitos, foco e treino antes que o dia se fragmente.",
          step: "Abra uma única visão diária",
        },
        {
          body: "Passe do planejamento para a execução dentro do mesmo sistema, não entre abas.",
          step: "Execute o trabalho",
        },
        {
          body: "Feche o dia com um único registro de consistência, e não com históricos separados.",
          step: "Veja a pontuação com clareza",
        },
      ],
      title: "Coreflow foi desenhado em torno da execução, não de rastreamento disperso.",
      todayView: {
        label: "Visão de hoje",
        stats: [
          { label: "Pontuação de execução", value: "82%" },
          { label: "Minutos de foco", value: "160" },
          { label: "Sequência de treino", value: "4d" },
        ],
        title: "Um lugar para conduzir o dia",
        unifiedRows: [
          { label: "Hábitos", note: "Leitura, hidratação, mobilidade", progress: "75%" },
          { label: "Foco", note: "Sprint estratégico em andamento", progress: "68%" },
          { label: "Treino", note: "Membros superiores para esta noite", progress: "40%" },
        ],
      },
    },
  },
};


