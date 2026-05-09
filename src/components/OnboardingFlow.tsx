import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Leaf, Sparkles } from "lucide-react";
import { generateProfileName, type UserProfile } from "../state/ondaTeslaState";

interface OnboardingFlowProps {
  readonly onComplete: (profile: UserProfile) => void;
}

type QuizKey = keyof Omit<UserProfile, "profileName">;

interface QuizQuestion {
  readonly key: QuizKey;
  readonly title: string;
  readonly type?: "text" | "number";
  readonly options?: readonly string[];
  readonly multi?: boolean;
  readonly suffix?: string;
}

const questions: readonly QuizQuestion[] = [
  { key: "name", title: "Qual seu nome?", type: "text" },
  { key: "age", title: "Qual sua idade?", type: "number", suffix: "anos" },
  { key: "height", title: "Qual sua altura?", type: "number", suffix: "cm" },
  { key: "currentWeight", title: "Qual seu peso atual?", type: "number", suffix: "kg" },
  { key: "goalWeight", title: "Qual peso deseja atingir?", type: "number", suffix: "kg" },
  { key: "mainGoal", title: "Qual seu principal objetivo?", options: ["Perder barriga", "Desinchar", "Diminuir vontade de doce", "Ter mais disposição", "Melhorar autoestima", "Sair do efeito sanfona"] },
  { key: "fatArea", title: "Onde você mais acumula gordura?", options: ["Barriga", "Coxas", "Braços", "Costas", "Quadril", "Corpo todo"] },
  { key: "bloating", title: "Você se sente inchada?", options: ["Todos os dias", "Algumas vezes na semana", "Raramente"] },
  { key: "mainDifficulty", title: "Qual sua maior dificuldade?", options: ["Ansiedade", "Fome à noite", "Vontade de doce", "Falta de tempo", "Não tenho constância", "Já começo e paro"] },
  { key: "triedBefore", title: "Você já tentou alguma dessas opções?", options: ["Dietas", "Jejum", "Academia", "Chás", "Cápsulas", "Remédios", "E-books", "Receitas da internet"], multi: true },
  { key: "routine", title: "Como está sua rotina?", options: ["Muito corrida", "Moderada", "Tenho bastante tempo", "Não tenho rotina"] },
  { key: "activityLevel", title: "Nível de atividade", options: ["Sedentária", "Caminho pouco", "Moderada", "Ativa"] },
  { key: "waterCups", title: "Quantos copos de água bebe por dia?", options: ["1 a 2", "3 a 4", "5 a 6", "7+"] },
  { key: "preferredTime", title: "Qual horário seria mais fácil fazer a receita?", options: ["Manhã", "Tarde", "Noite"] },
  { key: "sweetCraving", title: "Você costuma sentir vontade de doce?", options: ["Sim, todo dia", "Às vezes", "Pouco"] },
  { key: "sleep", title: "Como está seu sono?", options: ["Ruim", "Médio", "Bom"] },
  { key: "wantsReminders", title: "Você quer receber lembretes?", options: ["Sim", "Não"] }
];

