import {
  BarChart3,
  CheckSquare,
  Gift,
  Home,
  Utensils
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ScreenId = "home" | "player" | "emergency" | "progress" | "guide";
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
  { id: "home", label: "Início", icon: Home },
  { id: "player", label: "Receita", icon: Utensils },
  { id: "emergency", label: "Check-in", icon: CheckSquare },
  { id: "progress", label: "Progresso", icon: BarChart3 },
  { id: "guide", label: "Bônus", icon: Gift }
];

export const audioLibrary: readonly ProtocolAudio[] = [
  {
    id: "receita-banana-principal",
    name: "Receita da Banana Bariátrica",
    category: "Receita",
    duration: 9,
    bestMoment: "Horário recomendado",
    description: "Receita do dia ajustada ao perfil, rotina e objetivo."
  },
  {
    id: "agua-do-dia",
    name: "Meta de Água",
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
    description: "Protocolo rápido: água, pausa de 3 minutos e escolha leve."
  },
  {
    id: "bonus-cardapio",
    name: "Cardápio Barriga Leve",
    category: "Bonus",
    duration: 5,
    bestMoment: "Planejamento da semana",
    description: "Ideias simples para acompanhar o plano sem complicação."
  }
];

export const routineTemplates: readonly RoutineTemplate[] = [
  { id: "receita", label: "Receita", audioId: "receita-banana-principal", goal: "Fazer a receita do dia" },
  { id: "agua", label: "Água", audioId: "agua-do-dia", goal: "Bater a meta de copos" },
  { id: "checkin", label: "Check-in", audioId: "receita-banana-principal", goal: "Registrar peso, fome e disposição" },
  { id: "dica", label: "Dica", audioId: "bonus-cardapio", goal: "Ler a orientação do dia" }
];

export const milestones: readonly Milestone[] = [
  { day: 1, title: "Primeiro passo", description: "Seu plano personalizado começou." },
  { day: 3, title: "Primeira sequência", description: "Três dias criam sensação de progresso." },
  { day: 7, title: "Primeira revisão", description: "Hora de comparar sinais de leveza e constância." },
  { day: 14, title: "Segunda revisão", description: "A rotina já tem dados reais para ajustar." },
  { day: 21, title: "Ciclo concluído", description: "Relatório final e plano de continuidade." }
];

export const planDays: readonly PlanDay[] = [
  { day: 1, title: "Começo simples", objective: "Iniciar sem perfeccionismo.", task: "Fazer receita + check-in." },
  { day: 2, title: "Menos confusão", objective: "Repetir o ritual.", task: "Marcar receita e água." },
  { day: 3, title: "Primeira microvitória", objective: "Registrar sinais de leveza.", task: "Comparar inchaço." },
  { day: 4, title: "Água e rotina", objective: "Melhorar hidratação.", task: "Bater meta de copos." },
  { day: 5, title: "Vontade de doce", objective: "Identificar gatilhos.", task: "Usar protocolo de 3 minutos." },
  { day: 6, title: "Barriga e medidas", objective: "Registrar cintura.", task: "Atualizar medida." },
  { day: 7, title: "Primeira revisão", objective: "Ver evolução semanal.", task: "Ler relatório." },
  { day: 8, title: "Ajuste de constância", objective: "Corrigir falhas.", task: "Plano mínimo." },
  { day: 9, title: "Ansiedade alimentar", objective: "Reduzir beliscos.", task: "Registrar fome." },
  { day: 10, title: "Sono e fome", objective: "Conectar sono e rotina.", task: "Registrar disposição." },
  { day: 11, title: "Reforço do plano", objective: "Manter sequência.", task: "Receita + água." },
  { day: 12, title: "Roupa e autoestima", objective: "Registrar percepção corporal.", task: "Nota rápida." },
  { day: 13, title: "Foco na barriga", objective: "Reforçar medidas.", task: "Atualizar cintura." },
  { day: 14, title: "Segunda revisão", objective: "Relatório de 14 dias.", task: "Ver progresso." },
  { day: 15, title: "Anti-sanfona", objective: "Introduzir manutenção.", task: "Ler guia." },
  { day: 16, title: "Energia", objective: "Avaliar disposição.", task: "Check-in completo." },
  { day: 17, title: "Ajuste final", objective: "Preparar últimos dias.", task: "Recalcular se preciso." },
  { day: 18, title: "Pós-21", objective: "Apresentar continuidade.", task: "Ver plano pós-21." },
  { day: 19, title: "Manutenção", objective: "Reduzir medo de recomeçar.", task: "Plano mínimo." },
  { day: 20, title: "Revisão final", objective: "Consolidar evolução.", task: "Atualizar fotos/medidas." },
  { day: 21, title: "Fechamento", objective: "Gerar relatório final.", task: "Concluir ciclo." }
];

