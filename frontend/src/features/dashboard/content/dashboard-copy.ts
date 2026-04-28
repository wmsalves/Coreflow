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
      badge: "Today view",
      title: "Your day, in command.",
      description:
        "See what needs action, resume what is already moving, and close the day with one record of execution.",
      summary: {
        title: "Execution control",
        description:
          "Start with open loops. Keep the day moving from one surface.",
        habitsProgress: (completed: number, total: number) =>
          `${completed}/${total} habits checked`,
        focusProgress: (today: number, week: number) =>
          `${formatDuration(today)} focused today · ${formatDuration(week)} this week`,
        modulesInMotion: (value: number) => `${value}/3 systems moving`,
      },
      ftue: {
        badge: "Starter day",
        title: "Coreflow is ready before your data is.",
        description:
          "Use this starting state to feel the loop: set one baseline, run one focused block, then add training when you are ready.",
        progress: "0/3 started",
        starterRows: [
          {
            action: "Create the first habit",
            description: "Pick one small action you can check off today.",
            href: "/dashboard/habits",
            title: "Set the daily baseline",
          },
          {
            action: "Plan a focus block",
            description: "Give the timer a clear target before you start.",
            href: "/dashboard/focus",
            title: "Protect one work block",
          },
          {
            action: "Open training",
            description: "Create a plan when physical execution belongs in the day.",
            href: "/dashboard/fitness",
            title: "Prepare training",
          },
        ],
      },
      moduleCards: {
        habits: {
          eyebrow: "Rituals",
          title: "Daily baseline",
          ready: "Daily routine is on track.",
          empty: "No daily baseline yet. Create the first habit to give the day structure.",
          pending: (count: number) => `${count} habits still need a check-in`,
          completed: (completed: number, total: number) =>
            `${completed}/${total} completed today`,
          openAction: "Open habits",
        },
        focus: {
          eyebrow: "Deep work",
          title: "Focus queue",
          active: (title: string) => `Active session: ${title}`,
          next: (title: string) => `Next up: ${title}`,
          empty: "No deep work block is planned yet.",
          summary: (completed: number, pending: number) =>
            `${completed} completed · ${pending} pending`,
          resumeAction: "Resume focus",
          planAction: "Open focus",
        },
        fitness: {
          eyebrow: "Training",
          title: "Training execution",
          active: (name: string) => `Workout in progress: ${name}`,
          activeFallback: "Workout in progress",
          latest: (name: string) => `Latest workout: ${name}`,
          empty: "No workout plan is ready yet.",
          progress: (completed: number, total: number, remaining: number) =>
            `${completed}/${total} completed · ${remaining} remaining`,
          readyPlans: (count: number) => `${count} plans ready`,
          skipped: (count: number) => `${count} skipped`,
          resumeAction: "Resume workout",
          buildAction: "Open fitness",
        },
      },
      quickActions: {
        title: "Move now",
        description:
          "Choose the smallest useful action that moves the day forward.",
        createHabit: "Create habit",
        planFocusSession: "Plan focus session",
        startFocus: "Start focus",
        openWorkoutBuilder: "Open workout builder",
      },
      nextAction: {
        title: "Recommended move",
        reasons: {
          firstRun: "Start with one habit. It gives the dashboard a real signal and lets you feel the execution loop immediately.",
          resumeFocus: "You already have a focus session in motion. Pick it back up before context drifts.",
          resumeWorkout: "Your workout is already open. Finishing it now keeps the execution history clean.",
          habitsPending: (count: number) => `${count} habits still need a check-in. Clear those first so the day starts with visible progress.`,
          nextFocus: (title: string) => `Your next planned focus block is ${title}. Start there when you are ready for deeper work.`,
          readyWorkout: "A workout plan is ready to run. Use it when you want a more structured execution block.",
          firstStep: "There is no daily momentum yet. Start with one habit so the dashboard has something real to track.",
        },
      },
      secondaryMetrics: {
        title: "Daily signals",
        description:
          "The original dashboard metrics stay here as a secondary read on system health.",
      },
      metrics: {
        habitsToday: {
          label: "Habits completed today",
          detail:
            "Daily completions are powered by habit log entries for the current day.",
        },
        completionRate: {
          label: "Daily completion rate",
          detail:
            "A quick signal for whether your day is keeping pace with your targets.",
        },
        longestStreak: {
          label: "Longest active streak",
          detail:
            "Computed from consecutive completion dates so streaks survive refreshes and deploys.",
        },
        modulesInProgress: {
          label: "Modules in progress",
          detail: "Counts modules with saved records for the signed-in user.",
        },
      },
      habitMomentum: {
        title: "Habit momentum",
        description:
          "Keep the unfinished habits visible so you can close the loop without hunting through the module.",
        emptyTitle: "No habits yet",
        emptyDescription:
          "Create your first habit to give the day a repeatable starting point.",
        emptyAction: "Create a habit",
        doneToday: "Done today",
        pending: "Pending",
        habitStats: (currentStreak: number, completionsThisWeek: number) =>
          `${currentStreak} day streak · ${completionsThisWeek} completions this week`,
      },
    },
    habits: {
      badge: "Habits",
      title: "Install the daily baseline.",
      description:
        "Create repeatable commitments, check them off today, and keep the system honest.",
      summary: {
        active: "Active habits",
        doneToday: "Done today",
        bestStreak: "Best streak",
      },
      form: {
        title: "Create habit",
        description:
          "Start with something small enough to repeat without negotiating with yourself.",
        name: "Name",
        namePlaceholder: "Read for 20 minutes",
        descriptionLabel: "Description",
        descriptionPlaceholder: "Optional note or why it matters",
        targetDays: "Target days per week",
        pending: "Creating habit...",
        submit: "Save habit",
        success: "Daily baseline added.",
        successHint: "Mark it complete today to give the dashboard its first real signal.",
      },
      list: {
        title: "Habit list",
        description:
          "Daily completions stay separate from the habit itself, so checking in today never distorts the long-term pattern.",
        emptyTitle: "Start your day with one action",
        emptyDescription:
          "Create a small baseline habit, mark it complete, and Coreflow starts showing real daily progress.",
        emptyAction: "Create first habit",
        emptyHint: "A good first habit is daily, visible, and easy to confirm in under a minute.",
        doneToday: "Done today",
        needsCheckIn: "Needs check-in",
        details: "Details",
        undoToday: "Undo today",
        markComplete: "Mark complete",
        toggleSuccess: "Saved for today. The dashboard is already carrying it forward.",
        deleteSuccess: "Habit removed.",
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
      title: "Run training without losing the record.",
      description:
        "Search the catalog, build a plan, execute it, and keep the completed work traceable.",
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
        showMore: "Show more",
        showing: (visible: number, total: number) =>
          `Showing ${visible} of ${total}`,
        loading: "Loading exercises...",
        noResults:
          "No exercises yet. Try a broader search like squat or press.",
        equipment: (value: string) => `Equipment: ${value}`,
      },
      inspector: {
        category: "Category",
        categoryFallback: "Catalog movement",
        contextDescription: (bodyPart: string, target: string, equipment: string) =>
          `A ${bodyPart.toLowerCase()} movement focused on ${target.toLowerCase()}, configured here with ${equipment.toLowerCase()} in mind.`,
        contextTitle: "Movement context",
        difficulty: "Difficulty",
        difficultyFallback: "Provider not specified",
        emptyTitle: "Select an exercise",
        emptyDescription:
          "Pick a catalog result to inspect media, details, and workout settings.",
        equipment: "Equipment",
        executionTitle: "Execution steps",
        metadataTitle: "Exercise metadata",
        selected: "Selected",
        loadingDetails: "Loading details",
        muscleGroupsTitle: "Muscle groups",
        setupTitle: "Workout setup",
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
          "Create a starter plan, add one exercise, and the workout can become an active session.",
        emptyPlan:
          "Search the catalog and add the first exercise. Sets, reps, rest, and notes will stay attached to the plan.",
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
        startFirst: "Start a workout to track progress exercise by exercise.",
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
        detailCta: "View details",
        empty: "Completed workouts will appear here.",
        emptyHint:
          "Start a workout, mark at least one exercise complete, and finish it to create the first training record.",
        completedAt: (value: string) => `Completed: ${value}`,
        completedStatus: "Completed",
        exerciseCount: (value: number) => `${value} exercises logged`,
        progress: (completed: number, total: number) =>
          `${completed}/${total} completed`,
        skippedStatus: "Skipped",
        skippedCount: (value: number) => `${value} skipped`,
        summaryLabel: "Exercise summary",
      },
      history: {
        backToFitness: "Back to Fitness",
        emptyExercises: "No logged exercises were saved for this workout.",
        notFoundDescription:
          "That workout log was not found or is no longer available for this account.",
        notFoundTitle: "Workout not found",
      },
      detail: {
        completedBadge: "Completed workout",
        completionRatio: (completed: number, total: number) =>
          `${completed}/${total} completed`,
        completedLabel: "Completed",
        duration: (minutes: number) => `${minutes} min`,
        exerciseSummary: "Logged exercises",
        notes: "Notes",
        skippedLabel: "Skipped",
        startedFrom: (name: string) => `From plan: ${name}`,
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
        habits: "Habitos",
        focus: "Foco",
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
      badge: "Hoje",
      title: "Seu dia sob comando.",
      description:
        "Veja o que precisa de acao, retome o que ja esta em movimento e feche o dia com um unico registro de execucao.",
      summary: {
        title: "Controle de execucao",
        description:
          "Comece pelos ciclos abertos. Mantenha o dia em movimento em uma unica superficie.",
        habitsProgress: (completed: number, total: number) =>
          `${completed}/${total} habitos marcados`,
        focusProgress: (today: number, week: number) =>
          `${formatDuration(today)} de foco hoje · ${formatDuration(week)} nesta semana`,
        modulesInMotion: (value: number) => `${value}/3 sistemas em movimento`,
      },
      ftue: {
        badge: "Dia inicial",
        title: "Coreflow ja esta pronto antes dos seus dados.",
        description:
          "Use este estado inicial para sentir o ciclo: defina uma base, execute um bloco de foco e adicione treino quando fizer sentido.",
        progress: "0/3 iniciados",
        starterRows: [
          {
            action: "Criar o primeiro habito",
            description: "Escolha uma acao pequena para marcar ainda hoje.",
            href: "/dashboard/habits",
            title: "Definir a base diaria",
          },
          {
            action: "Planejar foco",
            description: "De ao timer um alvo claro antes de comecar.",
            href: "/dashboard/focus",
            title: "Proteger um bloco",
          },
          {
            action: "Abrir treino",
            description: "Crie um plano quando a execucao fisica entrar no dia.",
            href: "/dashboard/fitness",
            title: "Preparar treino",
          },
        ],
      },
      moduleCards: {
        habits: {
          eyebrow: "Rituais",
          title: "Base diaria",
          ready: "A rotina diaria esta em dia.",
          empty:
            "Nenhuma base diaria ainda. Crie o primeiro habito para dar estrutura ao dia.",
          pending: (count: number) =>
            `${count} habitos ainda precisam de check-in`,
          completed: (completed: number, total: number) =>
            `${completed}/${total} concluidos hoje`,
          openAction: "Abrir habitos",
        },
        focus: {
          eyebrow: "Trabalho profundo",
          title: "Fila de foco",
          active: (title: string) => `Sessao ativa: ${title}`,
          next: (title: string) => `Proxima: ${title}`,
          empty: "Nenhum bloco de trabalho profundo planejado ainda.",
          summary: (completed: number, pending: number) =>
            `${completed} concluidas · ${pending} pendentes`,
          resumeAction: "Retomar foco",
          planAction: "Abrir foco",
        },
        fitness: {
          eyebrow: "Treino",
          title: "Execucao fisica",
          active: (name: string) => `Treino em andamento: ${name}`,
          activeFallback: "Treino em andamento",
          latest: (name: string) => `Ultimo treino: ${name}`,
          empty: "Nenhum plano de treino pronto ainda.",
          progress: (completed: number, total: number, remaining: number) =>
            `${completed}/${total} concluidos · ${remaining} restantes`,
          readyPlans: (count: number) => `${count} planos prontos`,
          skipped: (count: number) => `${count} pulados`,
          resumeAction: "Retomar treino",
          buildAction: "Abrir treino",
        },
      },
      quickActions: {
        title: "Mover agora",
        description:
          "Escolha a menor acao util que faz o dia avancar.",
        createHabit: "Criar habito",
        planFocusSession: "Planejar foco",
        startFocus: "Iniciar foco",
        openWorkoutBuilder: "Abrir treino",
      },
      nextAction: {
        title: "Movimento recomendado",
        reasons: {
          firstRun: "Comece por um habito. Ele da ao dashboard um sinal real e mostra o ciclo de execucao imediatamente.",
          resumeFocus: "Voce ja tem uma sessao de foco em andamento. Retome antes que o contexto esfrie.",
          resumeWorkout: "Seu treino ja esta aberto. Finalizar agora mantem o historico de execucao limpo.",
          habitsPending: (count: number) => `${count} habitos ainda precisam de check-in. Resolva isso primeiro para o dia ganhar progresso visivel.`,
          nextFocus: (title: string) => `Seu proximo bloco planejado de foco e ${title}. Comece por ele quando quiser entrar em trabalho profundo.`,
          readyWorkout: "Ja existe um plano de treino pronto para executar. Use quando quiser um bloco mais estruturado.",
          firstStep: "Ainda nao existe ritmo no dia. Comece por um habito para o dashboard ter algo real para acompanhar.",
        },
      },
      secondaryMetrics: {
        title: "Sinais do dia",
        description:
          "As metricas originais continuam aqui como leitura secundaria da saude do sistema.",
      },
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
          detail:
            "Conta modulos com registros salvos para o usuario conectado.",
        },
      },
      habitMomentum: {
        title: "Ritmo dos habitos",
        description:
          "Mantenha os habitos inacabados visiveis para fechar o ciclo sem precisar procurar no modulo.",
        emptyTitle: "Nenhum habito ainda",
        emptyDescription:
          "Crie seu primeiro habito para dar ao dia um ponto de partida repetivel.",
        emptyAction: "Criar habito",
        doneToday: "Feito hoje",
        pending: "Pendente",
        habitStats: (currentStreak: number, completionsThisWeek: number) =>
          `${currentStreak} dias de sequencia · ${completionsThisWeek} conclusoes nesta semana`,
      },
    },
    habits: {
      badge: "Habitos",
      title: "Instale a base diaria.",
      description:
        "Crie compromissos repetiveis, marque o que foi feito hoje e mantenha o sistema honesto.",
      summary: {
        active: "Habitos ativos",
        doneToday: "Feitos hoje",
        bestStreak: "Melhor sequencia",
      },
      form: {
        title: "Criar habito",
        description:
          "Comece com algo pequeno o bastante para repetir sem negociar consigo mesmo.",
        name: "Nome",
        namePlaceholder: "Ler por 20 minutos",
        descriptionLabel: "Descricao",
        descriptionPlaceholder: "Nota opcional ou motivo importante",
        targetDays: "Dias alvo por semana",
        pending: "Criando habito...",
        submit: "Salvar habito",
        success: "Base diaria adicionada.",
        successHint: "Marque como concluida hoje para dar ao dashboard o primeiro sinal real.",
      },
      list: {
        title: "Lista de habitos",
        description:
          "As conclusoes diarias ficam separadas do habito em si, entao marcar hoje nunca distorce o padrao de longo prazo.",
        emptyTitle: "Comece o dia com uma acao",
        emptyDescription:
          "Crie uma pequena base diaria, marque como concluida e o Coreflow passa a mostrar progresso real.",
        emptyAction: "Criar primeiro habito",
        emptyHint: "Um bom primeiro habito e diario, visivel e facil de confirmar em menos de um minuto.",
        doneToday: "Feito hoje",
        needsCheckIn: "Precisa check-in",
        details: "Detalhes",
        undoToday: "Desfazer hoje",
        markComplete: "Marcar concluido",
        toggleSuccess: "Salvo para hoje. O dashboard ja leva isso adiante.",
        deleteSuccess: "Habito removido.",
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
      title: "Execute treino sem perder o registro.",
      description:
        "Pesquise o catalogo, monte um plano, execute e mantenha o trabalho concluido rastreavel.",
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
        showMore: "Mostrar mais",
        showing: (visible: number, total: number) =>
          `Mostrando ${visible} de ${total}`,
        loading: "Carregando exercicios...",
        noResults:
          "Nenhum exercicio ainda. Tente uma busca mais ampla como squat ou press.",
        equipment: (value: string) => `Equipamento: ${value}`,
      },
      inspector: {
        category: "Categoria",
        categoryFallback: "Movimento do catalogo",
        contextDescription: (bodyPart: string, target: string, equipment: string) =>
          `Movimento de ${bodyPart.toLowerCase()} com foco em ${target.toLowerCase()}, configurado aqui considerando ${equipment.toLowerCase()}.`,
        contextTitle: "Contexto do movimento",
        difficulty: "Dificuldade",
        difficultyFallback: "Nao informado pelo provedor",
        emptyTitle: "Selecione um exercicio",
        emptyDescription:
          "Escolha um resultado do catalogo para ver midia, detalhes e ajustes do treino.",
        equipment: "Equipamento",
        executionTitle: "Passos de execucao",
        metadataTitle: "Metadados do exercicio",
        selected: "Selecionado",
        loadingDetails: "Carregando detalhes",
        muscleGroupsTitle: "Grupos musculares",
        setupTitle: "Ajustes do treino",
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
          "Crie um plano inicial, adicione um exercicio e o treino podera virar uma sessao ativa.",
        emptyPlan:
          "Pesquise o catalogo e adicione o primeiro exercicio. Series, reps, descanso e notas ficam ligados ao plano.",
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
        detailCta: "Ver detalhes",
        empty: "Treinos concluidos aparecerao aqui.",
        emptyHint:
          "Inicie um treino, marque pelo menos um exercicio como concluido e finalize para criar o primeiro registro.",
        completedAt: (value: string) => `Concluido: ${value}`,
        completedStatus: "Concluido",
        exerciseCount: (value: number) => `${value} exercicios registrados`,
        progress: (completed: number, total: number) =>
          `${completed}/${total} concluidos`,
        skippedStatus: "Pulou",
        skippedCount: (value: number) => `${value} pulados`,
        summaryLabel: "Resumo dos exercicios",
      },
      history: {
        backToFitness: "Voltar para Treino",
        emptyExercises:
          "Nenhum exercicio registrado foi salvo para este treino.",
        notFoundDescription:
          "Esse log de treino nao foi encontrado ou nao esta disponivel para esta conta.",
        notFoundTitle: "Treino nao encontrado",
      },
      detail: {
        completedBadge: "Treino concluido",
        completionRatio: (completed: number, total: number) =>
          `${completed}/${total} concluidos`,
        completedLabel: "Concluidos",
        duration: (minutes: number) => `${minutes} min`,
        exerciseSummary: "Exercicios registrados",
        notes: "Notas",
        skippedLabel: "Pulados",
        startedFrom: (name: string) => `Plano de origem: ${name}`,
      },
    },
  },
};

function formatDashboardDuration(totalSeconds: number) {
  if (totalSeconds <= 0) {
    return "0m";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

const formatDuration = formatDashboardDuration;
