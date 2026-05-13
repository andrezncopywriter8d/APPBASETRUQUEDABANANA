import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { CheckCircle2, Clock, Coffee, Gift, HelpCircle, ListChecks, PlayCircle, Settings, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { guideModules, helpOptions, upsells, type ProtocolAudio } from "../data/protocolData";
import type { OndaTeslaState } from "../state/ondaTeslaState";

interface GuideScreenProps {
  readonly active: boolean;
  readonly state: OndaTeslaState;
  readonly setState: Dispatch<SetStateAction<OndaTeslaState>>;
  readonly openAudio: (audio: ProtocolAudio, source: { kind: "library" }) => void;
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
              {module.id === "cha" ? <JapaneseTeaBonus /> : null}
              {module.id === "sanfona" ? <AntiSanfonaBonus /> : null}
              {module.id === "movimento" ? <MovementBonus /> : null}
              {!["cha", "sanfona", "movimento"].includes(module.id) ? <div className="guide-detail">{module.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div> : null}
              <button className="protocol-primary full" type="button" onClick={() => markRead(module.id)}>
                {["cha", "sanfona", "movimento"].includes(module.id) ? "Concluir bônus" : "Marcar como acessado"}
              </button>
              <button className="protocol-secondary full" type="button" onClick={() => setSelectedModule(null)}>Voltar</button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function AntiSanfonaBonus() {
  const pillars = [
    ["Ritual mínimo", "Nos dias corridos, mantenha apenas o básico: receita, água e check-in. Isso evita que um dia ruim vire uma semana perdida."],
    ["Peso não é o único sinal", "Acompanhe também cintura, inchaço, disposição, beliscos e constância. Esses sinais aparecem antes da balança em muitas rotinas."],
    ["Plano de retorno", "Se sair do plano, volte na próxima refeição. Não espere segunda-feira, novo mês ou motivação perfeita."],
    ["Ambiente preparado", "Deixe banana, canela, chia ou linhaça e água visíveis. O que fica fácil tende a ser repetido."]
  ];

  const restartPlan = [
    "Volte para o Dia 1 por 24 horas: receita simples + água + check-in.",
    "Não tente compensar com restrição pesada. Isso aumenta fome e beliscos.",
    "Escolha um horário fixo para a receita nos próximos 3 dias.",
    "Anote o principal gatilho: doce, ansiedade, falta de tempo, sono ruim ou evento social.",
    "Use o app para registrar a retomada, mesmo que o dia não tenha sido perfeito."
  ];

  const weekPlan = [
    ["Segunda", "Organizar ingredientes e fazer a receita no horário combinado."],
    ["Terça", "Repetir a receita e bater a meta mínima de água."],
    ["Quarta", "Registrar cintura ou sensação de inchaço."],
    ["Quinta", "Escolher um jantar mais leve e evitar belisco automático."],
    ["Sexta", "Fazer check-in honesto, sem culpa."],
    ["Sábado", "Manter o plano mínimo se tiver compromisso."],
    ["Domingo", "Revisar a semana e preparar a próxima lista de compras."]
  ];

  return (
    <div className="bonus-lesson">
      <div className="bonus-meta">
        <span><Clock size={15} /> Conteúdo: 8 min</span>
        <span><ListChecks size={15} /> Guia prático</span>
      </div>

      <section className="bonus-callout">
        <ShieldCheck size={20} />
        <div>
          <strong>O segredo é ter um plano para os dias imperfeitos</strong>
          <p>O efeito sanfona costuma aparecer quando a pessoa alterna entre tudo ou nada. Aqui, a regra é diferente: você aprende a voltar rápido para o básico.</p>
        </div>
      </section>

      <section className="bonus-section">
        <h4>O que fazer depois dos 21 dias</h4>
        <p>Depois do ciclo inicial, não abandone tudo. Mantenha uma versão simples do ritual: receita em dias alternados, água acompanhada, check-in 3 vezes por semana e uma revisão rápida no domingo.</p>
        <p>O objetivo não é viver presa ao app. É usar o app como trilho até sua rotina ficar automática.</p>
      </section>

      <section className="bonus-section">
        <h4>4 pilares anti-sanfona</h4>
        <div className="bonus-ingredient-list">
          {pillars.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bonus-recipe-card">
        <h4>Plano de retorno em 24 horas</h4>
        <ol>{restartPlan.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>

      <section className="bonus-section">
        <h4>Semana de manutenção simples</h4>
        <div className="bonus-challenge">
          {weekPlan.map(([day, task]) => (
            <span key={day}><strong>{day}</strong> {task}</span>
          ))}
        </div>
      </section>

      <section className="bonus-callout soft">
        <ListChecks size={20} />
        <div>
          <strong>Regra da próxima escolha</strong>
          <p>Se você exagerou, não precisa “pagar” com culpa. A próxima escolha já pode ser melhor: água, receita, caminhada leve ou check-in. É assim que a sequência volta.</p>
        </div>
      </section>

      <section className="bonus-finish">
        <strong>Seu plano não acaba no Dia 21.</strong>
        <p>Ele vira uma rotina menor, mais fácil de repetir. A manutenção começa quando você para de recomeçar do zero e aprende a voltar para o próximo passo.</p>
      </section>
    </div>
  );
}

function MovementBonus() {
  const warmup = [
    "30 segundos marchando sem sair do lugar.",
    "30 segundos girando ombros para trás.",
    "30 segundos abrindo e fechando os braços.",
    "30 segundos respirando fundo e soltando o ar devagar."
  ];

  const circuit = [
    ["Sentar e levantar da cadeira", "8 a 12 repetições, usando apoio se precisar."],
    ["Elevação de panturrilha", "10 repetições, segurando em uma parede ou cadeira."],
    ["Remada com toalha", "10 puxadas leves, mantendo ombros relaxados."],
    ["Passo lateral", "30 segundos para um lado e para o outro."],
    ["Alongamento final", "Respire por 40 segundos, soltando pescoço e ombros."]
  ];

  const levels = [
    ["Dia corrido", "Faça só 3 minutos: marcha, cadeira e respiração."],
    ["Dia normal", "Faça a rotina completa de 5 a 7 minutos."],
    ["Dia animado", "Repita o circuito 2 vezes, sem transformar em obrigação pesada."]
  ];

  return (
    <div className="bonus-lesson">
      <div className="bonus-meta">
        <span><Clock size={15} /> Conteúdo: 7 min</span>
        <span><PlayCircle size={15} /> Rotina guiada</span>
      </div>

      <section className="bonus-callout">
        <HeartIcon />
        <div>
          <strong>Movimento para destravar, não para se punir</strong>
          <p>Essa rotina foi pensada para mulheres que querem começar em casa, sem equipamento e sem cobrança. A meta é repetir, não sofrer.</p>
        </div>
      </section>

      <section className="bonus-section">
        <h4>Antes de começar</h4>
        <p>Use roupa confortável, deixe água por perto e escolha um espaço seguro. Se sentir dor, tontura, falta de ar forte ou desconforto diferente, pare e procure orientação profissional.</p>
      </section>

      <section className="bonus-recipe-card">
        <h4>Aquecimento de 2 minutos</h4>
        <ol>{warmup.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>

      <section className="bonus-section">
        <h4>Circuito leve de 5 minutos</h4>
        <div className="bonus-ingredient-list">
          {circuit.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bonus-section">
        <h4>Escolha seu nível do dia</h4>
        <div className="bonus-challenge">
          {levels.map(([title, text]) => (
            <span key={title}><strong>{title}</strong> {text}</span>
          ))}
        </div>
      </section>

      <section className="bonus-callout soft">
        <ListChecks size={20} />
        <div>
          <strong>Como encaixar no Banana App</strong>
          <p>Faça o movimento depois da receita ou no horário em que costuma beliscar. Depois registre no check-in se sua disposição, fome ou vontade de doce mudou.</p>
        </div>
      </section>

      <section className="bonus-finish">
        <strong>Microvitória concluída.</strong>
        <p>Se você fez poucos minutos, já conta. O corpo aprende pela repetição. Amanhã, repita a versão possível.</p>
      </section>
    </div>
  );
}

function HeartIcon() {
  return <span aria-hidden="true" style={{ display: "grid", placeItems: "center", color: "#2f7d32", fontSize: "1.25rem" }}>♡</span>;
}

function JapaneseTeaBonus() {
  const ingredients = [
    ["Ch\u00e1 preto", "Ajuda a dar energia e pode apoiar o metabolismo. Como cont\u00e9m cafe\u00edna, prefira usar durante o dia ou no fim da tarde."],
    ["Hibisco", "Ajuda na sensa\u00e7\u00e3o de desincha\u00e7o e pode apoiar uma rotina alimentar mais leve."],
    ["Cravo-da-\u00edndia", "Deixa o ch\u00e1 mais arom\u00e1tico e pode apoiar a digest\u00e3o."],
    ["Canela", "Ajuda a reduzir a vontade de doce e deixa o sabor mais agrad\u00e1vel."],
    ["Alecrim", "Deixa a bebida mais refrescante e combina com uma rotina leve."]
  ];

  const recipe = [
    "500 ml de \u00e1gua quente",
    "1 sach\u00ea de ch\u00e1 preto ou 1 colher de ch\u00e1 de ch\u00e1 preto",
    "1 colher de sopa rasa de hibisco",
    "3 a 5 cravos-da-\u00edndia",
    "1 peda\u00e7o pequeno de canela em pau ou 1 pitada de canela em p\u00f3",
    "1 raminho pequeno de alecrim"
  ];

  const preparation = [
    "Aque\u00e7a a \u00e1gua at\u00e9 ficar bem quente, sem precisar ferver demais.",
    "Coloque o ch\u00e1 preto, o hibisco, o cravo, a canela e o alecrim em uma x\u00edcara grande ou jarra.",
    "Despeje a \u00e1gua quente por cima.",
    "Tampe e deixe descansar por aproximadamente 10 a 15 minutos.",
    "Depois, coe o ch\u00e1.",
    "Tome morno ou coloque na geladeira para tomar gelado ao longo do dia."
  ];

  const nightRecipe = [
    "300 ml de \u00e1gua quente",
    "1 colher de sopa rasa de hibisco",
    "3 cravos-da-\u00edndia",
    "1 peda\u00e7o pequeno de canela",
    "1 raminho pequeno de alecrim"
  ];

  const checklist = [
    "Assisti \u00e0 videoaula.",
    "Preparei o Ch\u00e1 Japon\u00eas.",
    "Tomei sem a\u00e7\u00facar.",
    "Evitei beliscar depois do ch\u00e1.",
    "Fiz o check-in da minha sensa\u00e7\u00e3o."
  ];

  return (
    <div className="bonus-lesson">
      <div className="bonus-video">
        <iframe
          src="https://www.youtube.com/embed/iYwSL-LXIdE?rel=0&modestbranding=1&playsinline=1"
          title="Videoaula Chá Noturno Japonês"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <a className="bonus-video-help" href="https://www.youtube.com/watch?v=iYwSL-LXIdE" target="_blank" rel="noreferrer">
        {"Se o vídeo não carregar aqui, abrir no YouTube"}
      </a>

      <div className="bonus-meta">
        <span><Clock size={15} /> {"Conte\u00fado: 2 min"}</span>
        <span><PlayCircle size={15} /> {"Aula r\u00e1pida"}</span>
      </div>

      <section className="bonus-callout">
        <Coffee size={20} />
        <div>
          <strong>{"Rotina leve para fechar o dia"}</strong>
          <p>{"O Ch\u00e1 Noturno Japon\u00eas ajuda a desacelerar, reduzir beliscos e deixar sua noite mais organizada."}</p>
        </div>
      </section>

      <section className="bonus-section">
        <h4>{"Como ele entra no seu plano"}</h4>
        <p>{"Ele funciona melhor junto com sua Receita da Banana Bari\u00e1trica, \u00e1gua, menos exageros \u00e0 noite e check-in di\u00e1rio. N\u00e3o \u00e9 milagre: \u00e9 uma rotina simples repetida com consist\u00eancia."}</p>
      </section>

      <section className="bonus-section">
        <h4>{"Ingredientes da receita"}</h4>
        <div className="bonus-ingredient-list">
          {ingredients.map(([title, itemText]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{itemText}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bonus-recipe-card">
        <h4>{"Receita pr\u00e1tica do Ch\u00e1 Japon\u00eas"}</h4>
        <ul>{recipe.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="bonus-section">
        <h4>{"Modo de preparo"}</h4>
        <ol>{preparation.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>

      <section className="bonus-section">
        <h4>{"Como consumir"}</h4>
        <p>{"Tome 1 copo antes do almo\u00e7o, antes do jantar ou no per\u00edodo da tarde. Evite ado\u00e7ar com a\u00e7\u00facar. Se precisar muito ado\u00e7ar, use pequena quantidade de stevia ou xilitol."}</p>
        <p>{"Evite tomar muito tarde se voc\u00ea tiver dificuldade para dormir, porque o ch\u00e1 preto cont\u00e9m cafe\u00edna."}</p>
      </section>

      <section className="bonus-recipe-card night">
        <h4>{"Vers\u00e3o noturna sem cafe\u00edna"}</h4>
        <p>{"Para usar depois do jantar, remova o ch\u00e1 preto e mantenha uma vers\u00e3o mais leve para fechar a cozinha."}</p>
        <ul>{nightRecipe.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="bonus-callout soft">
        <ListChecks size={20} />
        <div>
          <strong>{"Ritual da cozinha fechada"}</strong>
          <p>{"Depois do ch\u00e1, repita: \"Por hoje, minha cozinha est\u00e1 fechada. Se bater vontade de comer doce, vou esperar 10 minutos antes de decidir.\""}</p>
          <p>{"Antes de beliscar, pergunte: estou com fome de verdade ou \u00e9 ansiedade, costume ou vontade de doce?"}</p>
        </div>
      </section>

      <section className="bonus-section">
        <h4>{"Desafio de 3 dias"}</h4>
        <div className="bonus-challenge">
          <span><strong>{"Dia 1"}</strong> {"tomar o ch\u00e1 sem a\u00e7\u00facar."}</span>
          <span><strong>{"Dia 2"}</strong> {"tomar o ch\u00e1 e n\u00e3o beliscar depois."}</span>
          <span><strong>{"Dia 3"}</strong> {"tomar o ch\u00e1 e registrar sua sensa\u00e7\u00e3o no check-in."}</span>
        </div>
        <p>{"Ao final, observe se a barriga parece menos pesada, se voc\u00ea beliscou menos \u00e0 noite e se dormir ficou mais f\u00e1cil ou mais dif\u00edcil."}</p>
      </section>

      <section className="bonus-section">
        <h4>{"Checklist do b\u00f4nus"}</h4>
        <div className="bonus-checklist">
          {checklist.map((item) => (
            <span key={item}><CheckCircle2 size={16} /> {item}</span>
          ))}
        </div>
      </section>

      <section className="bonus-finish">
        <strong>{"Parab\u00e9ns. Voc\u00ea concluiu o Ch\u00e1 Noturno Japon\u00eas."}</strong>
        <p>{"Agora voc\u00ea tem uma rotina simples para deixar sua noite mais leve, reduzir beliscos e continuar firme no seu plano. O resultado vem da repeti\u00e7\u00e3o: fa\u00e7a hoje, repita amanh\u00e3 e acompanhe sua evolu\u00e7\u00e3o no check-in."}</p>
      </section>
    </div>
  );
}

function helpCopy(option: string) {
  if (option.includes("resultado")) return "Cada corpo responde em ritmo diferente. Veja tambÃ©m inchaÃ§o, Ã¡gua, cintura, disposiÃ§Ã£o e constÃ¢ncia.";
  if (option.includes("constÃ¢ncia")) return "Ative lembrete e use o plano mÃ­nimo: receita + check-in.";
  if (option.includes("garantia")) return "ExplicaÃ§Ã£o clara, sem esconder informaÃ§Ã£o. Fale com suporte se precisar.";
  if (option.includes("receita")) return "Abra a receita do dia, veja passo a passo e use a soluÃ§Ã£o se nÃ£o conseguiu fazer.";
  return "Veja o passo a passo e fale com suporte se ainda precisar de ajuda.";
}