export const guideModules: readonly GuideModule[] = [
  {
    id: "cardapio",
    title: "Cardápio Barriga Leve",
    description: "Receitas simples para acompanhar o plano.",
    readingTime: "3 min",
    paragraphs: ["Use como apoio para facilitar escolhas.", "Não precisa ser perfeito: organize o próximo passo.", "A lista de compras reduz abandono."]
  },
  {
    id: "cha",
    title: "Chá Noturno Japonês",
    description: "Rotina leve para desinchar, reduzir beliscos e apoiar seu plano.",
    readingTime: "2 min",
    paragraphs: [
      "O Chá Noturno Japonês é uma rotina simples para ajudar seu corpo a desacelerar, reduzir a vontade de beliscar e deixar sua noite mais leve.",
      "Ele combina ervas e especiarias usadas para apoiar digestão, controle da vontade de doce, sensação de leveza e organização da rotina alimentar.",
      "Esse chá funciona melhor quando você usa junto com sua Receita da Banana Bariátrica, bebe água, evita exageros à noite e mantém o check-in diário."
    ]
  },
  {
    id: "sanfona",
    title: "Guia Anti-Efeito Sanfona",
    description: "Como continuar depois dos 21 dias.",
    readingTime: "4 min",
    paragraphs: ["A manutenção começa com constância pequena.", "Repetir o básico evita o ciclo começa-e-para.", "No dia 18, o app apresenta o plano pós-21."]
  },
  {
    id: "doces",
    title: "Guia Vontade de Doce",
    description: "Estratégias simples para reduzir beliscos.",
    readingTime: "2 min",
    paragraphs: ["Quando a vontade subir, faça água + pausa.", "Observe horário e gatilho.", "Registrar o padrão já é progresso."]
  },
  {
    id: "movimento",
    title: "Movimento Leve em Casa",
    description: "Rotina iniciante de 5 a 7 minutos.",
    readingTime: "3 min",
    paragraphs: ["Movimento leve deve caber na rotina.", "Sem equipamentos e sem cobrança pesada.", "A meta é constância, não intensidade."]
  }
];

export const helpOptions = [
  "Não consegui acessar meu plano",
  "Não entendi a receita",
  "Não consegui fazer hoje",
  "Não vi resultado ainda",
  "Estou sem constância",
  "Quero falar com suporte",
  "Quero entender minha garantia"
] as const;

export const upsells = [
  { title: "Acompanhamento VIP Banana", price: "R$ 47 a R$ 97", trigger: "Se quiser ajuda nos primeiros 30 dias." },
  { title: "Cardápio Barriga Leve", price: "R$ 27 a R$ 47", trigger: "Para facilitar refeições e lista de compras." },
  { title: "Movimento Leve 7 Minutos", price: "R$ 27 a R$ 57", trigger: "Para sedentárias que querem começar sem pressão." },
  { title: "Plano Pós-21 Anti-Sanfona", price: "R$ 47 a R$ 97", trigger: "Continuidade depois do ciclo." }
] as const;

export const waveBars = [16, 28, 42, 30, 60, 38, 72, 48, 24, 46, 68, 80, 52, 34, 66, 76, 44, 28, 58, 72, 82];
