import { audioLibrary, routineTemplates, type AudioCategory, type ProtocolAudio } from "../data/protocolData";

export const STORAGE_KEY = "bananaAppState";

export interface UserProfile {
  readonly name: string;
  readonly age: number;
  readonly height: number;
  readonly currentWeight: number;
  readonly goalWeight: number;
  readonly mainGoal: string;
  readonly fatArea: string;
  readonly bloating: string;
  readonly mainDifficulty: string;
  readonly triedBefore: readonly string[];
  readonly routine: string;
  readonly activityLevel: string;
  readonly waterCups: string;
  readonly preferredTime: string;
  readonly sweetCraving: string;
  readonly sleep: string;
  readonly wantsReminders: string;
  readonly profileName: string;
}

export interface SessionRecord {
  readonly id: string;
  readonly date: string;
  readonly audioId: string;
  readonly audioName: string;
  readonly category: AudioCategory;
  readonly duration: number;
  readonly completed: boolean;
  readonly startedAt: string;
  readonly completedAt: string;
}

export interface CheckInRecord {
  readonly id: string;
  readonly date: string;
  readonly audioId: string;
  readonly audioName: string;
  readonly category: AudioCategory;
  readonly duration: number;
  readonly madeRecipe: boolean;
  readonly waterCups: number;
  readonly bloatingScore: number;
  readonly sweetCravingScore: number;
  readonly hungerScore: number;
  readonly energyScore: number;
  readonly weight: number | null;
  readonly waist: number | null;
  readonly note: string;
  readonly tags: readonly string[];
}

export interface EmergencyUse {
  readonly id: string;
  readonly date: string;
  readonly reason: string;
  readonly audioId: string;
  readonly audioName: string;
  readonly result: string;
}

export interface RoutineSettings {
  readonly enabled: Record<string, boolean>;
}

export interface ReminderSettings {
  readonly dailySessionEnabled: boolean;
  readonly dailySessionTime: string;
  readonly nightReminderEnabled: boolean;
  readonly nightReminderTime: string;
  readonly checkInReminderEnabled: boolean;
  readonly missedDayReminderEnabled: boolean;
}

export interface AccessibilitySettings {
  readonly largerText: boolean;
  readonly highContrast: boolean;
  readonly reduceMotion: boolean;
}

export interface OndaTeslaState {
  readonly onboardingCompleted: boolean;
  readonly onboardingUserId: string | null;
  readonly userProfile: UserProfile | null;
  readonly journeyStartDate: string;
  readonly sessions: readonly SessionRecord[];
  readonly checkIns: readonly CheckInRecord[];
  readonly emergencyUses: readonly EmergencyUse[];
  readonly completedGuides: readonly string[];
  readonly routineSettings: RoutineSettings;
  readonly routineCompletions: Record<string, readonly string[]>;
  readonly reminderSettings: ReminderSettings;
  readonly accessibilitySettings: AccessibilitySettings;
  readonly milestonesViewed: readonly number[];
  readonly audioUsage: Record<string, number>;
  readonly photos: readonly string[];
  readonly adminMode: boolean;
}

export interface CheckInInput {
  readonly madeRecipe: boolean;
  readonly waterCups: number;
  readonly bloatingScore: number;
  readonly sweetCravingScore: number;
  readonly hungerScore: number;
  readonly energyScore: number;
  readonly weight: number | null;
  readonly waist: number | null;
  readonly note: string;
  readonly tags: readonly string[];
}

export const defaultState: OndaTeslaState = {
  onboardingCompleted: false,
  onboardingUserId: null,
  userProfile: null,
  journeyStartDate: todayKey(),
  sessions: [],
  checkIns: [],
  emergencyUses: [],
  completedGuides: [],
  routineSettings: {
    enabled: Object.fromEntries(routineTemplates.map((item) => [item.id, true]))
  },
  routineCompletions: {},
  reminderSettings: {
    dailySessionEnabled: true,
    dailySessionTime: "08:00",
    nightReminderEnabled: false,
    nightReminderTime: "20:30",
    checkInReminderEnabled: true,
    missedDayReminderEnabled: true
  },
  accessibilitySettings: {
    largerText: false,
    highContrast: false,
    reduceMotion: false
  },
  milestonesViewed: [],
  audioUsage: {},
  photos: [],
  adminMode: false
};

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadOndaTeslaState(): OndaTeslaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch {
    return defaultState;
  }
  return defaultState;
}

