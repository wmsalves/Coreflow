import type { LandingLocale } from "@/features/landing/types";

export type AuthMode = "login" | "signup";

type AuthPageCopy = {
  alternateCta: string;
  alternateHref: string;
  alternateLabel: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  currentPasswordPlaceholder: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  eyebrow: string;
  forgotPassword?: string;
  formDescription: string;
  formEyebrow: string;
  formTitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  newPasswordPlaceholder: string;
  passwordLabel: string;
  pending: string;
  submit: string;
  title: string;
};

export const authCopy: Record<LandingLocale, Record<AuthMode, AuthPageCopy>> = {
  en: {
    login: {
      alternateCta: "Create account",
      alternateHref: "/signup",
      alternateLabel: "New to Coreflow?",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Repeat your password",
      currentPasswordPlaceholder: "Your password",
      description: "Return to the execution system that keeps the day under control.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      eyebrow: "Welcome back",
      formDescription: "Use your email and password to continue the system.",
      formEyebrow: "Secure access",
      formTitle: "Sign in to Coreflow",
      fullNameLabel: "Full name",
      fullNamePlaceholder: "Alex Johnson",
      newPasswordPlaceholder: "At least 8 characters",
      passwordLabel: "Password",
      pending: "Signing in...",
      submit: "Sign in",
      title: "Resume the day with control.",
    },
    signup: {
      alternateCta: "Sign in",
      alternateHref: "/signin",
      alternateLabel: "Already have an account?",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Repeat your password",
      currentPasswordPlaceholder: "Your password",
      description: "Create the account that keeps your habits, focus, and training execution in one place.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      eyebrow: "Start free",
      formDescription: "Start with one daily system, then let the record compound.",
      formEyebrow: "Secure setup",
      formTitle: "Create your account",
      fullNameLabel: "Full name",
      fullNamePlaceholder: "Alex Johnson",
      newPasswordPlaceholder: "At least 8 characters",
      passwordLabel: "Password",
      pending: "Creating account...",
      submit: "Create account",
      title: "Build your personal execution system.",
    },
  },
  "pt-BR": {
    login: {
      alternateCta: "Criar conta",
      alternateHref: "/signup",
      alternateLabel: "Novo no Coreflow?",
      confirmPasswordLabel: "Confirmar senha",
      confirmPasswordPlaceholder: "Repita sua senha",
      currentPasswordPlaceholder: "Sua senha",
      description: "Volte ao sistema de execucao que mantem o dia sob controle.",
      emailLabel: "Email",
      emailPlaceholder: "voce@exemplo.com",
      eyebrow: "Bem-vindo de volta",
      formDescription: "Use email e senha para continuar o sistema.",
      formEyebrow: "Acesso seguro",
      formTitle: "Entrar no Coreflow",
      fullNameLabel: "Nome completo",
      fullNamePlaceholder: "Alex Silva",
      newPasswordPlaceholder: "Minimo de 8 caracteres",
      passwordLabel: "Senha",
      pending: "Entrando...",
      submit: "Entrar",
      title: "Retome o dia com controle.",
    },
    signup: {
      alternateCta: "Entrar",
      alternateHref: "/signin",
      alternateLabel: "Ja tem uma conta?",
      confirmPasswordLabel: "Confirmar senha",
      confirmPasswordPlaceholder: "Repita sua senha",
      currentPasswordPlaceholder: "Sua senha",
      description: "Crie a conta que mantem habitos, foco e treino em um so lugar.",
      emailLabel: "Email",
      emailPlaceholder: "voce@exemplo.com",
      eyebrow: "Comece gratis",
      formDescription: "Comece com um sistema diario e deixe o registro se acumular.",
      formEyebrow: "Configuracao segura",
      formTitle: "Crie sua conta",
      fullNameLabel: "Nome completo",
      fullNamePlaceholder: "Alex Silva",
      newPasswordPlaceholder: "Minimo de 8 caracteres",
      passwordLabel: "Senha",
      pending: "Criando conta...",
      submit: "Criar conta",
      title: "Construa seu sistema pessoal de execucao.",
    },
  },
};

