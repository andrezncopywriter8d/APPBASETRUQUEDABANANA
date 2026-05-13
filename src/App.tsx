import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { EmergencyScreen } from "./components/EmergencyScreen";
import { GuideScreen } from "./components/GuideScreen";
import { HomeScreen } from "./components/HomeScreen";
import { LoginScreen } from "./components/LoginScreen";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { PlayerScreen } from "./components/PlayerScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { SettingsSheet } from "./components/SettingsSheet";
import { SupportScreen } from "./components/SupportScreen";
import { audioLibrary, type ProtocolAudio, type ScreenId } from "./data/protocolData";
import {
  addCompletedSession,
  defaultState,
  loadOndaTeslaState,
  markRoutineDone,
  saveOndaTeslaState,
  todayKey,
  type CheckInInput,
  type OndaTeslaState,
  type UserProfile
} from "./state/ondaTeslaState";
import { clearAuthSession, loadAuthSession, type AuthSession } from "./state/authState";

export interface PlayerSource {
  readonly kind: "main" | "routine" | "library" | "emergency";
  readonly reason?: string;
  readonly routineId?: string;
}

export function App() {
  const [appState, setAppState] = useState<OndaTeslaState>(() => loadOndaTeslaState());
  const [activeScreen, setActiveScreen] = useState<ScreenId>("home");
  const [selectedAudio, setSelectedAudio] = useState<ProtocolAudio>(audioLibrary[0]);
  const [playerSource, setPlayerSource] = useState<PlayerSource>({ kind: "main" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => loadAuthSession());

  useEffect(() => {
    saveOndaTeslaState(appState);
    document.documentElement.classList.toggle("large-text", appState.accessibilitySettings.largerText);
    document.documentElement.classList.toggle("high-contrast", appState.accessibilitySettings.highContrast);
    document.documentElement.classList.toggle("reduce-motion", appState.accessibilitySettings.reduceMotion);
  }, [appState]);

  const hasOnboarding = appState.onboardingCompleted
    && appState.userProfile
    && appState.onboardingUserId === authSession?.userId;

  const context = useMemo(() => ({
    state: appState,
    setState: setAppState,
    openAudio,
    openScreen,
    openSettings: () => setSettingsOpen(true)
  }), [appState]);

  function openScreen(screen: ScreenId) {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function openAudio(audio: ProtocolAudio, source: PlayerSource = { kind: "library" }) {
    setSelectedAudio(audio);
    setPlayerSource(source);
    openScreen("player");
  }

  function completeOnboarding(profile: UserProfile) {
    setAppState((current) => ({
      ...current,
      onboardingCompleted: true,
      onboardingUserId: authSession?.userId ?? null,
      userProfile: profile,
      journeyStartDate: current.journeyStartDate || todayKey()
    }));
  }

  function completeAudio(checkIn: CheckInInput, emergencyResult?: string) {
    setAppState((current) => {
      let next = addCompletedSession(current, selectedAudio, checkIn);
      if (playerSource.routineId) {
        next = markRoutineDone(next, playerSource.routineId);
      }
      if (selectedAudio.id === "receita-banana-principal") {
        next = markRoutineDone(next, "receita");
      }
      return next;
    });
  }

  function saveDailyCheckIn(checkIn: CheckInInput) {
    const recipe = audioLibrary[0];
    setSelectedAudio(recipe);
    setPlayerSource({ kind: "main" });
    setAppState((current) => {
      let next = addCompletedSession(current, recipe, checkIn);
      next = markRoutineDone(next, "checkin");
      if (checkIn.madeRecipe) next = markRoutineDone(next, "receita");
      return next;
    });
  }

  function resetAllData() {
    setAppState({ ...defaultState, journeyStartDate: todayKey() });
    localStorage.removeItem("bananaAppState");
  }

  function logout() {
    clearAuthSession();
    setAuthSession(null);
    setSettingsOpen(false);
  }

  if (!authSession) {
    return <LoginScreen onAuthenticated={setAuthSession} />;
  }

  if (!hasOnboarding) {
    return (
      <main className="app-shell">
        <div className="status-glow" />
        <OnboardingFlow onComplete={completeOnboarding} />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="status-glow" />
      <HomeScreen {...context} active={activeScreen === "home"} />
      <PlayerScreen
        active={activeScreen === "player"}
        audio={selectedAudio}
        journeyStartDate={appState.journeyStartDate}
        source={playerSource}
        onComplete={completeAudio}
      />
      <EmergencyScreen
        active={activeScreen === "emergency"}
        state={appState}
        onSaveCheckIn={saveDailyCheckIn}
      />
      <SupportScreen active={activeScreen === "support"} state={appState} />
      <ProgressScreen active={activeScreen === "progress"} state={appState} />
      <GuideScreen
        active={activeScreen === "guide"}
        state={appState}
        setState={setAppState}
        openAudio={openAudio}
        openSettings={() => setSettingsOpen(true)}
      />
      <SettingsSheet
        authSession={authSession}
        open={settingsOpen}
        state={appState}
        setState={setAppState}
        onClose={() => setSettingsOpen(false)}
        onLogout={logout}
        onResetAll={resetAllData}
      />
      <BottomNav activeScreen={activeScreen} openScreen={openScreen} />
    </main>
  );
}
