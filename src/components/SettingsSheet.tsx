import type { Dispatch, SetStateAction } from "react";
import { Download, LogOut, ShieldCheck, Trash2, X } from "lucide-react";
import { todayKey, type OndaTeslaState } from "../state/ondaTeslaState";
import type { AuthSession } from "../state/authState";

interface SettingsSheetProps {
  readonly authSession: AuthSession;
  readonly open: boolean;
  readonly state: OndaTeslaState;
  readonly setState: Dispatch<SetStateAction<OndaTeslaState>>;
  readonly onClose: () => void;
  readonly onLogout: () => void;
  readonly onResetAll: () => void;
}

export function SettingsSheet({ authSession, onClose, onLogout, onResetAll, open, setState, state }: SettingsSheetProps) {
  function updateReminder(key: keyof OndaTeslaState["reminderSettings"], value: boolean | string) {
    setState((current) => ({ ...current, reminderSettings: { ...current.reminderSettings, [key]: value } }));
  }

  function updateAccessibility(key: keyof OndaTeslaState["accessibilitySettings"], value: boolean) {
    setState((current) => ({ ...current, accessibilitySettings: { ...current.accessibilitySettings, [key]: value } }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `banana-app-progresso-${todayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetOnboarding() {
    setState((current) => ({ ...current, onboardingCompleted: false, onboardingUserId: null, userProfile: null }));
    onClose();
  }

  function resetProgress() {
    if (window.confirm("Restabelecer progresso local? Isto apaga sessões, check-ins e dados deste navegador.")) {
      setState((current) => ({
        ...current,
        sessions: [],
        checkIns: [],
        emergencyUses: [],
        routineCompletions: {},
        audioUsage: {},
        journeyStartDate: todayKey()
      }));
    }
  }

  function clearAll() {
    if (window.confirm("Apagar todos os dados locais do Banana App neste navegador?")) onResetAll();
  }

  return (
    <div className={`protocol-modal settings-modal ${open ? "show" : ""}`}>
      <div className="protocol-modal-panel settings-panel">
        <div className="protocol-modal-head">
          <div><h3>Ajustes</h3><p>Perfil, lembretes, acessibilidade e dados locais.</p></div>
          <button className="protocol-close-btn" type="button" onClick={onClose}><X size={18} /></button>
        </div>

        <section className="settings-section">
          <h4>Conta</h4>
          <p>{authSession.name}</p>
          <small>{authSession.email}</small>
          <button className="protocol-secondary full" type="button" onClick={onLogout}><LogOut size={17} /> Sair da conta</button>
        </section>

        <section className="settings-section">
          <h4>Perfil Banana</h4>
          <p>{state.userProfile?.profileName ?? "Perfil ainda não definido"}</p>
          {state.userProfile ? <small>{state.userProfile.currentWeight}kg → {state.userProfile.goalWeight}kg · {state.userProfile.preferredTime}</small> : null}
          <button className="protocol-secondary full" type="button" onClick={resetOnboarding}>Recalcular meu plano</button>
        </section>

        <section className="settings-section">
          <h4>Plano</h4>
          <label>Início da jornada<input type="date" value={state.journeyStartDate} onChange={(event) => setState((current) => ({ ...current, journeyStartDate: event.target.value || todayKey() }))} /></label>
          <label>Horário preferido<input type="time" value={state.reminderSettings.dailySessionTime} onChange={(event) => updateReminder("dailySessionTime", event.target.value)} /></label>
        </section>

        <section className="settings-section">
          <h4>Lembretes</h4>
          <Toggle label="Lembrete da receita" checked={state.reminderSettings.dailySessionEnabled} onChange={(value) => updateReminder("dailySessionEnabled", value)} />
          <label>Horário da receita<input type="time" value={state.reminderSettings.dailySessionTime} onChange={(event) => updateReminder("dailySessionTime", event.target.value)} /></label>
          <Toggle label="Lembrete noturno" checked={state.reminderSettings.nightReminderEnabled} onChange={(value) => updateReminder("nightReminderEnabled", value)} />
          <label>Horário noturno<input type="time" value={state.reminderSettings.nightReminderTime} onChange={(event) => updateReminder("nightReminderTime", event.target.value)} /></label>
          <Toggle label="Lembrete se eu perder um dia" checked={state.reminderSettings.missedDayReminderEnabled} onChange={(value) => updateReminder("missedDayReminderEnabled", value)} />
          <small>Lembretes reais dependem das permissões do navegador.</small>
        </section>

        <section className="settings-section">
          <h4>Acessibilidade</h4>
          <Toggle label="Texto maior" checked={state.accessibilitySettings.largerText} onChange={(value) => updateAccessibility("largerText", value)} />
          <Toggle label="Alto contraste" checked={state.accessibilitySettings.highContrast} onChange={(value) => updateAccessibility("highContrast", value)} />
          <Toggle label="Reduzir movimento" checked={state.accessibilitySettings.reduceMotion} onChange={(value) => updateAccessibility("reduceMotion", value)} />
        </section>

        <section className="settings-section">
          <h4>Dados</h4>
          <button className="protocol-secondary full" type="button" onClick={exportData}><Download size={17} /> Exportar JSON</button>
          <button className="protocol-secondary full danger" type="button" onClick={resetProgress}><Trash2 size={17} /> Restabelecer progresso</button>
          <button className="protocol-secondary full danger" type="button" onClick={clearAll}>Apagar tudo</button>
        </section>

        <section className="settings-section trust-card">
          <ShieldCheck size={18} />
          <div><strong>Uso responsável</strong><p>Resultados variam. O app ajuda você a seguir uma rotina organizada, mas sua constância é essencial. Procure orientação profissional para questões de saúde.</p></div>
        </section>
      </div>
    </div>
  );
}

function Toggle({ checked, label, onChange }: { readonly checked: boolean; readonly label: string; readonly onChange: (checked: boolean) => void }) {
  return (
    <label className="settings-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
