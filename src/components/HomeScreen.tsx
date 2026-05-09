import {
  BarChart3,
  Calendar,
  Check,
  CheckSquare,
  ChevronRight,
  Clock,
  Droplets,
  Flame,
  Gift,
  Heart,
  Home,
  ListChecks,
  Menu,
  Soup,
  Sprout,
  UserRound,
  Utensils
} from "lucide-react";
import type { CSSProperties, Dispatch, ReactNode, SetStateAction } from "react";
import { audioById, completedToday, dayNumber, metricsFromState, todayKey, type OndaTeslaState } from "../state/ondaTeslaState";
import { audioLibrary, routineTemplates, type ProtocolAudio, type ScreenId } from "../data/protocolData";

interface HomeScreenProps {
  readonly active: boolean;
  readonly state: OndaTeslaState;
  readonly setState: Dispatch<SetStateAction<OndaTeslaState>>;
  readonly openAudio: (audio: ProtocolAudio, source?: { kind: "main" | "routine" | "library" | "emergency"; reason?: string; routineId?: string }) => void;
  readonly openScreen: (screen: ScreenId) => void;
  readonly openSettings: () => void;
}

const checklist = [
  { id: "receita", title: "Receita", subtitle: "Preparar a receita personalizada", screen: "player" as ScreenId },
  { id: "agua", title: "Água", subtitle: "Registrar sua água do dia", screen: "emergency" as ScreenId },
  { id: "checkin", title: "Check-in", subtitle: "Como seu corpo está hoje?", screen: "emergency" as ScreenId },
  { id: "dica", title: "Dica do dia", subtitle: "Ver orientação personalizada", screen: "guide" as ScreenId }
];

