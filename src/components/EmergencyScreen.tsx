import { Check, Droplets, Heart, Scale, Smile, X } from "lucide-react";
import { useState } from "react";
import type { CheckInInput, OndaTeslaState } from "../state/ondaTeslaState";

interface EmergencyScreenProps {
  readonly active: boolean;
  readonly state: OndaTeslaState;
  readonly onSaveCheckIn: (checkIn: CheckInInput) => void;
}

const tags = ["Receita feita", "Água em dia", "Menos inchaço", "Vontade de doce alta", "Mais disposição", "Dia difícil"];

export function EmergencyScreen({ active, onSaveCheckIn, state }: EmergencyScreenProps) {
  const last = state.checkIns[state.checkIns.length - 1];
  const [form, setForm] = useState<CheckInInput>({
    madeRecipe: true,
    waterCups: last?.waterCups ?? 4,
    bloatingScore: 5,
    sweetCravingScore: 5,
    hungerScore: 5,
    energyScore: 5,
    weight: last?.weight ?? state.userProfile?.currentWeight ?? null,
    waist: last?.waist ?? null,
    note: "",
    tags: ["Receita feita"]
  });
  const [saved, setSaved] = useState(false);

  function update<K extends keyof CheckInInput>(key: K, value: CheckInInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleTag(tag: string) {
    update("tags", form.tags.includes(tag) ? form.tags.filter((item) => item !== tag) : [...form.tags, tag]);
  }

  function save() {
    onSaveCheckIn(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <section className={`screen neuro-screen ${active ? "active" : ""}`}>
      <header className="neuro-heading">
        <span className="protocol-eyebrow"><Check size={14} /> Check-in diário</span>
        <h1>Como foi seu dia?</h1>
        <p>Mesmo que o dia não tenha sido perfeito, registrar já é evolução.</p>
      </header>

      {saved ? (
        <div className="empty-state success-pop">
          <strong>Check-in salvo. Você completou mais um passo.</strong>
          <p>Mais um dia salvo no seu progresso.</p>
        </div>
      ) : null}

      <article className="protocol-routine-card checkin-form">
        <div className="toggle-row">
          <span><UtensilMini /> Você fez a receita hoje?</span>
          <button className={form.madeRecipe ? "selected" : ""} type="button" onClick={() => update("madeRecipe", !form.madeRecipe)}>
            {form.madeRecipe ? "Sim" : "Não"}
          </button>
        </div>

        <NumberField icon={<Droplets size={17} />} label="Copos de água" value={form.waterCups} onChange={(value) => update("waterCups", value)} />
        <NumberField icon={<Scale size={17} />} label="Peso hoje (kg)" value={form.weight ?? 0} onChange={(value) => update("weight", value || null)} />
        <NumberField icon={<Heart size={17} />} label="Cintura (cm)" value={form.waist ?? 0} onChange={(value) => update("waist", value || null)} />

        <Slider label="Inchaço" value={form.bloatingScore} onChange={(value) => update("bloatingScore", value)} />
        <Slider label="Vontade de doce" value={form.sweetCravingScore} onChange={(value) => update("sweetCravingScore", value)} />
        <Slider label="Fome" value={form.hungerScore} onChange={(value) => update("hungerScore", value)} />
        <Slider label="Disposição" value={form.energyScore} onChange={(value) => update("energyScore", value)} />

        <div className="tag-grid">
          {tags.map((tag) => <button className={form.tags.includes(tag) ? "selected" : ""} key={tag} type="button" onClick={() => toggleTag(tag)}>{tag}</button>)}
        </div>
        <textarea value={form.note} onChange={(event) => update("note", event.target.value)} placeholder="Alguma observação rápida?" />
        <button className="protocol-primary full" type="button" onClick={save}>Salvar check-in</button>
      </article>

      <section className="emergency-hero sweet-helper">
        <small>Vontade de doce alta?</small>
        <strong>Protocolo de 3 minutos</strong>
        <p>1. Beba água. 2. Respire fundo. 3. Espere 3 minutos. 4. Escolha uma opção leve. 5. Registre se passou.</p>
        <button className="protocol-secondary full" type="button"><X size={18} /> Me ajude agora</button>
      </section>
    </section>
  );
}

function Slider({ label, onChange, value }: { readonly label: string; readonly onChange: (value: number) => void; readonly value: number }) {
  return (
    <label className="check-slider">
      <span><strong>{label}</strong><b>{value}</b></span>
      <input min="0" max="10" type="range" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <small><em>baixo</em><em>alto</em></small>
    </label>
  );
}

function NumberField({ icon, label, onChange, value }: { readonly icon: React.ReactNode; readonly label: string; readonly onChange: (value: number) => void; readonly value: number }) {
  return (
    <label className="floating-field inline-number">
      {icon}
      <span>{label}</span>
      <input type="number" value={value || ""} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function UtensilMini() {
  return <Smile size={17} />;
}
