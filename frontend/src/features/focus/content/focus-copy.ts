export const focusCopy = {
  en: {
    badge: "Focus",
    title: "Plan the work, then enter the session.",
    description:
      "A structured study system for choosing what matters, protecting time, and closing the loop when the work is done.",
    actions: {
      create: "Create session",
      start: "Start",
      select: "Select",
      cancel: "Cancel",
      archive: "Archive",
      delete: "Delete",
      complete: "Mark complete",
      pause: "Pause",
      resume: "Resume",
      reset: "Reset",
      saveFocus: "Save focus time",
      savingFocus: "Saving time...",
      useStandalone: "Use free focus",
      save: "Save session",
      saving: "Saving...",
    },
    deleteDialog: {
      cancelLabel: "Keep session",
      confirmLabel: "Delete session",
      description:
        "This permanently removes the study session and any focus runs linked to it. Archive the session instead if you may need the record later.",
      title: "Delete study session?",
    },
    fallbackError: "Study session could not be saved.",
    overview: {
      totalFocus: "Focus time",
      completed: "Completed",
      activePending: "Active / pending",
      completionRate: "Completion rate",
      minutes: (value: number) => `${value} min`,
      duration: formatDuration,
      ratio: (active: number, pending: number) => `${active} / ${pending}`,
    },
    planner: {
      title: "Plan next study block",
      description: "Capture the next unit of work before starting the timer.",
      titleLabel: "Title",
      titlePlaceholder: "Review cellular respiration",
      descriptionLabel: "Description",
      descriptionPlaceholder: "Optional scope, source, or success criteria",
      subjectLabel: "Subject",
      subjectPlaceholder: "Biology",
      estimatedLabel: "Estimated minutes",
      startLabel: "Start date",
      dueLabel: "Due date",
      difficultyLabel: "Difficulty",
      importanceLabel: "Importance",
    },
    list: {
      title: "Study sessions",
      description: "Keep the plan small enough to execute and clear enough to resume quickly.",
      upcomingTitle: "Upcoming and active",
      completedTitle: "Completed",
      archivedTitle: "Canceled and archived",
      emptyTitle: "No sessions match this view",
      emptyDescription: "Adjust filters or create a study block to start building your focus queue.",
      details: "Details",
      filters: {
        status: "Status",
        difficulty: "Difficulty",
        importance: "Importance",
        all: "All",
      },
      estimated: (minutes: number) => `${minutes} min planned`,
      focusLogged: (seconds: number) => `${formatDuration(seconds)} focused`,
      dateRange: (start: string, due: string) => `${start} to ${due}`,
    },
    pomodoro: {
      title: "Pomodoro execution",
      description: "Run the timer independently or link it to a selected study session.",
      noSession: "Free focus mode",
      noSessionDescription: "Time will be saved as standalone focus history.",
      selected: "Linked study session",
      standaloneTotal: (seconds: number) => `${formatDuration(seconds)} saved outside sessions`,
      currentRun: (seconds: number) => `${formatDuration(seconds)} in this run`,
      phase: {
        focus: "Focus",
        short_break: "Short break",
        long_break: "Long break",
        complete: "Cycle complete",
      },
      settings: {
        focusMinutes: "Focus",
        shortBreakMinutes: "Short break",
        longBreakMinutes: "Long break",
        cycles: "Cycles",
      },
      cycle: (current: number, total: number) => `Cycle ${current} of ${total}`,
    },
    levels: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    status: {
      pending: "Pending",
      in_progress: "In progress",
      completed: "Completed",
      canceled: "Canceled",
      archived: "Archived",
    },
  },
  "pt-BR": {
    badge: "Foco",
    title: "Planeje o estudo, depois entre na sessao.",
    description:
      "Um sistema de estudo estruturado para escolher o que importa, proteger tempo e fechar o ciclo quando o trabalho termina.",
    actions: {
      create: "Criar sessao",
      start: "Iniciar",
      select: "Selecionar",
      cancel: "Cancelar",
      archive: "Arquivar",
      delete: "Excluir",
      complete: "Concluir",
      pause: "Pausar",
      resume: "Retomar",
      reset: "Resetar",
      saveFocus: "Salvar tempo focado",
      savingFocus: "Salvando tempo...",
      useStandalone: "Usar foco livre",
      save: "Salvar sessao",
      saving: "Salvando...",
    },
    deleteDialog: {
      cancelLabel: "Manter sessao",
      confirmLabel: "Excluir sessao",
      description:
        "Isso remove permanentemente a sessao de estudo e todos os registros de foco vinculados a ela. Arquive a sessao se talvez precisar do registro depois.",
      title: "Excluir sessao de estudo?",
    },
    fallbackError: "Nao foi possivel salvar a sessao de estudo.",
    overview: {
      totalFocus: "Tempo focado",
      completed: "Concluidas",
      activePending: "Ativas / pendentes",
      completionRate: "Taxa de conclusao",
      minutes: (value: number) => `${value} min`,
      duration: formatDuration,
      ratio: (active: number, pending: number) => `${active} / ${pending}`,
    },
    planner: {
      title: "Planejar proximo bloco",
      description: "Registre a proxima unidade de estudo antes de iniciar o timer.",
      titleLabel: "Titulo",
      titlePlaceholder: "Revisar respiracao celular",
      descriptionLabel: "Descricao",
      descriptionPlaceholder: "Escopo, fonte ou criterio de sucesso opcional",
      subjectLabel: "Materia",
      subjectPlaceholder: "Biologia",
      estimatedLabel: "Minutos estimados",
      startLabel: "Data inicial",
      dueLabel: "Data limite",
      difficultyLabel: "Dificuldade",
      importanceLabel: "Importancia",
    },
    list: {
      title: "Sessoes de estudo",
      description: "Mantenha o plano pequeno o bastante para executar e claro o bastante para retomar rapido.",
      upcomingTitle: "Proximas e ativas",
      completedTitle: "Concluidas",
      archivedTitle: "Canceladas e arquivadas",
      emptyTitle: "Nenhuma sessao nesta visao",
      emptyDescription: "Ajuste os filtros ou crie um bloco de estudo para montar sua fila de foco.",
      details: "Detalhes",
      filters: {
        status: "Status",
        difficulty: "Dificuldade",
        importance: "Importancia",
        all: "Todos",
      },
      estimated: (minutes: number) => `${minutes} min planejados`,
      focusLogged: (seconds: number) => `${formatDuration(seconds)} focados`,
      dateRange: (start: string, due: string) => `${start} ate ${due}`,
    },
    pomodoro: {
      title: "Execucao Pomodoro",
      description: "Use o timer livremente ou conecte a uma sessao de estudo selecionada.",
      noSession: "Modo foco livre",
      noSessionDescription: "O tempo sera salvo como historico de foco avulso.",
      selected: "Sessao de estudo conectada",
      standaloneTotal: (seconds: number) => `${formatDuration(seconds)} salvos fora de sessoes`,
      currentRun: (seconds: number) => `${formatDuration(seconds)} nesta execucao`,
      phase: {
        focus: "Foco",
        short_break: "Pausa curta",
        long_break: "Pausa longa",
        complete: "Ciclo completo",
      },
      settings: {
        focusMinutes: "Foco",
        shortBreakMinutes: "Pausa curta",
        longBreakMinutes: "Pausa longa",
        cycles: "Ciclos",
      },
      cycle: (current: number, total: number) => `Ciclo ${current} de ${total}`,
    },
    levels: {
      low: "Baixa",
      medium: "Media",
      high: "Alta",
    },
    status: {
      pending: "Pendente",
      in_progress: "Em progresso",
      completed: "Concluida",
      canceled: "Cancelada",
      archived: "Arquivada",
    },
  },
};

export type FocusCopy = (typeof focusCopy)["en"];

function formatDuration(totalSeconds: number) {
  if (totalSeconds <= 0) {
    return "0m";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return seconds > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }

  return `${seconds}s`;
}
