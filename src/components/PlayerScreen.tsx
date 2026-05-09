import type { ReactNode } from "react";
import { useState } from "react";
import {
  Check,
  Clock,
  Droplets,
  HelpCircle,
  Leaf,
  ListChecks,
  Play,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Utensils,
  X
} from "lucide-react";
import type { PlayerSource } from "../App";
import type { ProtocolAudio } from "../data/protocolData";
import { dayNumber, type CheckInInput } from "../state/ondaTeslaState";

interface PlayerScreenProps {
  readonly active: boolean;
  readonly audio: ProtocolAudio;
  readonly source: PlayerSource;
  readonly journeyStartDate?: string;
  readonly onComplete: (checkIn: CheckInInput, emergencyResult?: string) => void;
}

const defaultCheck: CheckInInput = {
  madeRecipe: true,
  waterCups: 4,
  bloatingScore: 5,
  sweetCravingScore: 5,
  hungerScore: 5,
  energyScore: 5,
  weight: null,
  waist: null,
  note: "",
  tags: ["Receita feita"]
};

const helpOptions = ["Não tinha banana", "Esqueci", "Fiquei sem tempo", "Não gostei do sabor", "Tive dúvida"];
const shoppingItems = ["Banana", "Água", "Gengibre fresco", "Canela", "Cravo-da-índia"];