const initialAnswers: Omit<UserProfile, "profileName"> = {
  name: "",
  age: 45,
  height: 160,
  currentWeight: 78,
  goalWeight: 68,
  mainGoal: "Perder barriga",
  fatArea: "Barriga",
  bloating: "Algumas vezes na semana",
  mainDifficulty: "Vontade de doce",
  triedBefore: ["Dietas"],
  routine: "Moderada",
  activityLevel: "Caminho pouco",
  waterCups: "3 a 4",
  preferredTime: "Manhã",
  sweetCraving: "Às vezes",
  sleep: "Médio",
  wantsReminders: "Sim"
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [introStep, setIntroStep] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [answers, setAnswers] = useState<Omit<UserProfile, "profileName">>(initialAnswers);
  const question = questions[questionIndex];
  const profile = useMemo(() => ({ ...answers, profileName: generateProfileName(answers) }), [answers]);

  useEffect(() => {
    if (!analyzing) return;
    const timer = window.setInterval(() => {
      setAnalysisProgress((value) => {
        const next = Math.min(100, value + 12);
        if (next >= 100) window.clearInterval(timer);
        return next;
      });
    }, 260);
    return () => window.clearInterval(timer);
  }, [analyzing]);

  if (introStep < 3) {
    const intro = [
      ["Não é uma receita igual para todo mundo", "O app analisa suas respostas para montar uma orientação mais adequada ao seu perfil."],
      ["Você saberá o que fazer todos os dias", "Receita, checklist, lembrete, acompanhamento e progresso em uma rotina simples."],
      ["Seu progresso fica visível", "Registre peso, cintura, inchaço, fome, disposição e fotos para acompanhar sua evolução."]
    ][introStep];
    return (
      <div className="onboarding-shell">
        <div className="onboarding-panel">
          <div className="onboarding-top"><span>{introStep + 1}/3</span><strong>Boas-vindas</strong></div>
          <div className="onboarding-progress"><span style={{ width: `${((introStep + 1) / 3) * 100}%` }} /></div>
          <section className="onboarding-question">
            <span className="protocol-eyebrow"><Leaf size={14} /> Banana App</span>
            <h1>{intro[0]}</h1>
            <p>{intro[1]}</p>
          </section>
          <button className="protocol-primary onboarding-cta" type="button" onClick={() => setIntroStep((value) => value + 1)}>
            {introStep === 2 ? "Começar agora" : "Continuar"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (analyzing) {
    const messages = [
      "Analisando suas respostas...",
      "Identificando seu perfil...",
      "Calculando sua rotina ideal...",
      "Ajustando sua Receita da Banana Bariátrica...",
      "Montando seu plano de 21 dias...",
      "Preparando seu painel de progresso...",
      "Seu plano está pronto."
    ];
    const message = messages[Math.min(messages.length - 1, Math.floor((analysisProgress / 100) * messages.length))];
    return (
      <div className="onboarding-shell">
        <div className="onboarding-panel">
          <section className="onboarding-question">
            <span className="protocol-eyebrow"><Sparkles size={14} /> Análise</span>
            <h1>{message}</h1>
            <div className="scale-card">
              <strong>{analysisProgress}%</strong>
              <div className="onboarding-progress large"><span style={{ width: `${analysisProgress}%` }} /></div>
            </div>
            {analysisProgress >= 100 ? (
              <div className="profile-result">
                <p><strong>{profile.profileName}</strong></p>
                <p>Meta: {profile.currentWeight}kg → {profile.goalWeight}kg</p>
                <p>Horário recomendado: {profile.preferredTime}</p>
              </div>
            ) : null}
          </section>
          <button className="protocol-primary onboarding-cta" type="button" disabled={analysisProgress < 100} onClick={() => onComplete(profile)}>
            Acessar meu plano
            <Check size={18} />
          </button>
        </div>
      </div>
    );
  }

  function setAnswer(value: string | number | readonly string[]) {
    setAnswers((current) => ({ ...current, [question.key]: value }));
  }

  function choose(option: string) {
    if (question.multi) {
      const current = answers[question.key];
      const list = Array.isArray(current) ? current : [];
      setAnswer(list.includes(option) ? list.filter((item) => item !== option) : [...list, option]);
      return;
    }
    setAnswer(option);
  }

  function next() {
    if (questionIndex < questions.length - 1) setQuestionIndex((value) => value + 1);
    else {
      setAnalysisProgress(0);
      setAnalyzing(true);
    }
  }

  const value = answers[question.key];
  const canContinue = Array.isArray(value) ? value.length > 0 : String(value).trim().length > 0;

  return (
    <div className="onboarding-shell">
      <div className="onboarding-panel">
        <div className="onboarding-top">
          <span>{questionIndex + 1}/{questions.length}</span>
          <strong>Quiz personalizado</strong>
        </div>
        <div className="onboarding-progress"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
        <section className="onboarding-question">
          <span className="protocol-eyebrow">Plano de 21 dias</span>
          <h1>{question.title}</h1>
          {question.type ? (
            <label className="scale-card quiz-input-card">
              <input
                autoFocus
                type={question.type}
                value={String(value)}
                onChange={(event) => setAnswer(question.type === "number" ? Number(event.target.value) : event.target.value)}
              />
              {question.suffix ? <span>{question.suffix}</span> : null}
            </label>
          ) : (
            <AnswerList question={question} value={value} choose={choose} />
          )}
        </section>
        <div className="onboarding-actions">
          <button className="protocol-secondary" type="button" disabled={questionIndex === 0} onClick={() => setQuestionIndex((value) => value - 1)}>
            <ArrowLeft size={18} /> Voltar
          </button>
          <button className="protocol-primary" type="button" disabled={!canContinue} onClick={next}>
            {questionIndex === questions.length - 1 ? "Analisar meu perfil" : "Continuar"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AnswerList({ choose, question, value }: { readonly choose: (option: string) => void; readonly question: QuizQuestion; readonly value: unknown }) {
  return (
    <div className="answer-list">
      {question.options?.map((option) => {
        const selected = Array.isArray(value) ? value.includes(option) : value === option;
        return (
          <button className={selected ? "selected" : ""} key={option} type="button" onClick={() => choose(option)}>
            {option}
            {selected ? <Check size={17} /> : null}
          </button>
        );
      })}
    </div>
  );
}
