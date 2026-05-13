import {
  BarChart3,
  CheckSquare,
  Gift,
  Home,
  MessageCircleHeart,
  Utensils
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ScreenId = "home" | "player" | "emergency" | "support" | "progress" | "guide";
export type AudioCategory = "Receita" | "Agua" | "Doces" | "Bonus";

export interface NavigationItem {
  readonly id: ScreenId;
  readonly label: string;
  readonly icon: LucideIcon;
}

export interface ProtocolAudio {
  readonly id: string;
  readonly name: string;
  readonly category: AudioCategory;
  readonly duration: number;
  readonly bestMoment: string;
  readonly description: string;
}

export interface RoutineTemplate {
  readonly id: string;
  readonly label: string;
  readonly audioId: string;
  readonly goal: string;
}

export interface GuideModule {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly readingTime: string;
  readonly paragraphs: readonly string[];
}

export interface Milestone {
  readonly day: number;
  readonly title: string;
  readonly description: string;
}

export interface PlanDay {
  readonly day: number;
  readonly title: string;
  readonly objective: string;
  readonly task: string;
}

export const navigationItems: readonly NavigationItem[] = [
  { id: "home", label: "InÃ­cio", icon: Home },
  { id: "player", label: "Receita", icon: Utensils },
  { id: "emergency", label: "Check-in", icon: CheckSquare },
  { id: "support", label: "Suporte", icon: MessageCircleHeart },
  { id: "progress", label: "Progresso", icon: BarChart3 },
  { id: "guide", label: "BÃ´nus", icon: Gift }
];

export const audioLibrary: readonly ProtocolAudio[] = [
  {
    id: "receita-banana-principal",
    name: "Receita da Banana BariÃ¡trica",
    category: "Receita",
    duration: 9,
    bestMoment: "HorÃ¡rio recomendado",
    description: "Receita do dia ajustada ao perfil, rotina e objetivo."
  },
  {
    id: "agua-do-dia",
    name: "Meta de Ãgua",
    category: "Agua",
    duration: 2,
    bestMoment: "Ao longo do dia",
    description: "Controle simples de copos para apoiar leveza e rotina."
  },
  {
    id: "controle-doce",
    name: "Controle Vontade de Doce",
    category: "Doces",
    duration: 3,
    bestMoment: "Quando a vontade subir",
    description: "Protocolo rÃ¡pido: Ã¡gua, pausa de 3 minutos e escolha leve."
  },
  {
    id: "bonus-cardapio",
    name: "CardÃ¡pio Barriga Leve",
    category: "Bonus",
    duration: 5,
    bestMoment: "Planejamento da semana",
    description: "Ideias simples para acompanhar o plano sem complicaÃ§Ã£o."
  }
];

export const routineTemplates: readonly RoutineTemplate[] = [
  { id: "receita", label: "Receita", audioId: "receita-banana-principal", goal: "Fazer a receita do dia" },
  { id: "agua", label: "Ãgua", audioId: "agua-do-dia", goal: "Bater a meta de copos" },
  { id: "checkin", label: "Check-in", audioId: "receita-banana-principal", goal: "Registrar peso, fome e disposiÃ§Ã£o" },
  { id: "dica", label: "Dica", audioId: "bonus-cardapio", goal: "Ler a orientaÃ§Ã£o do dia" }
];

export const milestones: readonly Milestone[] = [
  { day: 1, title: "Primeiro passo", description: "Seu plano personalizado comeÃ§ou." },
  { day: 3, title: "Primeira sequÃªncia", description: "TrÃªs dias criam sensaÃ§Ã£o de progresso." },
  { day: 7, title: "Primeira revisÃ£o", description: "Hora de comparar sinais de leveza e constÃ¢ncia." },
  { day: 14, title: "Segunda revisÃ£o", description: "A rotina jÃ¡ tem dados reais para ajustar." },
  { day: 21, title: "Ciclo concluÃ­do", description: "RelatÃ³rio final e plano de continuidade." }
];

export const planDays: readonly PlanDay[] = [
  { day: 1, title: "ComeÃ§o simples", objective: "Iniciar sem perfeccionismo.", task: "Fazer receita + check-in." },
  { day: 2, title: "Menos confusÃ£o", objective: "Repetir o ritual.", task: "Marcar receita e Ã¡gua." },
  { day: 3, title: "Primeira microvitÃ³ria", objective: "Registrar sinais de leveza.", task: "Comparar inchaÃ§o." },
  { day: 4, title: "Ãgua e rotina", objective: "Melhorar hidrataÃ§Ã£o.", task: "Bater meta de copos." },
  { day: 5, title: "Vontade de doce", objective: "Identificar gatilhos.", task: "Usar protocolo de 3 minutos." },
  { day: 6, title: "Barriga e medidas", objective: "Registrar cintura.", task: "Atualizar medida." },
  { day: 7, title: "Primeira revisÃ£o", objective: "Ver evoluÃ§Ã£o semanal.", task: "Ler relatÃ³rio." },
  { day: 8, title: "Ajuste de constÃ¢ncia", objective: "Corrigir falhas.", task: "Plano mÃ­nimo." },
  { day: 9, title: "Ansiedade alimentar", objective: "Reduzir beliscos.", task: "Registrar fome." },
  { day: 10, title: "Sono e fome", objective: "Conectar sono e rotina.", task: "Registrar disposiÃ§Ã£o." },
  { day: 11, title: "ReforÃ§o do plano", objective: "Manter sequÃªncia.", task: "Receita + Ã¡gua." },
  { day: 12, title: "Roupa e autoestima", objective: "Registrar percepÃ§Ã£o corporal.", task: "Nota rÃ¡pida." },
  { day: 13, title: "Foco na barriga", objective: "ReforÃ§ar medidas.", task: "Atualizar cintura." },
  { day: 14, title: "Segunda revisÃ£o", objective: "RelatÃ³rio de 14 dias.", task: "Ver progresso." },
  { day: 15, title: "Anti-sanfona", objective: "Introduzir manutenÃ§Ã£o.", task: "Ler guia." },
  { day: 16, title: "Energia", objective: "Avaliar disposiÃ§Ã£o.", task: "Check-in completo." },
  { day: 17, title: "Ajuste final", objective: "Preparar Ãºltimos dias.", task: "Recalcular se preciso." },
  { day: 18, title: "PÃ³s-21", objective: "Apresentar continuidade.", task: "Ver plano pÃ³s-21." },
  { day: 19, title: "ManutenÃ§Ã£o", objective: "Reduzir medo de recomeÃ§ar.", task: "Plano mÃ­nimo." },
  { day: 20, title: "RevisÃ£o final", objective: "Consolidar evoluÃ§Ã£o.", task: "Atualizar fotos/medidas." },
  { day: 21, title: "Fechamento", objective: "Gerar relatÃ³rio final.", task: "Concluir ciclo." }
];

export const guideModules: readonly GuideModule[] = [
  {
    id: "cardapio",
    title: "Card\u00e1pio Barriga Leve",
    description: "Receitas simples para acompanhar o plano.",
    readingTime: "3 min",
    paragraphs: ["Use como apoio para facilitar escolhas.", "N\u00e3o precisa ser perfeito: organize o pr\u00f3ximo passo.", "A lista de compras reduz abandono."]
  },
  {
    id: "cha",
    title: "Ch\u00e1 Noturno Japon\u00eas",
    description: "Rotina leve para desinchar, reduzir beliscos e apoiar seu plano.",
    readingTime: "2 min",
    paragraphs: [
      "O Ch\u00e1 Noturno Japon\u00eas \u00e9 uma rotina simples para ajudar seu corpo a desacelerar, reduzir a vontade de beliscar e deixar sua noite mais leve.",
      "Ele combina ervas e especiarias usadas para apoiar digest\u00e3o, controle da vontade de doce, sensa\u00e7\u00e3o de leveza e organiza\u00e7\u00e3o da rotina alimentar.",
      "Esse ch\u00e1 funciona melhor quando voc\u00ea usa junto com sua Receita da Banana Bari\u00e1trica, bebe \u00e1gua, evita exageros \u00e0 noite e mant\u00e9m o check-in di\u00e1rio."
    ]
  },
  {
    id: "sanfona",
    title: "Guia Anti-Efeito Sanfona",
    description: "Como continuar depois dos 21 dias.",
    readingTime: "8 min",
    paragraphs: ["A manuten\u00e7\u00e3o come\u00e7a com const\u00e2ncia pequena.", "Repetir o b\u00e1sico evita o ciclo come\u00e7a-e-para.", "No dia 18, o app apresenta o plano p\u00f3s-21."]
  },
  {
    id: "doces",
    title: "Guia Vontade de Doce",
    description: "Estrat\u00e9gias simples para reduzir beliscos.",
    readingTime: "2 min",
    paragraphs: ["Quando a vontade subir, fa\u00e7a \u00e1gua + pausa.", "Observe hor\u00e1rio e gatilho.", "Registrar o padr\u00e3o j\u00e1 \u00e9 progresso."]
  },
  {
    id: "movimento",
    title: "Movimento Leve em Casa",
    description: "Rotina iniciante de 5 a 7 minutos.",
    readingTime: "7 min",
    paragraphs: ["Movimento leve deve caber na rotina.", "Sem equipamentos e sem cobran\u00e7a pesada.", "A meta \u00e9 const\u00e2ncia, n\u00e3o intensidade."]
  }
];

export const helpOptions = [
  "NÃ£o consegui acessar meu plano",
  "NÃ£o entendi a receita",
  "NÃ£o consegui fazer hoje",
  "NÃ£o vi resultado ainda",
  "Estou sem constÃ¢ncia",
  "Quero falar com suporte",
  "Quero entender minha garantia"
] as const;

export const upsells = [
  { title: "Acompanhamento VIP Banana", price: "R$ 47 a R$ 97", trigger: "Se quiser ajuda nos primeiros 30 dias." },
  { title: "CardÃ¡pio Barriga Leve", price: "R$ 27 a R$ 47", trigger: "Para facilitar refeiÃ§Ãµes e lista de compras." },
  { title: "Movimento Leve 7 Minutos", price: "R$ 27 a R$ 57", trigger: "Para sedentÃ¡rias que querem comeÃ§ar sem pressÃ£o." },
  { title: "Plano PÃ³s-21 Anti-Sanfona", price: "R$ 47 a R$ 97", trigger: "Continuidade depois do ciclo." }
] as const;

export const waveBars = [16, 28, 42, 30, 60, 38, 72, 48, 24, 46, 68, 80, 52, 34, 66, 76, 44, 28, 58, 72, 82];
