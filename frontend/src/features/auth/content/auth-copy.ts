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
      description: "Return to a single operating layer for habits, focus, and training momentum.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      eyebrow: "Welcome back",
      forgotPassword: "Forgot password?",
      formDescription: "Use your email and password to return to your execution system.",
      formEyebrow: "Secure access",
      formTitle: "Sign in to Coreflow",
      fullNameLabel: "Full name",
      fullNamePlaceholder: "Alex Johnson",
      newPasswordPlaceholder: "At least 6 characters",
      passwordLabel: "Password",
      pending: "Signing in...",
      submit: "Sign in",
      title: "Continue the system you are building.",
    },
    signup: {
      alternateCta: "Sign in",
      alternateHref: "/signin",
      alternateLabel: "Already have an account?",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Repeat your password",
      currentPasswordPlaceholder: "Your password",
      description: "Create the account that will hold your habits first, then your focus and training history as Coreflow expands.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      eyebrow: "Start free",
      formDescription: "Start with habits today, then keep your focus and training history in the same system.",
      formEyebrow: "Secure setup",
      formTitle: "Create your account",
      fullNameLabel: "Full name",
      fullNamePlaceholder: "Alex Johnson",
      newPasswordPlaceholder: "At least 6 characters",
      passwordLabel: "Password",
      pending: "Creating account...",
      submit: "Create account",
      title: "Build one place for daily execution.",
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
      description: "Volte para uma camada unica de execucao para habitos, foco e ritmo de treino.",
      emailLabel: "Email",
      emailPlaceholder: "voce@exemplo.com",
      eyebrow: "Bem-vindo de volta",
      forgotPassword: "Esqueceu a senha?",
      formDescription: "Use email e senha para voltar ao seu sistema de execucao.",
      formEyebrow: "Acesso seguro",
      formTitle: "Entrar no Coreflow",
      fullNameLabel: "Nome completo",
      fullNamePlaceholder: "Alex Silva",
      newPasswordPlaceholder: "Minimo de 6 caracteres",
      passwordLabel: "Senha",
      pending: "Entrando...",
      submit: "Entrar",
      title: "Continue o sistema que voce esta construindo.",
    },
    signup: {
      alternateCta: "Entrar",
      alternateHref: "/signin",
      alternateLabel: "Ja tem uma conta?",
      confirmPasswordLabel: "Confirmar senha",
      confirmPasswordPlaceholder: "Repita sua senha",
      currentPasswordPlaceholder: "Sua senha",
      description: "Crie a conta que vai guardar seus habitos primeiro e, depois, seu historico de foco e treino.",
      emailLabel: "Email",
      emailPlaceholder: "voce@exemplo.com",
      eyebrow: "Comece gratis",
      formDescription: "Comece com habitos hoje e mantenha foco e treino no mesmo sistema.",
      formEyebrow: "Configuracao segura",
      formTitle: "Crie sua conta",
      fullNameLabel: "Nome completo",
      fullNamePlaceholder: "Alex Silva",
      newPasswordPlaceholder: "Minimo de 6 caracteres",
      passwordLabel: "Senha",
      pending: "Criando conta...",
      submit: "Criar conta",
      title: "Construa um lugar para a execucao diaria.",
    },
  },
};

