import { Activity, CalendarCheck, Droplets, Ruler, Scale, Sparkles } from "lucide-react";
import { lastNDays, metricsFromState, dayNumber, type OndaTeslaState } from "../state/ondaTeslaState";
import { milestones } from "../data/protocolData";

interface ProgressScreenProps {
  readonly active: boolean;
  readonly state: OndaTeslaState;
}

export function ProgressScreen({ active, state }: ProgressScreenProps) {
  const metrics = metricsFromState(state);
  const hasData = state.checkIns.length > 0 || state.sessions.length > 0;
  const journeyDay = dayNumber(state.journeyStartDate);
  const next = milestones.find((item) => item.day > journeyDay);
  const trend = buildTrends(state);

  return (
    <section className={`screen neuro-screen ${active ? "active" : ""}`}>
      <header className="neuro-heading">
        <span className="protocol-eyebrow"><Activity size={14} /> Progresso</span>
        <h1>Sua evolução visual</h1>
        <p>Veja progresso em peso, cintura, água, inchaço, disposição e constância.</p>
      </header>

      {!hasData ? (
        <div className="empty-state">
          <strong>Complete seu primeiro check-in para iniciar seu histórico.</strong>
          <p>O app mostra evolução mesmo antes do peso mudar: menos inchaço, mais água e mais constância.</p>
        </div>
      ) : null}

      <div className="progress-hero neuro-progress-main">
        <div>
          <span className="kicker">Dia {journeyDay} de 21</span>
          <h2>{Math.round((Math.min(journeyDay, 21) / 21) * 100)}%</h2>
          <p>{next ? `Próximo marco: Dia ${next.day} - ${next.title}` : "Ciclo de 21 dias completo."}</p>
        </div>
        <div className="progress-ring"><strong>{metrics.currentStreak}d</strong></div>
      </div>

      <div className="metric-grid compact-metrics">
        {[
          { label: "peso inicial", value: kg(metrics.initialWeight), detail: "primeiro registro", Icon: Scale },
          { label: "peso atual", value: kg(metrics.currentWeight), detail: diff(metrics.weightDiff, "kg"), Icon: Scale },
          { label: "cintura", value: cm(metrics.currentWaist), detail: diff(metrics.waistDiff, "cm"), Icon: Ruler },
          { label: "água média", value: fmt(metrics.waterAverage), detail: "copos por check-in", Icon: Droplets },
          { label: "check-ins", value: String(state.checkIns.length), detail: "salvos", Icon: CalendarCheck },
          { label: "sequência", value: `${metrics.currentStreak}d`, detail: "dias seguidos", Icon: Sparkles }
        ].map(({ label, value, detail, Icon }) => (
          <article className="metric-card large" key={label}>
            <span className="metric-icon"><Icon size={22} /></span>
            <div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
          </article>
        ))}
      </div>

      <section className="timeline-90">
        <h2>Plano de 21 dias</h2>
        <p>{next ? `Próximo marco: Dia ${next.day} - ${next.description}` : "Relatório final liberado."}</p>
        <div>
          {milestones.map((item) => (
            <span className={journeyDay >= item.day ? "done" : item.day === next?.day ? "active" : "locked"} key={item.day}>
              Dia {item.day}
            </span>
          ))}
        </div>
      </section>

      <Trend title="Peso 7 dias" data={trend.weight} />
      <Trend title="Cintura 7 dias" data={trend.waist} />
      <Trend title="Água 7 dias" data={trend.water} />
      <Trend title="Vontade de doce 7 dias" data={trend.sweet} />
    </section>
  );
}

function fmt(value: number | null) {
  return value === null ? "--" : value.toFixed(1);
}

function kg(value: number | null) {
  return value === null ? "--" : `${value}kg`;
}

function cm(value: number | null) {
  return value === null ? "--" : `${value}cm`;
}

function diff(value: number | null, suffix: string) {
  if (value === null) return "sem comparação";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}${suffix}`;
}

function buildTrends(state: OndaTeslaState) {
  const days = lastNDays(7);
  return {
    weight: days.map((day) => state.checkIns.find((item) => item.date === day)?.weight ?? 0),
    waist: days.map((day) => state.checkIns.find((item) => item.date === day)?.waist ?? 0),
    water: days.map((day) => state.checkIns.find((item) => item.date === day)?.waterCups ?? 0),
    sweet: days.map((day) => state.checkIns.find((item) => item.date === day)?.sweetCravingScore ?? 0)
  };
}

function Trend({ data, title }: { readonly data: readonly number[]; readonly title: string }) {
  const max = Math.max(...data, 10);
  return (
    <div className="activity-chart trend-chart" aria-label={title}>
      <strong>{title}</strong>
      <div>
        {data.map((value, index) => <span key={index} style={{ height: `${Math.max(10, (value / max) * 100)}%` }} />)}
      </div>
    </div>
  );
}