export function saveOndaTeslaState(state: OndaTeslaState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function normalizeState(partial: Partial<OndaTeslaState>): OndaTeslaState {
  return {
    ...defaultState,
    ...partial,
    routineSettings: {
      enabled: {
        ...defaultState.routineSettings.enabled,
        ...(partial.routineSettings?.enabled ?? {})
      }
    },
    reminderSettings: {
      ...defaultState.reminderSettings,
      ...(partial.reminderSettings ?? {})
    },
    accessibilitySettings: {
      ...defaultState.accessibilitySettings,
      ...(partial.accessibilitySettings ?? {})
    },
    audioUsage: {
      ...(partial.audioUsage ?? {})
    }
  };
}

export function audioById(id: string): ProtocolAudio {
  return audioLibrary.find((audio) => audio.id === id) ?? audioLibrary[0];
}

export function generateProfileName(profile: Omit<UserProfile, "profileName">): string {
  if (profile.mainDifficulty === "Vontade de doce" || profile.sweetCraving === "Sim, todo dia") {
    return "Ansiedade alimentar + vontade de doce";
  }
  if (profile.mainDifficulty === "Não tenho constância" || profile.mainGoal === "Sair do efeito sanfona") {
    return "Efeito sanfona + baixa constância";
  }
  if (profile.routine === "Muito corrida") {
    return "Rotina corrida + metabolismo lento percebido";
  }
  if (profile.activityLevel === "Sedentária" || profile.bloating === "Todos os dias") {
    return "Sedentarismo + retenção";
  }
  return "Barriga resistente + inchaço frequente";
}

export function dayNumber(startDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const now = new Date(`${todayKey()}T00:00:00`);
  const diff = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return Math.min(21, Math.max(1, diff + 1));
}

export function completedToday(state: OndaTeslaState, audioId = "receita-banana-principal") {
  const today = todayKey();
  return state.sessions.some((session) => session.completed && session.audioId === audioId && session.date === today);
}

export function getCurrentStreak(state: OndaTeslaState) {
  const dates = new Set(state.sessions.filter((session) => session.completed && session.audioId === "receita-banana-principal").map((session) => session.date));
  let streak = 0;
  const cursor = new Date(`${todayKey()}T00:00:00`);
  while (dates.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function average(values: readonly number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function lastNDays(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return todayKey(date);
  });
}

export function metricsFromState(state: OndaTeslaState) {
  const completed = state.sessions.filter((session) => session.completed);
  const checkIns = state.checkIns;
  const usageEntries = Object.entries(state.audioUsage).sort((a, b) => b[1] - a[1]);
  const mostUsed = usageEntries[0] ? audioById(usageEntries[0][0]).name : "Nenhum ainda";
  const firstWeight = firstNumber(checkIns.map((item) => item.weight));
  const lastWeight = lastNumber(checkIns.map((item) => item.weight));
  const firstWaist = firstNumber(checkIns.map((item) => item.waist));
  const lastWaist = lastNumber(checkIns.map((item) => item.waist));
  return {
    totalSessions: completed.length,
    totalMinutes: completed.reduce((sum, session) => sum + session.duration, 0),
    currentStreak: getCurrentStreak(state),
    weeklyConsistency: new Set(completed.slice(-7).map((session) => session.date)).size,
    averageTinnitusScore: average(checkIns.map((item) => item.bloatingScore)),
    averageClarityScore: average(checkIns.map((item) => item.energyScore)),
    averageCalmScore: average(checkIns.map((item) => item.sweetCravingScore)),
    averageSleepScore: average(checkIns.map((item) => item.hungerScore)),
    emergencyUses: state.emergencyUses.length,
    mostUsedAudio: mostUsed,
    initialWeight: firstWeight,
    currentWeight: lastWeight,
    weightDiff: firstWeight !== null && lastWeight !== null ? lastWeight - firstWeight : null,
    initialWaist: firstWaist,
    currentWaist: lastWaist,
    waistDiff: firstWaist !== null && lastWaist !== null ? lastWaist - firstWaist : null,
    waterAverage: average(checkIns.map((item) => item.waterCups))
  };
}

export function addCompletedSession(state: OndaTeslaState, audio: ProtocolAudio, checkIn: CheckInInput): OndaTeslaState {
  const now = new Date().toISOString();
  const date = todayKey();
  const session: SessionRecord = {
    id: makeId("session"),
    date,
    audioId: audio.id,
    audioName: audio.name,
    category: audio.category,
    duration: audio.duration,
    completed: true,
    startedAt: now,
    completedAt: now
  };
  const record: CheckInRecord = {
    id: makeId("check"),
    date,
    audioId: audio.id,
    audioName: audio.name,
    category: audio.category,
    duration: audio.duration,
    ...checkIn
  };
  return {
    ...state,
    sessions: [...state.sessions, session],
    checkIns: [...state.checkIns, record],
    audioUsage: {
      ...state.audioUsage,
      [audio.id]: (state.audioUsage[audio.id] ?? 0) + 1
    }
  };
}

export function markRoutineDone(state: OndaTeslaState, routineId: string): OndaTeslaState {
  const today = todayKey();
  const current = state.routineCompletions[today] ?? [];
  if (current.includes(routineId)) return state;
  return {
    ...state,
    routineCompletions: {
      ...state.routineCompletions,
      [today]: [...current, routineId]
    }
  };
}

function firstNumber(values: readonly (number | null)[]) {
  return values.find((value): value is number => typeof value === "number") ?? null;
}

function lastNumber(values: readonly (number | null)[]) {
  return [...values].reverse().find((value): value is number => typeof value === "number") ?? null;
}