export function HomeScreen({ active, state, setState, openAudio, openScreen, openSettings }: HomeScreenProps) {
  const metrics = metricsFromState(state);
  const journeyDay = Math.min(dayNumber(state.journeyStartDate), 21);
  const recipeDone = completedToday(state);
  const doneToday = state.routineCompletions[todayKey()] ?? [];
  const routineDone = routineTemplates.filter((item) => doneToday.includes(item.id) || (item.id === "receita" && recipeDone)).length;
  const percent = Math.round((routineDone / routineTemplates.length) * 100);
  const profile = state.userProfile?.profileName || "Ansiedade alimentar + vontade de doce";
  const firstName = state.userProfile?.name?.split(" ")[0] || "André";
  const water = Math.round(metrics.waterAverage ?? 0);

  function markDone(id: string) {
    setState((current) => {
      const today = todayKey();
      const list = current.routineCompletions[today] ?? [];
      if (list.includes(id)) return current;
      return { ...current, routineCompletions: { ...current.routineCompletions, [today]: [...list, id] } };
    });
  }

  return (
    <section className={`screen home-protocol banana-home-v2 ${active ? "active" : ""}`}>
      <header className="banana-home-topbar">
        <button className="banana-round-btn" type="button" aria-label="Abrir bônus" onClick={() => openScreen("guide")}>
          <Menu size={24} />
        </button>
        <div className="banana-home-brand">
          <strong><span>🍌</span> Banana App</strong>
          <small>Plano de 21 dias</small>
        </div>
        <button className="banana-round-btn" type="button" aria-label="Abrir perfil" onClick={openSettings}>
          <UserRound size={24} />
        </button>
      </header>

      <section className="banana-home-greeting">
        <h1>Olá, {firstName}</h1>
        <p>Dia {journeyDay} de 21. Hoje você só precisa completar o próximo passo.</p>
        <span><Sprout size={16} /> Perfil: <strong>{profile}</strong></span>
      </section>

      <section className="banana-main-recipe-card">
        <div className="banana-recipe-content">
          <div className="banana-recipe-copy">
            <h2>Sua Receita da Banana Bariátrica de hoje está pronta</h2>
            <p>Personalizada para o seu perfil e objetivo.</p>
          </div>

          <div className="banana-recipe-stats">
            <MiniStat icon={<Calendar size={20} />} label="Dia" value={String(journeyDay)} />
            <MiniStat icon={<Clock size={20} />} label="Tempo" value="3 min" />
            <MiniStat icon={<Check size={20} />} label="Status" value={recipeDone ? "feita" : "liberada"} />
            <MiniStat icon={<ListChecks size={20} />} label="Progresso" value={`${routineDone}/${routineTemplates.length} etapas`} />
          </div>

          <button className="banana-hero-cta" type="button" onClick={() => openAudio(audioLibrary[0], { kind: "main" })}>
            <Soup size={24} />
            Preparar receita agora
          </button>
          <button className="banana-ingredients-link" type="button" onClick={() => openAudio(audioLibrary[0], { kind: "main" })}>
            Ver ingredientes
          </button>
        </div>

        <div className="banana-progress-visual" aria-label={`${percent}% concluído`}>
          <div className="banana-ring" style={{ "--progress": `${percent * 3.6}deg` } as CSSProperties}>
            <strong>{percent}%</strong>
            <span>concluído</span>
          </div>
          <div className="banana-shake">
            <span className="banana-straw" />
            <span className="banana-glass" />
            <span className="banana-fruit">🍌</span>
          </div>
        </div>
      </section>

      <div className="banana-two-col">
        <section className="banana-panel">
          <h3>Seu protocolo de hoje</h3>
          <div className="banana-timeline">
            <TimelineItem number="1" icon={<Soup size={23} />} title="Preparar a receita" subtitle="Sua receita personalizada" />
            <TimelineItem number="2" icon={<Droplets size={24} />} title="Beber água" subtitle="Meta diária: 8 copos" />
            <TimelineItem number="3" icon={<UserRound size={22} />} title="Fazer check-in do corpo" subtitle="Como você está hoje?" />
          </div>
        </section>

        <section className="banana-panel">
          <h3>Checklist do dia</h3>
          <div className="banana-checklist">
            {checklist.map((item) => {
              const done = doneToday.includes(item.id) || (item.id === "receita" && recipeDone);
              return (
                <button className="banana-check-row" type="button" key={item.id} onClick={() => done ? openScreen(item.screen) : markDone(item.id)}>
                  <span className={done ? "done" : ""}>{done ? <Check size={16} /> : null}</span>
                  <span><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                  <ChevronRight size={18} />
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="banana-home-section">
        <h3>Atalhos</h3>
        <div className="banana-shortcuts">
          <Shortcut icon={<Soup size={23} />} tone="yellow" title="Receita" subtitle="Sua receita do dia" onClick={() => openAudio(audioLibrary[0], { kind: "main" })} />
          <Shortcut icon={<Droplets size={23} />} tone="blue" title="Água" subtitle={`${water} copos hoje`} onClick={() => openScreen("emergency")} />
          <Shortcut icon={<BarChart3 size={23} />} tone="green" title="Progresso" subtitle="Acompanhe sua jornada" onClick={() => openScreen("progress")} />
          <Shortcut icon={<Gift size={23} />} tone="purple" title="Bônus" subtitle="Conteúdos e benefícios" onClick={() => openScreen("guide")} />
        </div>
      </section>

      <section className="banana-home-section">
        <h3>Microvitórias</h3>
        <div className="banana-victories">
          <Victory icon={<Calendar size={18} />} label="Dias" value={`${metrics.totalSessions}/21`} />
          <Victory icon={<Flame size={18} />} label="Sequência" value={`${metrics.currentStreak}d`} />
          <Victory icon={<CheckSquare size={18} />} label="Check-ins" value={String(state.checkIns.length)} />
          <Victory icon={<Droplets size={18} />} label="Água" value={`${water} copos`} />
          <div className="banana-progress-line"><span style={{ width: `${Math.min(100, (metrics.totalSessions / 21) * 100)}%` }} /></div>
          <footer><span>Plano de 21 dias</span><strong>{Math.round(Math.min(100, (metrics.totalSessions / 21) * 100))}%</strong></footer>
        </div>
      </section>

      <section className="banana-tip-card">
        <span><Heart size={30} /></span>
        <div>
          <h3>Dica personalizada</h3>
          <p>Não precisa ser perfeito. Precisa ser feito. Seu check-in ajuda o app a acompanhar sua evolução.</p>
        </div>
      </section>
    </section>
  );
}

function MiniStat({ icon, label, value }: { readonly icon: ReactNode; readonly label: string; readonly value: string }) {
  return <div className="banana-mini-stat">{icon}<span>{label}</span><strong>{value}</strong></div>;
}

function TimelineItem({ icon, number, subtitle, title }: { readonly icon: ReactNode; readonly number: string; readonly subtitle: string; readonly title: string }) {
  return (
    <div className="banana-timeline-item">
      <span>{number}</span>
      <i>{icon}</i>
      <div><strong>{title}</strong><small>{subtitle}</small></div>
    </div>
  );
}

function Shortcut({ icon, onClick, subtitle, title, tone }: { readonly icon: ReactNode; readonly onClick: () => void; readonly subtitle: string; readonly title: string; readonly tone: string }) {
  return (
    <button className="banana-shortcut" type="button" onClick={onClick}>
      <span className={tone}>{icon}</span>
      <span><strong>{title}</strong><small>{subtitle}</small></span>
      <ChevronRight size={20} />
    </button>
  );
}

function Victory({ icon, label, value }: { readonly icon: ReactNode; readonly label: string; readonly value: string }) {
  return <div className="banana-victory">{icon}<span>{label}</span><strong>{value}</strong></div>;
}