export function PlayerScreen({ active, audio, journeyStartDate, onComplete }: PlayerScreenProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpReason, setHelpReason] = useState<string | null>(null);
  const [listSaved, setListSaved] = useState(false);
  const day = journeyStartDate ? dayNumber(journeyStartDate) : 1;

  function completeRecipe() {
    onComplete(defaultCheck);
  }

  function openHelp() {
    setHelpReason(null);
    setHelpOpen(true);
  }

  return (
    <section className={`screen neuro-screen player-protocol ${active ? "active" : ""}`}>
      <header className="neuro-heading">
        <span className="protocol-eyebrow"><Utensils size={14} /> Receita de hoje</span>
        <h1>Receita da Banana Bariátrica — Dia {day}</h1>
        <p>Seu primeiro ritual foi ajustado para começar de forma simples, leve e fácil de seguir.</p>
      </header>

      <article className="ritual-player banana-recipe-card recipe-delivery">
        <section className="recipe-personal-card">
          <div>
            <span className="recipe-mini-kicker"><Sparkles size={14} /> Plano ajustado para o seu perfil</span>
            <h2>Comece com o básico bem feito</h2>
            <p>Hoje o objetivo é iniciar sua rotina, reduzir a confusão e completar o primeiro check-in.</p>
          </div>
          <div className="recipe-chip-grid">
            <span>Foco de hoje: começar sem perfeccionismo</span>
            <span>Melhor horário: manhã ou em jejum leve</span>
            <span>Dificuldade: simples</span>
          </div>
        </section>

        <section className="recipe-hero-card">
          <div className="recipe-hero-copy">
            <span className="recipe-mini-kicker"><Utensils size={14} /> Receita Base do Dia 1</span>
            <h2>{audio.name}</h2>
            <p>O Truque da Banana em uma versão simples para começar hoje, sem complicar a rotina.</p>
          </div>
          <div className="banana-bowl-visual" aria-hidden="true">
            <span>🍌</span>
            <i />
          </div>
        </section>

        <section className="recipe-video-card">
          <div>
            <span className="recipe-mini-kicker"><Play size={14} /> Videoaula</span>
            <h2>Como preparar o Truque da Banana</h2>
            <p>Assista à aula rápida e depois siga a base de ingredientes abaixo.</p>
          </div>
          <div className="recipe-video-frame">
            <iframe
              title="Videoaula do Truque da Banana"
              src="https://www.youtube.com/embed/L2FkpEZA214"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        <section className="recipe-block recipe-ingredients-card">
          <h2>Ingredientes</h2>
          <div className="ingredient-grid">
            <Ingredient icon={<Leaf size={18} />} label="Casca de 1 banana bem higienizada" description="Use a casca da banana madura ou quase madura. Se possível, prefira banana orgânica." />
            <Ingredient icon={<Droplets size={18} />} label="1 litro de água" description="Serve como base para extrair os compostos da casca e das especiarias." />
            <Ingredient icon={<Sparkles size={18} />} label="1 pedaço pequeno de gengibre fresco" description="Ajuda a deixar o chá mais forte, aromático e digestivo." />
            <Ingredient icon={<Sparkles size={18} />} label="1 pedaço de canela em pau ou 1 pitada de canela em pó" description="Ajuda no sabor e reduz a necessidade de adoçar." />
            <Ingredient icon={<Leaf size={18} />} label="2 cravos-da-índia" description="Dá aroma e combina bem com o efeito digestivo do chá." />
          </div>
          <p className="recipe-note">
            Higienize muito bem a casca antes do preparo. Se tiver restrição alimentar, gestação, uso de medicamentos ou condição de saúde, consulte um profissional antes de usar qualquer ingrediente novo.
          </p>
        </section>

        <section className="recipe-block recipe-steps-card">
          <h2>Modo de preparo</h2>
          <div className="recipe-step-list">
            {[
              "Higienize bem a casca da banana antes de usar.",
              "Aqueça 1 litro de água e adicione a casca, o gengibre, a canela e o cravo.",
              "Deixe em infusão por alguns minutos para liberar aroma e sabor.",
              "Coe antes de beber e tome em um horário confortável para sua rotina.",
              "Depois, volte ao app e marque a receita como feita."
            ].map((step, index) => (
              <div className="recipe-step" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="recipe-guidance-grid">
          <div>
            <Clock size={18} />
            <strong>Horário sugerido</strong>
            <p>De preferência pela manhã, antes do café ou como primeira bebida do dia.</p>
          </div>
          <div>
            <HelpCircle size={18} />
            <strong>Dica da Andrea</strong>
            <p>Não tente fazer perfeito. Hoje o mais importante é começar e registrar seu primeiro dia.</p>
          </div>
        </div>

        <section className="recipe-why-card">
          <h2>Por que essa receita foi liberada para você hoje?</h2>
          <p>
            Como este é o Dia 1, o app liberou uma versão inicial simples para o seu corpo se adaptar à rotina. Nos próximos dias, o plano poderá ajustar foco, horário, dicas e tarefas conforme seus check-ins.
          </p>
          <div>
            <span>Seu foco: constância</span>
            <span>Seu desafio: vontade de doce</span>
            <span>Meta de hoje: receita + água + check-in</span>
          </div>
        </section>

        <div className="player-main-actions">
          <button className="protocol-primary" type="button" onClick={completeRecipe}>
            <Check size={19} />
            Marcar receita como feita
          </button>
          <button className="protocol-secondary" type="button" onClick={openHelp}>
            <X size={18} />
            Não consegui fazer hoje
          </button>
        </div>

        <section className="recipe-shopping-card">
          <div>
            <span className="recipe-mini-kicker"><ShoppingBasket size={14} /> Lista de compras da semana</span>
            <h2>Itens para deixar separados</h2>
          </div>
          <div className="shopping-list">
            {shoppingItems.map((item) => <span key={item}><Check size={14} /> {item}</span>)}
          </div>
          <button className="protocol-secondary full" type="button" onClick={() => setListSaved(true)}>
            <ListChecks size={17} />
            {listSaved ? "Lista salva" : "Salvar lista"}
          </button>
        </section>

        <section className="recipe-safety-note">
          <ShieldCheck size={18} />
          <p>Este conteúdo é educativo e não substitui orientação médica ou nutricional. Resultados variam de pessoa para pessoa.</p>
        </section>
      </article>

      <div className={`protocol-modal ${helpOpen ? "show" : ""}`}>
        <div className="protocol-modal-panel checkin-panel">
          <div className="protocol-modal-head">
            <div><h3>O que aconteceu?</h3><p>Escolha o motivo e veja uma solução simples para hoje.</p></div>
            <button className="protocol-close-btn" type="button" onClick={() => setHelpOpen(false)}><X size={18} /></button>
          </div>
          <div className="protocol-check-grid">
            {helpOptions.map((item) => (
              <button className={helpReason === item ? "selected" : ""} key={item} type="button" onClick={() => setHelpReason(item)}>{item}</button>
            ))}
          </div>
          {helpReason ? (
            <div className="recipe-help-solution">
              <strong>Solução para agora</strong>
              <p>Você pode preparar ainda hoje se conseguir. Se não der, ative um lembrete para amanhã, veja a lista de compras e fale com suporte se tiver dúvida.</p>
              <button className="protocol-primary full" type="button" onClick={() => setHelpOpen(false)}>Voltar para a receita</button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Ingredient({ description, icon, label }: { readonly description?: string; readonly icon: ReactNode; readonly label: string }) {
  return (
    <div className="ingredient-item">
      <span>{icon}</span>
      <div>
        <strong>{label}</strong>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}
