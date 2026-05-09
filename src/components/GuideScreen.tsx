import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { CheckCircle2, Clock, Coffee, Gift, HelpCircle, ListChecks, PlayCircle, Settings, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { guideModules, helpOptions, upsells, type ProtocolAudio } from "../data/protocolData";
import type { OndaTeslaState } from "../state/ondaTeslaState";

interface GuideScreenProps {
  readonly active: boolean;
  readonly state: OndaTeslaState;
  readonly setState: Dispatch<SetStateAction<OndaTeslaState>>;
  readonly openAudio: (audio: ProtocolAudio, source?: { kind: "library" }) => void;
  readonly openSettings: () => void;
}

type GuideTab = "bonus" | "help" | "upsell" | "admin";

export function GuideScreen({ active, state, setState, openSettings }: GuideScreenProps) {
  const [tab, setTab] = useState<GuideTab>("bonus");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const module = guideModules.find((item) => item.id === selectedModule);

  function markRead(id: string) {
    setState((current) => ({
      ...current,
      completedGuides: current.completedGuides.includes(id) ? current.completedGuides : [...current.completedGuides, id]
    }));
    setSelectedModule(null);
  }

  return (
    <section className={`screen neuro-screen ${active ? "active" : ""}`}>
      <header className="neuro-heading">
        <span className="protocol-eyebrow"><Gift size={14} /> Bônus</span>
        <h1>Conteúdos e suporte</h1>
        <p>Bônus úteis, ajuda antes do abandono, upsells contextuais e admin básico.</p>
      </header>

      <div className="segmented">
        <button className={tab === "bonus" ? "active" : ""} type="button" onClick={() => setTab("bonus")}><Gift size={16} /> Bônus</button>
        <button className={tab === "help" ? "active" : ""} type="button" onClick={() => setTab("help")}><HelpCircle size={16} /> Ajuda</button>
        <button className={tab === "upsell" ? "active" : ""} type="button" onClick={() => setTab("upsell")}><ShoppingBag size={16} /> Ofertas</button>
        <button className={tab === "admin" ? "active" : ""} type="button" onClick={() => setTab("admin")}><Settings size={16} /> Admin</button>
      </div>

      {tab === "bonus" ? (
        <>
          <div className="guide-progress"><strong>{state.completedGuides.length}/{guideModules.length}</strong><span>bônus acessados</span></div>
          <div className="guide-list">
            {guideModules.map((item, index) => (
              <button className={state.completedGuides.includes(item.id) ? "read" : ""} key={item.id} type="button" onClick={() => setSelectedModule(item.id)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{item.title}</strong><p>{item.description}</p><small>Conteúdo: {item.readingTime}</small></div>
                {state.completedGuides.includes(item.id) ? <Star size={18} /> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {tab === "help" ? (
        <div className="support-list">
          <button type="button" onClick={openSettings}><Settings size={18} /> Perfil, lembretes e acesso</button>
          {helpOptions.map((item) => (
            <div key={item}>
              <strong>{item}</strong>
              <p>{helpCopy(item)}</p>
            </div>
          ))}
          <section className="trust-card">
            <ShieldCheck size={18} />
            <p>Garantia e suporte devem ser claros. Tempo médio de resposta: até 24h úteis.</p>
          </section>
        </div>
      ) : null}

      {tab === "upsell" ? (
        <div className="audio-library">
          {upsells.map((item) => (
            <article className="audio-row" key={item.title}>
              <span><ShoppingBag size={18} /></span>
              <div><strong>{item.title}</strong><p>{item.price}</p><small>{item.trigger}</small></div>
              <button type="button">Quero</button>
            </article>
          ))}
          <button className="protocol-secondary full" type="button">Continuar com meu plano atual</button>
        </div>
      ) : null}

      {tab === "admin" ? (
        <div className="metric-grid compact-metrics">
          {[
            ["Usuárias cadastradas", "local"],
            ["Check-ins feitos", String(state.checkIns.length)],
            ["Dias concluídos", String(state.sessions.length)],
            ["Tickets de suporte", String(state.emergencyUses.length)],
            ["Usuárias em risco", state.checkIns.length ? "monitorar" : "sem check-ins"]
          ].map(([label, value]) => (
            <article className="metric-card large" key={label}><span className="metric-icon"><Settings size={20} /></span><div><span>{label}</span><strong>{value}</strong><small>Admin MVP local</small></div></article>
          ))}
        </div>
      ) : null}

      <div className={`protocol-modal ${module ? "show" : ""}`}>
        <div className="protocol-modal-panel">
          {module ? (
            <>
              <div className="protocol-modal-head"><div><h3>{module.title}</h3><p>{module.description}</p></div></div>
              {module.id === "cha" ? <JapaneseTeaBonus /> : <div className="guide-detail">{module.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
              <button className="protocol-primary full" type="button" onClick={() => markRead(module.id)}>
                {module.id === "cha" ? "Concluir bônus" : "Marcar como acessado"}
              </button>
              <button className="protocol-secondary full" type="button" onClick={() => setSelectedModule(null)}>Voltar</button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function JapaneseTeaBonus() {
  const ingredients = [
    ["Chá preto", "Ajuda a dar energia e pode apoiar o metabolismo. Como contém cafeína, prefira usar durante o dia ou no fim da tarde."],
    ["Hibisco", "Ajuda na sensação de desinchaço e pode apoiar uma rotina alimentar mais leve."],
    ["Cravo-da-índia", "Deixa o chá mais aromático e pode apoiar a digestão."],
    ["Canela", "Ajuda a reduzir a vontade de doce e deixa o sabor mais agradável."],
    ["Alecrim", "Deixa a bebida mais refrescante e combina com uma rotina leve."]
  ];

  const recipe = [
    "500 ml de água quente",
    "1 sachê de chá preto ou 1 colher de chá de chá preto",
    "1 colher de sopa rasa de hibisco",
    "3 a 5 cravos-da-índia",
    "1 pedaço pequeno de canela em pau ou 1 pitada de canela em pó",
    "1 raminho pequeno de alecrim"
  ];

  const preparation = [
    "Aqueça a água até ficar bem quente, sem precisar ferver demais.",
    "Coloque o chá preto, o hibisco, o cravo, a canela e o alecrim em uma xícara grande ou jarra.",
    "Despeje a água quente por cima.",
    "Tampe e deixe descansar por aproximadamente 10 a 15 minutos.",
    "Depois, coe o chá.",
    "Tome morno ou coloque na geladeira para tomar gelado ao longo do dia."
  ];

  const nightRecipe = [
    "300 ml de água quente",
    "1 colher de sopa rasa de hibisco",
    "3 cravos-da-índia",
    "1 pedaço pequeno de canela",
    "1 raminho pequeno de alecrim"
  ];

  const checklist = [
    "Assisti à videoaula.",
    "Preparei o Chá Japonês.",
    "Tomei sem açúcar.",
    "Evitei beliscar depois do chá.",
    "Fiz o check-in da minha sensação."
  ];

  return (
    <div className="bonus-lesson">
      <div className="bonus-video">
        <iframe
          title="Aula rápida do Chá Noturno Japonês"
          src="https://www.youtube.com/embed/iYwSL-LXIdE"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="bonus-meta">
        <span><Clock size={15} /> Conteúdo: 2 min</span>
        <span><PlayCircle size={15} /> Aula rápida</span>
      </div>

      <section className="bonus-callout">
        <Coffee size={20} />
        <div>
          <strong>Rotina leve para fechar o dia</strong>
          <p>O Chá Noturno Japonês ajuda a desacelerar, reduzir beliscos e deixar sua noite mais organizada.</p>
        </div>
      </section>

      <section className="bonus-section">
        <h4>Como ele entra no seu plano</h4>
        <p>Ele funciona melhor junto com sua Receita da Banana Bariátrica, água, menos exageros à noite e check-in diário. Não é milagre: é uma rotina simples repetida com consistência.</p>
      </section>

      <section className="bonus-section">
        <h4>Ingredientes da receita</h4>
        <div className="bonus-ingredient-list">
          {ingredients.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bonus-recipe-card">
        <h4>Receita prática do Chá Japonês</h4>
        <ul>{recipe.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="bonus-section">
        <h4>Modo de preparo</h4>
        <ol>{preparation.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>

      <section className="bonus-section">
        <h4>Como consumir</h4>
        <p>Tome 1 copo antes do almoço, antes do jantar ou no período da tarde. Evite adoçar com açúcar. Se precisar muito adoçar, use pequena quantidade de stevia ou xilitol.</p>
        <p>Evite tomar muito tarde se você tiver dificuldade para dormir, porque o chá preto contém cafeína.</p>
      </section>

      <section className="bonus-recipe-card night">
        <h4>Versão noturna sem cafeína</h4>
        <p>Para usar depois do jantar, remova o chá preto e mantenha uma versão mais leve para fechar a cozinha.</p>
        <ul>{nightRecipe.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="bonus-callout soft">
        <ListChecks size={20} />
        <div>
          <strong>Ritual da cozinha fechada</strong>
          <p>Depois do chá, repita: “Por hoje, minha cozinha está fechada. Se bater vontade de comer doce, vou esperar 10 minutos antes de decidir.”</p>
          <p>Antes de beliscar, pergunte: estou com fome de verdade ou é ansiedade, costume ou vontade de doce?</p>
        </div>
      </section>

      <section className="bonus-section">
        <h4>Desafio de 3 dias</h4>
        <div className="bonus-challenge">
          <span><strong>Dia 1</strong> tomar o chá sem açúcar.</span>
          <span><strong>Dia 2</strong> tomar o chá e não beliscar depois.</span>
          <span><strong>Dia 3</strong> tomar o chá e registrar sua sensação no check-in.</span>
        </div>
        <p>Ao final, observe se a barriga parece menos pesada, se você beliscou menos à noite e se dormir ficou mais fácil ou mais difícil.</p>
      </section>

      <section className="bonus-section">
        <h4>Checklist do bônus</h4>
        <div className="bonus-checklist">
          {checklist.map((item) => (
            <span key={item}><CheckCircle2 size={16} /> {item}</span>
          ))}
        </div>
      </section>

      <section className="bonus-finish">
        <strong>Parabéns. Você concluiu o Chá Noturno Japonês.</strong>
        <p>Agora você tem uma rotina simples para deixar sua noite mais leve, reduzir beliscos e continuar firme no seu plano. O resultado vem da repetição: faça hoje, repita amanhã e acompanhe sua evolução no check-in.</p>
      </section>
    </div>
  );
}

function helpCopy(option: string) {
  if (option.includes("resultado")) return "Cada corpo responde em ritmo diferente. Veja também inchaço, água, cintura, disposição e constância.";
  if (option.includes("constância")) return "Ative lembrete e use o plano mínimo: receita + check-in.";
  if (option.includes("garantia")) return "Explicação clara, sem esconder informação. Fale com suporte se precisar.";
  if (option.includes("receita")) return "Abra a receita do dia, veja passo a passo e use a solução se não conseguiu fazer.";
  return "Veja o passo a passo e fale com suporte se ainda precisar de ajuda.";
}
