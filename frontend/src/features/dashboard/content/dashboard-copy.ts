export const dashboardCopy = {
  en: {
    common: {
      notSpecified: "Not specified",
      slashSeparator: " / ",
    },
    header: {
      navLabel: "Dashboard",
      nav: {
        overview: "Overview",
        focus: "Focus",
        habits: "Habits",
        fitness: "Fitness",
      },
      userMenu: {
        accountLabel: "Account",
        login: "Log in",
        signedInAs: "Signed in as",
        fallbackUser: "Coreflow user",
        signOut: "Sign out",
      },
    },
    dashboard: {
      badge: "Overview",
      title: "Keep your systems moving.",
      description:
        "Track the real activity already flowing through habits, focus sessions, and workout planning from one authenticated workspace.",
      manageHabits: "Manage habits",
      metrics: {
        habitsToday: {
          label: "Habits completed today",
          detail: "Daily completions are powered by habit log entries for the current day.",
        },
        completionRate: {
          label: "Daily completion rate",
          detail: "A quick signal for whether your day is keeping pace with your targets.",
        },
        longestStreak: {
          label: "Longest active streak",
          detail: "Computed from consecutive completion dates so streaks survive refreshes and deploys.",
        },
        modulesInProgress: {
          label: "Modules in progress",
          detail: "Counts modules with saved records for the signed-in user.",
        },
      },
      habitMomentum: {
        title: "Habit momentum",
        description: "The habits module is fully wired into the dashboard metrics.",
        emptyTitle: "No habits yet",
        emptyDescription:
          "Create your first habit to start generating daily progress and streak data.",
        emptyAction: "Create a habit",
        doneToday: "Done today",
        pending: "Pending",
        habitStats: (currentStreak: number, completionsThisWeek: number) =>
          `${currentStreak} day streak · ${completionsThisWeek} completions this week`,
      },
      nextModules: {
        title: "Continue flows",
        description:
          "Jump into the next authenticated workflow without leaving the dashboard.",
        studySessions: {
          title: "Study sessions",
          description:
            "Plan sessions, start focus work, and save completed duration history.",
        },
        workoutTracking: {
          title: "Workout tracking",
          description:
            "Build plans from the exercise catalog and record completed workouts.",
          activeProgress: (
            completed: number,
            total: number,
            remaining: number,
          ) =>
            `Workout in progress: ${completed}/${total} completed, ${remaining} remaining`,
          completedProgress: (
            completed: number,
            total: number,
            remaining: number,
          ) =>
            `Latest workout: ${completed}/${total} completed, ${remaining} remaining`,
        },
        stripePlans: {
          title: "Stripe plans",
          description:
            "The subscription table and env placeholders are ready for free-vs-pro gating next.",
        },
      },
    },
    habits: {
      badge: "Habits",
      title: "Build consistency with simple daily loops.",
      description:
        "This module handles the full MVP flow: create habits, mark today as complete, track streaks, and keep the dashboard updated automatically.",
      summary: {
        active: "Active habits",
        doneToday: "Done today",
        bestStreak: "Best streak",
      },
      form: {
        title: "Create habit",
        description:
          "Start with the smallest reliable version of the routine you want to keep.",
        name: "Name",
        namePlaceholder: "Read for 20 minutes",
        descriptionLabel: "Description",
        descriptionPlaceholder: "Optional note or why it matters",
        targetDays: "Target days per week",
        pending: "Creating habit...",
        submit: "Save habit",
      },
      list: {
        title: "Habit list",
        description:
          "Daily completions are stored separately, so your streak math stays resilient.",
        emptyTitle: "Your habits will show up here",
        emptyDescription:
          "Once you create a habit, you can mark it complete for today, watch the streak grow, and see the metrics land on the dashboard.",
        doneToday: "Done today",
        needsCheckIn: "Needs check-in",
        details: "Details",
        undoToday: "Undo today",
        markComplete: "Mark complete",
        deleteLabel: (name: string) => `Delete ${name}`,
        habitStats: (
          currentStreak: number,
          completionsThisWeek: number,
          frequencyPerWeek: number,
        ) => [
          `${currentStreak} day streak`,
          `${completionsThisWeek} completions this week`,
          `${frequencyPerWeek} target days / week`,
        ],
      },
    },
    fitness: {
      badge: "Fitness",
      title: "Build a workout from real exercises.",
      description:
        "Search the catalog, inspect the movement, then assemble a focused plan with sets, reps, rest, and notes.",
      initialLoadError:
        "Fitness data could not be loaded yet. Check the backend connection, then search again.",
      fallbackError: "Something went wrong.",
      planCreated: "Workout plan created.",
      exerciseAdded: "Exercise added to the workout.",
      exerciseRemoving: "Removing exercise...",
      exerciseRemoved: "Exercise removed from the workout.",
      workoutLogged: "Workout logged.",
      addExerciseBeforeStarting:
        "Add at least one exercise before starting this workout.",
      createPlanFirst: "Create a workout plan and select an exercise first.",
      addExerciseBeforeLogging:
        "Add at least one exercise before logging this workout.",
      noExercisesCompleted:
        "Mark at least one exercise as completed before logging this workout.",
      defaults: {
        searchQuery: "squat",
        planName: "Strength foundation",
        planDescription: "A focused plan built from the exercise catalog.",
      },
      metrics: {
        results: "Results",
        plans: "Plans",
        inPlan: "In plan",
      },
      catalog: {
        title: "Exercise catalog",
        description:
          "Results come from Coreflow backend endpoints, not the external provider directly.",
        searchAria: "Search exercises",
        searchPlaceholder: "chest press, squat, shoulder press",
        searchButton: "Search",
        loading: "Loading exercises...",
        noResults:
          "No exercises yet. Try a broader search like squat or press.",
        equipment: (value: string) => `Equipment: ${value}`,
      },
      inspector: {
        emptyTitle: "Select an exercise",
        emptyDescription:
          "Pick a catalog result to inspect media, details, and workout settings.",
        selected: "Selected",
        loadingDetails: "Loading details",
        formNotes: "Form notes",
        sets: "Sets",
        reps: "Reps",
        restSeconds: "Rest sec",
        notes: "Notes",
        notesPlaceholder: "Tempo, range, warm-up, or coaching cue",
        addToWorkout: "Add to workout",
      },
      builder: {
        title: "Workout builder",
        description: "Create a plan, then add exercises from the catalog.",
        planName: "Plan name",
        planDescription: "Description",
        savePlan: "Save workout plan",
        noWorkout: "No workout yet",
        noWorkoutDescription:
          "Create a plan to start collecting selected exercises.",
        emptyPlan:
          "Exercises you add will appear here in order with sets, reps, rest, and notes.",
        progressCompleted: (completed: number, total: number) =>
          `${completed}/${total} completed`,
        progressRemaining: (remaining: number) => `${remaining} remaining`,
        markComplete: "Completed",
        markPending: "Pending",
        sets: "Sets",
        reps: "Reps",
        rest: "Rest",
        weight: "Weight",
        weightUnit: "kg",
        notes: "Notes",
        finishSessionBeforeEditing:
          "Finish or cancel the active workout before changing this plan.",
      },
      session: {
        activeTitle: (name: string) => `Active workout: ${name}`,
        inProgress: "In progress",
        started: "Workout started. Progress now autosaves as you train.",
        startedAt: (value: string) => `Started: ${value}`,
        startAction: "Start workout",
        startFirst:
          "Start a workout to track progress exercise by exercise.",
        resumeHint:
          "Start the workout to save progress as you complete each exercise. You can leave and resume later.",
        resumeReady: "A workout is already in progress. Resume it below.",
        exerciseCompleted: "Exercise marked complete.",
        exerciseReset: "Exercise marked pending.",
        exerciseUpdated: "Exercise settings saved.",
        finishAction: "Finish workout",
        finished: "Workout finished and logged.",
        cancelAction: "Cancel workout",
        cancelled: "Workout cancelled.",
        liveLabel: "Live session",
        savingExercise: "Saving exercise changes...",
      },
      logs: {
        title: "Workout logs",
        description:
          "Record completed plans without changing the plan template.",
        empty: "Completed workouts will appear here.",
        completedAt: (value: string) => `Completed: ${value}`,
        completedStatus: "Completed",
        exerciseCount: (value: number) => `${value} exercises logged`,
        progress: (completed: number, total: number) =>
          `${completed}/${total} completed`,
        skippedStatus: "Skipped",
      },
    },
  },
  "pt-BR": {
    common: {
      notSpecified: "Nao informado",
      slashSeparator: " / ",
    },
    header: {
      navLabel: "Dashboard",
      nav: {
        overview: "Visao geral",
        focus: "Foco",
        habits: "Habitos",
        fitness: "Treino",
      },
      userMenu: {
        accountLabel: "Conta",
        login: "Entrar",
        signedInAs: "Conectado como",
        fallbackUser: "Usuario Coreflow",
        signOut: "Sair",
      },
    },
    dashboard: {
      badge: "Visao geral",
      title: "Mantenha seus sistemas em movimento.",
      description:
        "Acompanhe a atividade real que ja passa por habitos, foco e planejamento de treino em um workspace autenticado.",
      manageHabits: "Gerenciar habitos",
      metrics: {
        habitsToday: {
          label: "Habitos concluidos hoje",
          detail:
            "Conclusoes diarias usam registros de habito criados para o dia atual.",
        },
        completionRate: {
          label: "Taxa diaria de conclusao",
          detail:
            "Um sinal rapido para saber se o dia esta acompanhando suas metas.",
        },
        longestStreak: {
          label: "Maior sequencia ativa",
          detail:
            "Calculada por datas consecutivas para manter as sequencias apos recarregamentos e deploys.",
        },
        modulesInProgress: {
          label: "Modulos em progresso",
          detail: "Conta modulos com registros salvos para o usuario conectado.",
        },
      },
      habitMomentum: {
        title: "Ritmo dos habitos",
        description: "O modulo de habitos ja alimenta as metricas do dashboard.",
        emptyTitle: "Nenhum habito ainda",
        emptyDescription:
          "Crie seu primeiro habito para gerar progresso diario e dados de sequencia.",
        emptyAction: "Criar habito",
        doneToday: "Feito hoje",
        pending: "Pendente",
        habitStats: (currentStreak: number, completionsThisWeek: number) =>
          `${currentStreak} dias de sequencia · ${completionsThisWeek} conclusoes nesta semana`,
      },
      nextModules: {
        title: "Continuar fluxos",
        description:
          "Entre no proximo fluxo autenticado sem sair do dashboard.",
        studySessions: {
          title: "Sessoes de estudo",
          description:
            "Planeje sessoes, inicie foco e salve historico de duracao concluida.",
        },
        workoutTracking: {
          title: "Registro de treino",
          description:
            "Monte planos pelo catalogo de exercicios e registre treinos concluidos.",
          activeProgress: (
            completed: number,
            total: number,
            remaining: number,
          ) =>
            `Treino em andamento: ${completed}/${total} concluidos, ${remaining} restantes`,
          completedProgress: (
            completed: number,
            total: number,
            remaining: number,
          ) =>
            `Ultimo treino: ${completed}/${total} concluidos, ${remaining} restantes`,
        },
        stripePlans: {
          title: "Planos Stripe",
          description:
            "A tabela de assinatura e os env placeholders estao prontos para diferenciar free e pro.",
        },
      },
    },
    habits: {
      badge: "Habitos",
      title: "Construa consistencia com ciclos diarios simples.",
      description:
        "Este modulo cobre o fluxo MVP completo: criar habitos, marcar hoje como concluido, acompanhar sequencias e atualizar o dashboard automaticamente.",
      summary: {
        active: "Habitos ativos",
        doneToday: "Feitos hoje",
        bestStreak: "Melhor sequencia",
      },
      form: {
        title: "Criar habito",
        description:
          "Comece pela menor versao confiavel da rotina que voce quer manter.",
        name: "Nome",
        namePlaceholder: "Ler por 20 minutos",
        descriptionLabel: "Descricao",
        descriptionPlaceholder: "Nota opcional ou motivo importante",
        targetDays: "Dias alvo por semana",
        pending: "Criando habito...",
        submit: "Salvar habito",
      },
      list: {
        title: "Lista de habitos",
        description:
          "Conclusoes diarias ficam separadas para manter o calculo de sequencia resiliente.",
        emptyTitle: "Seus habitos vao aparecer aqui",
        emptyDescription:
          "Depois de criar um habito, voce pode marcar o dia como concluido, acompanhar a sequencia e ver as metricas no dashboard.",
        doneToday: "Feito hoje",
        needsCheckIn: "Precisa check-in",
        details: "Detalhes",
        undoToday: "Desfazer hoje",
        markComplete: "Marcar concluido",
        deleteLabel: (name: string) => `Excluir ${name}`,
        habitStats: (
          currentStreak: number,
          completionsThisWeek: number,
          frequencyPerWeek: number,
        ) => [
          `${currentStreak} dias de sequencia`,
          `${completionsThisWeek} conclusoes nesta semana`,
          `${frequencyPerWeek} dias alvo / semana`,
        ],
      },
    },
    fitness: {
      badge: "Treino",
      title: "Monte um treino com exercicios reais.",
      description:
        "Pesquise o catalogo, veja o movimento e monte um plano focado com series, repeticoes, descanso e notas.",
      initialLoadError:
        "Os dados de treino ainda nao puderam ser carregados. Verifique a conexao com o backend e tente pesquisar novamente.",
      fallbackError: "Algo deu errado.",
      planCreated: "Plano de treino criado.",
      exerciseAdded: "Exercicio adicionado ao treino.",
      exerciseRemoving: "Removendo exercicio...",
      exerciseRemoved: "Exercicio removido do treino.",
      workoutLogged: "Treino registrado.",
      addExerciseBeforeStarting:
        "Adicione pelo menos um exercicio antes de iniciar este treino.",
      createPlanFirst:
        "Crie um plano de treino e selecione um exercicio primeiro.",
      addExerciseBeforeLogging:
        "Adicione pelo menos um exercicio antes de registrar este treino.",
      noExercisesCompleted:
        "Marque pelo menos um exercicio como concluido antes de registrar este treino.",
      defaults: {
        searchQuery: "squat",
        planName: "Base de forca",
        planDescription:
          "Um plano focado criado a partir do catalogo de exercicios.",
      },
      metrics: {
        results: "Resultados",
        plans: "Planos",
        inPlan: "No plano",
      },
      catalog: {
        title: "Catalogo de exercicios",
        description:
          "Os resultados vem dos endpoints backend do Coreflow, nao do provedor externo diretamente.",
        searchAria: "Pesquisar exercicios",
        searchPlaceholder: "chest press, squat, shoulder press",
        searchButton: "Pesquisar",
        loading: "Carregando exercicios...",
        noResults:
          "Nenhum exercicio ainda. Tente uma busca mais ampla como squat ou press.",
        equipment: (value: string) => `Equipamento: ${value}`,
      },
      inspector: {
        emptyTitle: "Selecione um exercicio",
        emptyDescription:
          "Escolha um resultado do catalogo para ver midia, detalhes e ajustes do treino.",
        selected: "Selecionado",
        loadingDetails: "Carregando detalhes",
        formNotes: "Notas de execucao",
        sets: "Series",
        reps: "Reps",
        restSeconds: "Descanso",
        notes: "Notas",
        notesPlaceholder: "Tempo, amplitude, aquecimento ou dica tecnica",
        addToWorkout: "Adicionar ao treino",
      },
      builder: {
        title: "Montador de treino",
        description: "Crie um plano e adicione exercicios do catalogo.",
        planName: "Nome do plano",
        planDescription: "Descricao",
        savePlan: "Salvar plano de treino",
        noWorkout: "Nenhum treino ainda",
        noWorkoutDescription:
          "Crie um plano para comecar a reunir exercicios selecionados.",
        emptyPlan:
          "Os exercicios adicionados aparecem aqui em ordem com series, reps, descanso e notas.",
        progressCompleted: (completed: number, total: number) =>
          `${completed}/${total} concluidos`,
        progressRemaining: (remaining: number) => `${remaining} restantes`,
        markComplete: "Concluido",
        markPending: "Pendente",
        sets: "Series",
        reps: "Reps",
        rest: "Descanso",
        weight: "Carga",
        weightUnit: "kg",
        notes: "Notas",
        finishSessionBeforeEditing:
          "Finalize ou cancele o treino ativo antes de alterar este plano.",
      },
      session: {
        activeTitle: (name: string) => `Treino ativo: ${name}`,
        inProgress: "Em andamento",
        started:
          "Treino iniciado. O progresso agora e salvo automaticamente durante a execucao.",
        startedAt: (value: string) => `Iniciado: ${value}`,
        startAction: "Iniciar treino",
        startFirst:
          "Inicie um treino para acompanhar o progresso exercicio por exercicio.",
        resumeHint:
          "Inicie o treino para salvar o progresso conforme conclui cada exercicio. Voce pode sair e retomar depois.",
        resumeReady: "Ja existe um treino em andamento. Retome abaixo.",
        exerciseCompleted: "Exercicio marcado como concluido.",
        exerciseReset: "Exercicio marcado como pendente.",
        exerciseUpdated: "Ajustes do exercicio salvos.",
        finishAction: "Finalizar treino",
        finished: "Treino finalizado e registrado.",
        cancelAction: "Cancelar treino",
        cancelled: "Treino cancelado.",
        liveLabel: "Sessao ativa",
        savingExercise: "Salvando ajustes do exercicio...",
      },
      logs: {
        title: "Logs de treino",
        description:
          "Registre planos concluidos sem alterar o modelo do treino.",
        empty: "Treinos concluidos aparecerao aqui.",
        completedAt: (value: string) => `Concluido: ${value}`,
        completedStatus: "Concluido",
        exerciseCount: (value: number) => `${value} exercicios registrados`,
        progress: (completed: number, total: number) =>
          `${completed}/${total} concluidos`,
        skippedStatus: "Pulou",
      },
    },
  },
};
